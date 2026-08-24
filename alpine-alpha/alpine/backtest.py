"""Portfolio backtester with next-bar execution and realistic costs.

Model (vectorised, Jesse-style no-look-ahead):
  * A strategy publishes TARGET WEIGHTS using data up to the close of day t.
  * Those weights earn day t -> t+1 asset returns (so a signal decided at
    close t is filled at close t+1 - one bar of latency, like live trading).
  * Rebalancing to new targets costs `cost_rate` per unit of turnover
    (fee + slippage, charged on both buy and sell legs via absolute turnover).

This is deliberately conservative: no same-bar fills, no zero-cost fantasy.
"""
from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pandas as pd


@dataclass
class BacktestConfig:
    fee: float = 0.0010          # taker fee per side (Binance spot tier)
    slippage: float = 0.0005     # extra slippage per side
    start: str | None = None     # optional 'YYYY-MM-DD'
    end: str | None = None

    @property
    def cost_rate(self) -> float:
        return self.fee + self.slippage


@dataclass
class BacktestResult:
    equity: pd.Series                 # strategy equity (starts at 1.0)
    benchmark: pd.Series              # buy & hold BTC, same window
    weights: pd.DataFrame             # actual (pre-drift) target weights
    daily_pnl: pd.Series
    turnover: pd.Series               # units traded per day (sum |dw|)
    exposure: pd.Series               # gross exposure (0..1)
    config: BacktestConfig = field(default_factory=BacktestConfig)

    @property
    def net_value_curve_of_costs(self) -> float:
        return float((1 - self.turnover * self.config.cost_rate).prod())


def run_backtest(
    target_weights: pd.DataFrame,
    close: pd.DataFrame,
    config: BacktestConfig | None = None,
) -> BacktestResult:
    """Run the portfolio backtest.

    target_weights: dates x assets desired weights (rows sum to <= 1).
    close:          dates x assets close prices (NaN = not listed).
    """
    config = config or BacktestConfig()
    W = target_weights.reindex(close.index).copy()
    W = W.where(close.notna(), 0.0)          # cannot hold unlisted assets
    W = W.clip(lower=0.0)
    W = W.div(W.sum(axis=1).where(W.sum(axis=1) > 1.0, 1.0), axis=0)  # cap gross at 1x

    R = close.pct_change()
    R = R.fillna(0.0).where(close.notna(), 0.0)  # unlisted days contribute 0

    if config.start:
        W = W.loc[config.start:]
    if config.end:
        W = W.loc[:config.end]
    W = W.dropna(how="all").iloc[1:]         # need one bar of history to trade

    w_prev = W.shift(1).fillna(0.0)
    r = R.reindex(W.index)
    gross = (w_prev * r).sum(axis=1)          # return of yesterday's targets

    # true turnover: drifted weights vs new targets
    growth = 1.0 + gross
    growth = growth.where(growth > 0, 0.0)
    w_drift = w_prev.mul((1.0 + r), axis=0).div(growth, axis=0).fillna(0.0)
    turnover = (W - w_drift).abs().sum(axis=1)

    net = gross - turnover * config.cost_rate
    equity = (1.0 + net).cumprod()
    equity = pd.concat([pd.Series([1.0], index=[W.index[0] - pd.Timedelta(days=1)]), equity])

    btc = close["BTC"].reindex(equity.index).ffill()
    first_valid = btc.first_valid_index()
    bench = btc / btc.loc[first_valid]

    return BacktestResult(
        equity=equity,
        benchmark=bench,
        weights=W,
        daily_pnl=net,
        turnover=turnover,
        exposure=W.sum(axis=1),
        config=config,
    )
