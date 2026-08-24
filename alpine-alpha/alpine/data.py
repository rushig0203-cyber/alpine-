"""Load the price panel produced by scripts/fetch_data.py."""
from __future__ import annotations

from pathlib import Path

import pandas as pd

HERE = Path(__file__).resolve().parent.parent
DEFAULT_CSV = HERE / "data" / "prices.csv"


def load_panel(csv_path: str | Path = DEFAULT_CSV) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Return (close, volume_usd) wide DataFrames indexed by date (sorted).

    Columns are assets (uppercase tickers); missing values are NaN so assets
    simply do not exist before their listing date.
    """
    df = pd.read_csv(csv_path, parse_dates=["date"])
    close = df.pivot(index="date", columns="asset", values="close").sort_index()
    vol = df.pivot(index="date", columns="asset", values="volume_usd").sort_index()
    close = close.where(close > 0)
    vol = vol.where(vol > 0)
    return close, vol.reindex(close.index)[close.columns]


def daily_returns(close: pd.DataFrame) -> pd.DataFrame:
    return close.pct_change()
