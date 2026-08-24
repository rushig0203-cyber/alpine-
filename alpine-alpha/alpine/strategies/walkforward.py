"""Walk-forward validation - the step most GitHub bots skip.

Rolling folds: fit the (few) parameters on a TRAIN window, trade the next
TEST window with those frozen parameters, stitch all test windows together.
The stitched curve is the honest, out-of-sample performance.
"""
from __future__ import annotations

import itertools

import numpy as np
import pandas as pd

from ..backtest import BacktestConfig, run_backtest
from ..metrics import summary
from .ensemble import AlpineEnsemble


def _score(eq: pd.Series) -> float:
    """Selection score: risk-adjusted return with a drawdown penalty."""
    r = eq.pct_change().dropna()
    if len(r) < 30 or r.std() == 0:
        return -99.0
    sharpe = r.mean() / r.std() * np.sqrt(365)
    dd = (eq / eq.cummax() - 1).min()
    return sharpe * (1 + dd)  # dd is negative -> discounts shallow strategies


def walk_forward(
    close,
    volume,
    param_grid: dict | None = None,
    train_days: int = 900,
    test_days: int = 120,
    start: str = "2017-01-01",
    config: BacktestConfig | None = None,
):
    param_grid = param_grid or {
        "macd_fast": [8, 12],
        "don_n": [15, 20, 30],
        "target_vol": [0.4, 0.6],
    }
    config = config or BacktestConfig()
    dates = close.loc[start:].index
    folds = []
    stitched = []
    chosen = []
    running = 1.0
    o = 0
    while o + train_days + test_days <= len(dates):
        tr = dates[o : o + train_days]
        te = dates[o + train_days : o + train_days + test_days]
        best, best_s = None, -np.inf
        for combo in itertools.product(*param_grid.values()):
            params = dict(zip(param_grid.keys(), combo))
            strat = AlpineEnsemble(**params)
            w = strat.generate_weights(close, volume)
            res = run_backtest(w, close, BacktestConfig(start=tr[0], end=tr[-1]))
            s = _score(res.equity)
            if s > best_s:
                best_s, best = s, params
        strat = AlpineEnsemble(**best)
        w = strat.generate_weights(close, volume)
        res = run_backtest(w, close, BacktestConfig(start=te[0], end=te[-1]))
        eq = res.equity / res.equity.iloc[0]          # fold equity, starts at 1
        stitched.append(eq * running)                 # compound across folds
        running = stitched[-1].iloc[-1]
        folds.append(
            {
                "train": f"{tr[0].date()}..{tr[-1].date()}",
                "test": f"{te[0].date()}..{te[-1].date()}",
                "params": str(best),
                "test_return": float(res.equity.iloc[-1] - 1),
                "test_sharpe": summary(res, "x")["sharpe"],
            }
        )
        chosen.append(best)
        o += test_days
    oos = pd.concat(stitched)
    return oos, pd.DataFrame(folds), chosen
