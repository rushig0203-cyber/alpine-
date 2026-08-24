"""Sanity tests - the honesty layer.

These tests exist because most trading-bot repos ship backtests with silent
look-ahead bias and imaginary zero-cost fills. They fail loudly here.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import numpy as np
import pandas as pd

from alpine.backtest import BacktestConfig, run_backtest
from alpine.data import load_panel
from alpine.indicators import ema, rsi, sma
from alpine.strategies.baselines import BuyAndHold, SMACross
from alpine.strategies.ensemble import AlpineEnsemble


def _synthetic_close(days: int = 400, seed: int = 7) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    idx = pd.bdate_range("2024-01-01", periods=days)
    px = 100 * np.exp(np.cumsum(rng.normal(0.001, 0.03, days)))
    return pd.DataFrame({"BTC": px, "ETH": px * rng.normal(0.05, 0.001, days)}, index=idx)


def test_indicators_are_causal():
    """An indicator's value at t must never change when future data changes."""
    df = _synthetic_close()
    for fn in (lambda x: sma(x, 10), lambda x: ema(x, 10)):
        a = fn(df)["BTC"]
        df2 = df.copy()
        df2.iloc[-50:, 0] *= 3.0  # scramble the future
        b = fn(df2)["BTC"]
        diff = (a.iloc[:-50] - b.iloc[:-50]).abs().max()
        assert diff == 0.0 or pd.isna(diff), "indicator leaks future data"


def test_no_lookahead_in_backtest():
    """Changing prices AFTER day t must not change equity up to day t."""
    df = _synthetic_close(300)
    strat = SMACross()
    w = strat.generate_weights(df, df * 0 + 1)
    r1 = run_backtest(w, df).equity
    df2 = df.copy()
    df2.iloc[-80:, :] *= 2.5
    r2 = run_backtest(strat.generate_weights(df2, df2 * 0 + 1), df2).equity
    cut = r1.index[-100]
    assert np.allclose(r1.loc[:cut], r2.loc[:cut]), "backtest leaks future data"


def test_costs_are_charged():
    """A strategy that flips position every day must bleed costs, not break even."""
    df = _synthetic_close(200)
    idx = df.index
    flip = pd.DataFrame({"BTC": (np.arange(len(idx)) % 2).astype(float)}, index=idx)
    flip["ETH"] = 0.0
    cfg = BacktestConfig(fee=0.001, slippage=0.001)
    res = run_backtest(flip, df, cfg)
    gross = df["BTC"].pct_change().fillna(0) * flip["BTC"].shift(1).fillna(0)
    assert res.daily_pnl.sum() < gross.sum(), "turnover costs were not applied"


def test_cash_weights_cap_at_one():
    close, vol = load_panel()
    w = AlpineEnsemble().generate_weights(close, vol)
    assert (w.sum(axis=1) <= 1.0 + 1e-9).all(), "gross exposure exceeded 1x"


def test_benchmark_runs():
    df = _synthetic_close()
    res = run_backtest(BuyAndHold().generate_weights(df, df), df)
    assert res.equity.iloc[-1] > 0
    assert len(res.equity) > 250


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_"):
            fn()
            print(f"PASS {name}")
    print("all tests passed")
