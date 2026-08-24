"""Vectorised technical indicators. Pure pandas, no TA-Lib needed.

All functions are causal: every output at time t only uses data up to t.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

ANN = 365.0  # crypto trades every day


def sma(x: pd.DataFrame | pd.Series, n: int) -> pd.DataFrame | pd.Series:
    return x.rolling(n, min_periods=n).mean()


def ema(x: pd.DataFrame | pd.Series, n: int) -> pd.DataFrame | pd.Series:
    return x.ewm(span=n, adjust=False, min_periods=n).mean()


def rsi(close: pd.DataFrame, n: int = 14) -> pd.DataFrame:
    """Wilder RSI."""
    delta = close.diff()
    up = delta.clip(lower=0.0)
    down = (-delta).clip(lower=0.0)
    au = up.ewm(alpha=1 / n, adjust=False, min_periods=n).mean()
    ad = down.ewm(alpha=1 / n, adjust=False, min_periods=n).mean()
    rs = au / ad.replace(0.0, np.nan)
    return (100 - 100 / (1 + rs)).fillna(50.0)


def roc(close: pd.DataFrame, n: int) -> pd.DataFrame:
    """n-day rate of change (momentum)."""
    return close.pct_change(n)


def realized_vol(close: pd.DataFrame, n: int = 30) -> pd.DataFrame:
    """Annualised rolling std of daily log returns."""
    lr = np.log(close).diff()
    return lr.rolling(n, min_periods=max(3, n // 2)).std() * np.sqrt(ANN)


def zscore(x: pd.DataFrame, n: int) -> pd.DataFrame:
    m = x.rolling(n, min_periods=n).mean()
    s = x.rolling(n, min_periods=n).std()
    return (x - m) / s.replace(0.0, np.nan)


def drawdown(close: pd.DataFrame | pd.Series) -> pd.DataFrame | pd.Series:
    return close / close.cummax() - 1.0


def trailing_stop_level(close: pd.DataFrame, n: int = 22, k: float = 3.0) -> pd.DataFrame:
    """Chandelier-style stop on close-only data: highest close of the last n
    days minus k * rolling std of closes."""
    hi = close.rolling(n, min_periods=n).max()
    sd = close.rolling(n, min_periods=n).std()
    return hi - k * sd


def rolling_sharpe(close: pd.Series, n: int = 90) -> pd.Series:
    r = close.pct_change()
    return (r.rolling(n).mean() / r.rolling(n).std().replace(0, np.nan)) * np.sqrt(ANN)
