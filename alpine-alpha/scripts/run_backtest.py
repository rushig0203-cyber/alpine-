#!/usr/bin/env python3
"""Run every strategy through the same engine and print the league table."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pandas as pd

from alpine.backtest import BacktestConfig, run_backtest
from alpine.data import load_panel
from alpine.metrics import summary
from alpine.strategies.baselines import (
    BuyAndHold,
    DonchianBreakout,
    MACDCross,
    RSIMeanReversion,
    SMACross,
)
from alpine.strategies.ensemble import AlpineEnsemble

STRATS = [
    BuyAndHold(),
    SMACross(),
    MACDCross(),
    RSIMeanReversion(),
    DonchianBreakout(),
    AlpineEnsemble(),
]


def main():
    close, vol = load_panel()
    rows = []
    results = {}
    for s in STRATS:
        w = s.generate_weights(close, vol)
        res = run_backtest(w, close, BacktestConfig(start="2017-09-01"))
        results[s.name] = res
        rows.append(summary(res, s.name))
    df = pd.DataFrame(rows).set_index("strategy")
    pd.set_option("display.float_format", lambda v: f"{v:,.3f}")
    pd.set_option("display.width", 200)
    print(df[["total_return", "CAGR", "vol", "sharpe", "sortino", "max_dd",
              "calmar", "exposure", "win_day_rate", "profit_factor"]])
    df.to_csv(Path(__file__).parent.parent / "results" / "league_table.csv")
    return results


if __name__ == "__main__":
    main()
