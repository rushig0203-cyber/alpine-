"""Performance metrics for backtests. Crypto convention: 365 days/year."""
from __future__ import annotations

import numpy as np
import pandas as pd

ANN = 365.0


def max_drawdown(equity: pd.Series) -> float:
    return float((equity / equity.cummax() - 1.0).min())


def summary(result, name: str, benchmark_name: str = "BTC buy&hold") -> dict:
    eq = result.equity
    years = (eq.index[-1] - eq.index[0]).days / ANN
    ret = float(eq.iloc[-1] / eq.iloc[0] - 1.0)
    cagr = float((eq.iloc[-1] / eq.iloc[0]) ** (1.0 / years) - 1.0)
    r = eq.pct_change().dropna()
    vol = float(r.std() * np.sqrt(ANN))
    sharpe = float(r.mean() / r.std() * np.sqrt(ANN)) if r.std() > 0 else 0.0
    downside = r[r < 0].std()
    sortino = float(r.mean() / downside * np.sqrt(ANN)) if downside and downside > 0 else np.inf
    mdd = max_drawdown(eq)
    calmar = cagr / abs(mdd) if mdd < 0 else np.inf
    exposed = result.exposure[result.exposure > 0.01]
    expo = float(len(exposed) / max(1, len(result.exposure)))
    active = r[result.exposure.reindex(r.index).fillna(0) > 0.01]
    win_rate = float((active > 0).mean()) if len(active) else float("nan")
    pf = float(active[active > 0].sum() / -active[active < 0].sum()) if (active < 0).any() else np.inf
    bench_ret = float(result.benchmark.iloc[-1] / result.benchmark.dropna().iloc[0] - 1.0)
    return {
        "strategy": name,
        "total_return": ret,
        "CAGR": cagr,
        "vol": vol,
        "sharpe": sharpe,
        "sortino": sortino,
        "max_dd": mdd,
        "calmar": calmar,
        "exposure": expo,
        "win_day_rate": win_rate,
        "profit_factor": pf,
        "avg_turnover_day": float(result.turnover.mean()),
        "n_days": len(eq),
        "benchmark_return": bench_ret,
    }


def yearly_returns(equity: pd.Series) -> pd.Series:
    y = equity.resample("YE").last()
    y0 = pd.concat([pd.Series([equity.iloc[0]]), y])
    y0.index = pd.Index([equity.index[0].year] + list(y.index.year), name="year")
    yret = y0.groupby(level=0).last().pct_change().dropna()
    yret.index = yret.index.astype(int)
    return yret
