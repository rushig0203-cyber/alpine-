#!/usr/bin/env python3
"""Paper-trading loop - run the bot live against fresh data, no API keys.

Every day (or on demand):
  1. refresh data/prices.csv (requires github.com access, see fetch_data.py)
  2. compute today's target weights exactly like the backtest
  3. diff against the last saved portfolio and print the orders to place

State is kept in results/paper_state.json; a log goes to results/paper.log.
Attach this to a cron/systemd timer, or wire the order printer to your
exchange (ccxt) when you trust it - AFTER forward-testing on paper.
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pandas as pd

from alpine.data import load_panel
from alpine.strategies.ensemble import AlpineEnsemble

ROOT = Path(__file__).resolve().parent.parent
STATE = ROOT / "results" / "paper_state.json"


def main() -> None:
    close, vol = load_panel()
    strat = AlpineEnsemble()
    w = strat.generate_weights(close, vol)
    latest = w.iloc[-1]
    today = str(close.index[-1].date())

    state = json.loads(STATE.read_text()) if STATE.exists() else {"date": None, "weights": {}}
    prev = pd.Series(state["weights"], dtype=float).reindex(latest.index).fillna(0.0)

    delta = latest - prev
    trades = delta[delta.abs() > 0.005]
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")

    print(f"[{now} UTC] signal date: {today} (data through {close.index[-1].date()})")
    print(f"target portfolio: {latest[latest > 0.005].round(3).to_dict()}")
    if state["date"] == today:
        print("(already processed today - orders already suggested)")
    if len(trades) == 0:
        print("no rebalance needed - hold")
    else:
        print("orders to place at next close:")
        for asset, d in trades.items():
            side = "BUY " if d > 0 else "SELL"
            print(f"  {side} {asset:<5} {abs(d):.1%} of equity")

    STATE.write_text(
        json.dumps({"date": today, "weights": {k: round(v, 6) for k, v in latest.items() if v > 0}}, indent=2)
    )
    with (ROOT / "results" / "paper.log").open("a") as f:
        f.write(f"{now} {today} target={latest.to_dict()} orders={trades.to_dict()}\n")


if __name__ == "__main__":
    main()
