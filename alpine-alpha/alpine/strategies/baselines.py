"""Classic single-asset strategies - the kind shipped by most GitHub bots.

They are our baselines: identical engine, identical costs, identical
discipline. Everything they make (or lose) is directly comparable to the
ensemble bot.
"""
from __future__ import annotations

import pandas as pd

from .. import indicators as ind
from .base import Strategy


def _single(asset: str, signal: pd.Series) -> pd.DataFrame:
    """signal: boolean Series -> long/cash weights frame for one asset."""
    w = pd.DataFrame({asset: signal.astype(float)})
    w[asset] = w[asset].where(signal.notna(), 0.0)
    return w


class SMACross(Strategy):
    """Golden cross: long BTC while SMA(fast) > SMA(slow)."""

    name = "sma_cross (github classic)"

    def __init__(self, fast: int = 50, slow: int = 200, asset: str = "BTC"):
        assert fast < slow
        self.fast, self.slow, self.asset = fast, slow, asset
        self.universe = (asset,)
        self.name = f"sma_{fast}_{slow} (github classic)"

    def generate_weights(self, close, volume):
        c = close[self.asset]
        sig = ind.sma(c, self.fast) > ind.sma(c, self.slow)
        return _single(self.asset, sig)


class MACDCross(Strategy):
    """MACD(12,26) signal-line cross, long only."""

    name = "macd (github classic)"

    def __init__(self, fast: int = 12, slow: int = 26, signal: int = 9, asset: str = "BTC"):
        self.fast, self.slow, self.signal, self.asset = fast, slow, signal, asset
        self.universe = (asset,)
        self.name = f"macd_{fast}_{slow}_{signal} (github classic)"

    def generate_weights(self, close, volume):
        c = close[self.asset]
        macd = ind.ema(c, self.fast) - ind.ema(c, self.slow)
        sig = ind.ema(macd, self.signal)
        return _single(self.asset, macd > sig)


class RSIMeanReversion(Strategy):
    """Connors-style RSI(2) dip buyer: buy oversold, exit on recovery."""

    name = "rsi2_reversion (github classic)"

    def __init__(self, n: int = 2, buy_below: float = 10.0, exit_above: float = 60.0,
                 asset: str = "BTC"):
        self.n, self.buy_below, self.exit_above, self.asset = n, buy_below, exit_above, asset
        self.universe = (asset,)
        self.name = f"rsi{n}_reversion (github classic)"

    def generate_weights(self, close, volume):
        c = close[self.asset]
        r = ind.rsi(c, self.n)
        # long while inside an oversold episode that has not yet recovered
        episode = (r < self.buy_below).rolling(10, min_periods=1).max().astype(bool)
        sig = episode & (r < self.exit_above)
        return _single(self.asset, sig)


class DonchianBreakout(Strategy):
    """Turtle-style 20d breakout on close, exit below 10d low of closes."""

    name = "donchian (github classic)"

    def __init__(self, entry_n: int = 20, exit_n: int = 10, asset: str = "BTC"):
        self.entry_n, self.exit_n, self.asset = entry_n, exit_n, asset
        self.universe = (asset,)
        self.name = f"donchian_{entry_n} (github classic)"

    def generate_weights(self, close, volume):
        c = close[self.asset]
        entry = c >= c.rolling(self.entry_n).max().shift(1)
        exit_ = c <= c.rolling(self.exit_n).min().shift(1)
        # stateful: hold from entry until exit (vectorised via ffill of events)
        raw = pd.Series(pd.NA, index=c.index, dtype="boolean")
        raw[entry] = True
        raw[exit_] = False
        sig = raw.ffill().astype("boolean").fillna(False).astype(bool)
        return _single(self.asset, sig)


class BuyAndHold(Strategy):
    name = "buy_hold_btc"

    def __init__(self, asset: str = "BTC"):
        self.asset = asset
        self.universe = (asset,)
        self.name = f"{asset.lower()} buy & hold"

    def generate_weights(self, close, volume):
        return _single(self.asset, pd.Series(True, index=close.index))
