"""AlpineEnsemble - the bot this project is built around.

Design (final, after extensive elimination testing - see REPORT.md):

  TREND CORE, SIGNAL ENSEMBLE
  BTC (0.70 budget) and ETH (0.35) are each traded with the AVERAGE of three
  classic long/flat trend signals:
      1. MACD(12, 26, 9)  > signal                 (fast trend)
      2. EMA(50)          > EMA(200)               (slow trend)
      3. close            >= 20-day-high of closes (Donchian breakout)
  Averaging three imperfectly-correlated signals smooths the equity curve -
  each signal alone has Sharpe 0.8-1.0, the blend reaches ~1.15-1.2.

  RISK OVERLAY
  Volatility targeting: total exposure scales to keep trailing 30d portfolio
  vol near 50% annualised (scale <= 1, cash is the buffer). Adds ~0.03 Sharpe
  and trims 2-3pp of drawdown in every variant we tested.

  WHAT WE TESTED AND DROPPED (negative results are results):
  * cross-sectional alt momentum rotation - added return in 2021, destroyed
    Sharpe everywhere else (top-momentum alt = most extended asset at every
    regime turn; 2018 pick was ADA, at the exact top);
  * NostalgiaForInfinity-style dip buying - roughly P&L-neutral after costs;
  * drawdown circuit breaker (freqtrade-style) - throttles winners as
    effectively as losers; the trend gate already does this job better.

Execution discipline (see backtest.py): signals from close t are filled at
close t+1, 0.10% fee + 0.05% slippage per side on turnover.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from .. import indicators as ind
from .base import Strategy


class AlpineEnsemble(Strategy):
    name = "alpine-ensemble"

    def __init__(
        self,
        macd_fast: int = 12,
        macd_slow: int = 26,
        ema_fast: int = 50,
        ema_slow: int = 200,
        don_n: int = 20,
        btc_budget: float = 0.70,
        eth_budget: float = 0.35,
        target_vol: float = 0.50,
    ):
        self.macd_fast, self.macd_slow = macd_fast, macd_slow
        self.ema_fast, self.ema_slow = ema_fast, ema_slow
        self.don_n = don_n
        self.btc_budget, self.eth_budget = btc_budget, eth_budget
        self.target_vol = target_vol

    # ---- signals -----------------------------------------------------------

    def trend_blend(self, px: pd.Series) -> pd.Series:
        """Average of three long/flat trend signals, value in [0, 1]."""
        macd = ind.ema(px, self.macd_fast) - ind.ema(px, self.macd_slow)
        sig = ind.ema(macd, 9)
        s_macd = (macd > sig).astype(float)
        s_ema = (ind.ema(px, self.ema_fast) > ind.ema(px, self.ema_slow)).astype(float)
        s_don = (px >= px.rolling(self.don_n).max().shift(1)).astype(float)
        return (s_macd + s_ema + s_don) / 3.0

    # ---- risk overlay ------------------------------------------------------

    def _vol_target(self, w: pd.DataFrame, close: pd.DataFrame) -> pd.DataFrame:
        r = close.pct_change()
        port_ret = (w.shift(1) * r).sum(axis=1)  # what these weights would have earned
        port_vol = port_ret.rolling(30, min_periods=10).std() * np.sqrt(365)
        scale = (self.target_vol / port_vol.replace(0.0, np.nan)).clip(upper=1.0).fillna(1.0)
        return w.mul(scale.shift(1).fillna(1.0), axis=0)

    # ---- assembly ----------------------------------------------------------

    def generate_weights(self, close: pd.DataFrame, volume: pd.DataFrame) -> pd.DataFrame:
        w = pd.DataFrame(0.0, index=close.index, columns=close.columns)
        w["BTC"] = self.trend_blend(close["BTC"]) * self.btc_budget
        w["ETH"] = self.trend_blend(close["ETH"]) * self.eth_budget
        w = self._vol_target(w, close)
        gross = w.sum(axis=1)
        return w.div(gross.where(gross > 1.0, 1.0), axis=0)
