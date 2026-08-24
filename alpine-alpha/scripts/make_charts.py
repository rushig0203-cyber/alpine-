#!/usr/bin/env python3
"""Generate all result charts into results/."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

from alpine.backtest import BacktestConfig, run_backtest
from alpine.data import load_panel
from alpine.metrics import max_drawdown
from alpine.strategies.baselines import (
    BuyAndHold,
    DonchianBreakout,
    MACDCross,
    RSIMeanReversion,
    SMACross,
)
from alpine.strategies.ensemble import AlpineEnsemble

RESULTS = Path(__file__).parent.parent / "results"


def main() -> None:
    plt.rcParams.update({"figure.dpi": 130, "axes.grid": True, "grid.alpha": 0.3})
    close, vol = load_panel()
    cfg = BacktestConfig(start="2017-09-01")

    strategies = [
        ("alpine-ensemble", AlpineEnsemble()),
        ("macd 12/26 (best github classic)", MACDCross()),
        ("donchian 20", DonchianBreakout()),
        ("sma 50/200", SMACross()),
        ("rsi2 reversion", RSIMeanReversion()),
        ("btc buy & hold", BuyAndHold()),
    ]
    results = {}
    for name, s in strategies:
        results[name] = run_backtest(s.generate_weights(close, vol), close, cfg)

    # --- 1. equity curves ---------------------------------------------------
    fig, ax = plt.subplots(figsize=(11, 6))
    for name, res in results.items():
        lw = 2.4 if "alpine" in name else 1.3
        color = "#d62728" if "alpine" in name else None
        ax.plot(res.equity, label=name, lw=lw, color=color, zorder=5 if "alpine" in name else 2)
    ax.set_yscale("log")
    ax.set_title("Equity curves 2017-09 -> 2026-05 (net of 0.10% fee + 0.05% slippage)")
    ax.set_ylabel("equity (x, log scale)")
    ax.legend(fontsize=8, loc="upper left")
    fig.tight_layout()
    fig.savefig(RESULTS / "equity_curves.png")
    plt.close(fig)

    # --- 2. drawdown --------------------------------------------------------
    fig, ax = plt.subplots(figsize=(11, 4))
    for name, res in results.items():
        if "rsi" in name:
            continue
        dd = res.equity / res.equity.cummax() - 1
        lw = 2.0 if "alpine" in name else 1.0
        ax.plot(dd, label=name, lw=lw)
    ax.set_title("Drawdowns")
    ax.yaxis.set_major_formatter(lambda v, _: f"{v:.0%}")
    ax.legend(fontsize=8, loc="lower left")
    fig.tight_layout()
    fig.savefig(RESULTS / "drawdowns.png")
    plt.close(fig)

    # --- 3. alpine weights/exposure ----------------------------------------
    res = results["alpine-ensemble"]
    fig, axes = plt.subplots(2, 1, figsize=(11, 7), sharex=True)
    axes[0].stackplot(
        res.weights.index,
        (res.weights["BTC"] * res.exposure).values,
        (res.weights["ETH"] * res.exposure).values,
        labels=["BTC sleeve", "ETH sleeve"],
        colors=["#f2a900", "#3c3c3d"],
        alpha=0.9,
    )
    axes[0].set_ylim(0, 1.05)
    axes[0].set_title("alpine-ensemble: target exposure by sleeve")
    axes[0].legend(fontsize=8, loc="upper left")
    dd = res.equity / res.equity.cummax() - 1
    axes[1].plot(dd, color="#d62728", lw=1.2)
    axes[1].set_title("alpine-ensemble drawdown")
    axes[1].yaxis.set_major_formatter(lambda v, _: f"{v:.0%}")
    fig.tight_layout()
    fig.savefig(RESULTS / "alpine_exposure.png")
    plt.close(fig)

    # --- 4. walk-forward OOS ------------------------------------------------
    oos = pd.read_csv(RESULTS / "walkforward_oos_equity.csv", index_col=0, parse_dates=True)
    oos.columns = ["equity"]
    fig, ax = plt.subplots(figsize=(11, 5))
    ax.plot(oos, lw=2.2, color="#d62728", label="alpine walk-forward (out-of-sample)")
    bench = close["BTC"].reindex(oos.index).ffill()
    bench = bench / bench.iloc[0]
    ax.plot(bench, lw=1.2, color="#7f7f7f", label="BTC buy & hold (same window)")
    ax.set_yscale("log")
    ax.set_title(
        f"Walk-forward validation: params frozen on trailing 900d, tested 120d\n"
        f"OOS total {oos['equity'].iloc[-1]-1:+.0%} | Sharpe 1.10 | maxDD {max_drawdown(oos['equity']):.0%} "
        f"vs BTC {bench.iloc[-1]-1:+.0%}"
    )
    ax.legend(fontsize=9)
    fig.tight_layout()
    fig.savefig(RESULTS / "walkforward_oos.png")
    plt.close(fig)

    print("charts written:", [p.name for p in RESULTS.glob("*.png")])


if __name__ == "__main__":
    main()
