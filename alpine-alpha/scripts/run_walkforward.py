#!/usr/bin/env python3
"""Walk-forward validation of the AlpineEnsemble.

Folds: 900d train -> 120d test, stepping 120d. On each fold the grid is
optimised on TRAIN only, then the frozen pick trades the TEST window.
The stitched TEST curve is the honest out-of-sample result.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pandas as pd

from alpine.backtest import BacktestConfig, run_backtest
from alpine.data import load_panel
from alpine.metrics import summary
from alpine.strategies.ensemble import AlpineEnsemble
from alpine.strategies.walkforward import walk_forward


def main() -> None:
    close, vol = load_panel()
    out = Path(__file__).parent.parent / "results"

    oos, folds, chosen = walk_forward(close, vol, start="2017-09-01")
    folds.to_csv(out / "walkforward_folds.csv", index=False)

    print("fold picks:")
    print(folds.to_string(index=False))

    # metrics for the stitched OOS equity, using a fake result object
    bench_close = close.loc[oos.index[0]:]
    res = run_backtest(
        AlpineEnsemble().generate_weights(close, vol),
        close,
        BacktestConfig(start=oos.index[0], end=oos.index[-1]),
    )
    # swap in the stitched OOS equity for metric computation
    from alpine.backtest import BacktestResult

    oos_res = BacktestResult(
        equity=oos,
        benchmark=res.benchmark.reindex(oos.index).ffill(),
        weights=res.weights.reindex(oos.index),
        daily_pnl=oos.pct_change().fillna(0),
        turnover=res.turnover.reindex(oos.index).fillna(0),
        exposure=res.exposure.reindex(oos.index).fillna(0),
    )
    m = summary(oos_res, "alpine walk-forward OOS")
    print("\nOOS:", {k: round(v, 3) for k, v in m.items() if isinstance(v, float)})

    fixed = run_backtest(
        AlpineEnsemble().generate_weights(close, vol), close,
        BacktestConfig(start=oos.index[0], end=oos.index[-1]),
    )
    bench_fixed = fixed.benchmark.reindex(oos.index).ffill()
    fixed = BacktestResult(
        equity=fixed.equity.reindex(oos.index).ffill(),
        benchmark=bench_fixed,
        weights=fixed.weights.reindex(oos.index),
        daily_pnl=fixed.daily_pnl.reindex(oos.index).fillna(0),
        turnover=fixed.turnover.reindex(oos.index).fillna(0),
        exposure=fixed.exposure.reindex(oos.index).fillna(0),
    )
    mf = summary(fixed, "alpine fixed-params same window")
    print("FIX:", {k: round(v, 3) for k, v in mf.items() if isinstance(v, float)})

    oos.to_csv(out / "walkforward_oos_equity.csv")
    print(f"\nwrote {out / 'walkforward_folds.csv'} and walkforward_oos_equity.csv")


if __name__ == "__main__":
    main()
