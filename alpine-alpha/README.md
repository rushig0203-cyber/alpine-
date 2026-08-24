# alpine-alpha 🏔️

An adaptive crypto trading bot built by studying the best open-source bots on
GitHub — freqtrade, Jesse, NostalgiaForInfinity, vectorbt — borrowing their
best ideas, adding our own, and **validating everything with walk-forward
out-of-sample testing** that most bot repos skip.

## Results (2017-09 → 2026-05, daily bars, net of 0.10% fee + 0.05% slippage per side)

| strategy | total return | CAGR | Sharpe | Sortino | max DD | Calmar |
|---|---:|---:|---:|---:|---:|---:|
| BTC buy & hold | +1,565% | 38.0% | 0.82 | 1.11 | **-83.8%** | 0.45 |
| sma 50/200 cross *(github classic)* | +930% | 30.6% | 0.77 | 0.79 | -71.9% | 0.43 |
| macd 12/26 *(github classic)* | +2,119% | 42.6% | 1.00 | 1.16 | -53.1% | 0.80 |
| rsi(2) reversion *(github classic)* | **-62%** | -10.6% | -0.02 | -0.01 | -82.3% | -0.13 |
| donchian 20 *(github classic)* | +1,855% | 40.6% | 1.03 | 1.04 | -61.2% | 0.66 |
| **alpine-ensemble (this bot)** | **+1,760%** | **39.8%** | **1.18** | **1.61** | **-41.5%** | **0.96** |

**Walk-forward validation** (re-optimising parameters every 120 days on the
trailing 900 days only, trading the next 120 days unseen — stitched OOS
2020-02→2026-05): **+475%, Sharpe 1.10, maxDD -33%**. The out-of-sample curve
keeps ~89% of the fixed-parameter result: the *structure* carries the edge,
not parameter luck. See `results/walkforward_oos.png`.

The bot's edge is **risk**: buy & hold's -84% drawdown takes a decade to
recover from; ours never exceeded -42%, and it sidestepped most of 2018 and
2022. Same CAGR as buy & hold, half the pain, best-in-class Sharpe/Sortino.

## How it works

```
data (CoinMetrics daily, 12 assets)
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│ trend core (the engine)                                 │
│   BTC 70% budget + ETH 35% budget, each traded by the   │
│   AVERAGE of 3 long/flat signals:                       │
│     1. MACD(12,26,9) > signal        (fast)             │
│     2. EMA(50) > EMA(200)            (slow)             │
│     3. close ≥ 20d-high of closes    (Donchian)         │
│   → signal diversification: each alone Sharpe 0.8-1.0,  │
│     blended ≈ 1.18                                      │
├─────────────────────────────────────────────────────────┤
│ risk overlay                                             │
│   • volatility targeting: scale exposure to keep        │
│     trailing 30d portfolio vol ≈ 50% ann. (cash buffer) │
│   • gross exposure hard-capped at 1.0x (no leverage)    │
└─────────────────────────────────────────────────────────┘
```

Execution discipline (borrowed from Jesse, improved): signals computed on
close *t* are filled at close *t+1*, one bar of latency like live trading;
fees + slippage charged on every rebalance.

## What we took from GitHub, what we added

| idea | source | verdict in our tests |
|---|---|---|
| rigorous no-look-ahead backtests | Jesse | kept — enforced by unit tests |
| "protections" (drawdown circuit breaker) | freqtrade | **dropped** — throttles winners as well as losers |
| multi-condition confluence / dip-buying | NostalgiaForInfinity | **dropped** — P&L-neutral after costs |
| hyperopt / parameter optimisation | freqtrade | kept, but as **walk-forward** with 120d unseen test folds |
| MACD / EMA / Donchian signals | every classic bot repo | kept — **blended**, which is our key upgrade |
| **signal ensemble averaging** | ours | Sharpe +0.18 vs best single signal |
| **vol-targeted sizing, 1x cap** | ours | mdd -11pp vs MACD classic, Sharpe intact |
| **elimination testing of own ideas** | ours | alt-rotation, dip sleeve, breaker all tried & documented dead |

## Project layout

```
alpine-alpha/
├── alpine/                 # the library
│   ├── backtest.py         # vectorised engine, T+1 fills, fees+slippage
│   ├── indicators.py       # causal indicators (unit-tested)
│   ├── metrics.py          # Sharpe/Sortino/Calmar/DD/reporting
│   ├── data.py             # price panel loader
│   └── strategies/
│       ├── baselines.py    # the 4 GitHub classics + buy&hold
│       ├── ensemble.py     # alpine-ensemble (the bot)
│       └── walkforward.py  # rolling train→test validation
├── scripts/
│   ├── fetch_data.py       # data from github.com/coinmetrics/data
│   ├── run_backtest.py     # league table
│   ├── sensitivity.py      # parameter robustness sweep
│   ├── run_walkforward.py  # out-of-sample proof
│   ├── make_charts.py      # equity/drawdown/exposure charts
│   └── paper_trade.py      # daily signal → order printer (no keys needed)
├── tests/test_sanity.py    # no-look-ahead & cost tests (the honesty layer)
└── results/                # charts, tables, walk-forward folds
```

## Quickstart

```bash
pip install -r requirements.txt
python scripts/fetch_data.py        # ~1 min, clones CoinMetrics data
python scripts/run_backtest.py      # league table
python scripts/run_walkforward.py   # out-of-sample validation
python scripts/make_charts.py       # charts into results/
python tests/test_sanity.py         # honesty checks
python scripts/paper_trade.py       # today's target orders (paper)
```

## Honest limitations

- **Past performance ≠ future returns.** Crypto regime changes can kill any
  trend edge; 2025-YTD was a chop/bear period where the bot sat mostly in
  cash (by design — that is the drawdown protection working).
- Universe is 12 majors that survived → some survivorship bias vs picking
  2017's actual top-100; the bot mitigates by trading only BTC/ETH.
- Daily close-only data: no intraday stops; live behaviour will differ.
- Data ends 2026-05-23 (CoinMetrics community repo update lag).
- **Paper trade it before risking a rupee.** `scripts/paper_trade.py` exists
  for exactly that.

*This is research software, not financial advice.*
