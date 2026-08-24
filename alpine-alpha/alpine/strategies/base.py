"""Strategy interface: each strategy maps (close, volume) -> target weights.

Weights are a dates x assets DataFrame; each row sums to <= 1 (rest is cash).
Strategies only see data up to the row's date - the backtester adds one bar
of execution latency on top, so there is no look-ahead anywhere.
"""
from __future__ import annotations

import pandas as pd


class Strategy:
    name: str = "base"
    universe: tuple[str, ...] = ("BTC",)

    def generate_weights(self, close: pd.DataFrame, volume: pd.DataFrame) -> pd.DataFrame:
        raise NotImplementedError

    def __repr__(self) -> str:  # pragma: no cover
        return f"<{self.name}>"
