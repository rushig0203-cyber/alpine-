#!/usr/bin/env python3
"""Sensitivity sweep over the ensemble's key parameters (full sample).

Research view only - the honest verdict comes from walk-forward, but this
tells us whether performance sits on a robust plateau or a lucky spike.
"""
from __future__ import annotations

import itertools
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pandas as pd

from alpine.backtest import BacktestConfig, run_backtest
from alpine.data import load_panel
from alpine.metrics import summary
from alpine.strategies.ensemble import AlpineEnsemble

GRID = {
    "macd_fast": [8, 12],
    "don_n": [15, 20, 30],
    "ema_fast": [40, 50],
    "target_vol": [0.4, 0.5, 0.6],
}


def main() -> None:
    close, vol = load_panel()
    rows = []
    for combo in itertools.product(*GRID.values()):
        params = dict(zip(GRID.keys(), combo))
        s = AlpineEnsemble(**params)
        w = s.generate_weights(close, vol)
        res = run_backtest(w, close, BacktestConfig(start="2017-09-01"))
        m = summary(res, str(params))
        rows.append(m)
        print(
            f"{params}  ret={m['total_return']:7.2%}  CAGR={m['CAGR']:6.1%}  "
            f"sharpe={m['sharpe']:5.2f}  mdd={m['max_dd']:6.1%}  calmar={m['calmar']:5.2f}"
        )
    out = Path(__file__).parent.parent / "results" / "sensitivity.csv"
    pd.DataFrame(rows).to_csv(out, index=False)
    print(f"\nwrote {out}")


if __name__ == "__main__":
    main()
