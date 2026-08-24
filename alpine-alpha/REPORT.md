# alpine-alpha — Research Report

*Built 2026-08-24. All results net of 0.10% taker fee + 0.05% slippage per side,
T+1 close execution, no leverage. Data: CoinMetrics community daily closes
(github.com/coinmetrics/data), 12 assets, 2010→2026-05-23; evaluation window
2017-09-01 (ETH listed) → 2026-05-23.*

## 1. Goal

Build a bot better than typical GitHub trading bots: beat the classic
strategies on risk-adjusted return, prove it out-of-sample, and keep the
whole pipeline honest (no look-ahead, real costs, documented failures).

## 2. Baselines — the strategies most GitHub bots actually ship

| strategy | total | CAGR | Sharpe | maxDD | verdict |
|---|---:|---:|---:|---:|---|
| BTC buy & hold | +1,565% | 38.0% | 0.82 | -83.8% | high return, ruinous risk |
| SMA 50/200 golden cross | +930% | 30.6% | 0.77 | -71.9% | slow, whipsawed |
| MACD 12/26/9 | +2,119% | 42.6% | 1.00 | -53.1% | best classic |
| RSI(2) mean reversion | -62% | -10.6% | -0.02 | -82.3% | bleeds to death with fees |
| Donchian 20 breakout | +1,855% | 40.6% | 1.03 | -61.2% | strong, deep DD |

## 3. What we tried, in order (the full graveyard)

Each idea was built, backtested on the identical engine, and kept only if it
improved risk-adjusted return. **Negative results included on purpose.**

### 3.1 Cross-sectional alt momentum rotation ✗
Rank 12 assets by risk-adjusted momentum (skip-month 90d/180d), hold top 1-3
with absolute-momentum gates, chandelier stops, Monday rebalance.
**Result: best variant Sharpe 0.60, maxDD -74%.** The top-momentum alt is by
construction the most extended asset at every regime turn — on 2018-01-01 it
selected ADA (up 9,000% in 2017) days before a 90% decline. Every gating
scheme (absolute momentum, BTC-EMA200 regime gate, trailing stops, weekly
re-arm) reduced but never eliminated the damage; Sharpe fell in *all* 16
sensitivity combos vs the plain BTC trend core. Dropped.

### 3.2 NostalgiaForInfinity-style dip buying ✗
Buy z-score < -1.5 dips when BTC's EMA200 trend is up, exit on reversion.
Roughly P&L-neutral after costs (~0 extra return, no DD improvement).
Dropped.

### 3.3 Freqtrade-style drawdown circuit breaker ✗
Halve exposure after 25% strategy drawdown (rolling 180d window, latch).
Implementation note: an *all-time* drawdown latch creates a doom loop
(half-exposure recovers too slowly to ever release). Even the fixed rolling
version reduced winners as much as losers — Sharpe-neutral at best, return
-negative. Dropped. (The trend gate already provides crash protection.)

### 3.4 Signal ensemble averaging ✓ (the key upgrade)
Average three long/flat signals on the same asset:

| | MACD 12/26 | EMA 50/200 | Donchian 20 | **average of 3** |
|---|---:|---:|---:|---:|
| Sharpe (BTC only) | 1.00 | 0.80 | 0.98 | **1.11** |
| maxDD | -53% | -77% | -29% | -46% |

Imperfectly correlated signals cancel whipsaws — a free lunch. Adding ETH
(35% budget, same blend) diversifies trend timing: BTC 70%/ETH 35% →
**Sharpe 1.15, maxDD -34.5%**.

### 3.5 Volatility targeting ✓
Scale gross exposure so trailing-30d portfolio vol ≈ target (scale ≤ 1).
Consistently +0.02-0.04 Sharpe and -2-3pp maxDD across every variant tested.
Default target 50% ann.

## 4. Final bot — alpine-ensemble

BTC 70% + ETH 35% budgets × averaged (MACD, EMA50/200, Donchian-20) signals,
vol-targeted to 50%, gross ≤ 1.0x.

**Full sample 2017-09→2026-05: +1,760% total, 39.8% CAGR, Sharpe 1.18,
Sortino 1.61, maxDD -41.5%, Calmar 0.96** — vs buy&hold +1,565% at maxDD
-83.8%. Equal CAGR, half the drawdown, +44% more Sharpe.

Year by year (bot vs BTC):

| 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 YTD |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| -22% vs -73% | +27% vs +94% | +105% vs +305% | +67% vs +60% | -17% vs -64% | +33% vs +156% | +40% vs +121% | -5% vs -6% | ~0% vs -13% |

It underperforms in vertical bulls (2020) — the cost of the overlay — and
massively outperforms in bears (2018: -22% vs -73%; 2022: -17% vs -64%),
which is where compounding is actually won.

## 5. Robustness

- **Parameter sensitivity** (36 combos, `results/sensitivity.csv`): Sharpe
  range 1.07–1.21, no cliffs — performance sits on a plateau, not a spike.
- **Walk-forward** (900d train / 120d test, 19 folds, grid 12 combos/fold,
  `results/walkforward_folds.csv`): stitched OOS 2020-02→2026-05
  **+475%, Sharpe 1.10, maxDD -33%** vs fixed-params +536% / 1.12 / -34% on
  the same window. ~89% retention ⇒ the edge is structural, not fitted.
- **Causality unit tests** (`tests/`): scrambling future data cannot change
  past equity; costs verified to bleed a daily-flip strategy.

## 6. Limitations & live-trading notes

1. Survivorship: 12-coin universe chosen from today's survivors; the bot only
   trades BTC/ETH (the two least-affected picks) — still a caveat.
2. Close-only daily data: no intraday stops; a live flash crash can exceed
   backtest drawdowns.
3. Data ends 2026-05-23 (CoinMetrics lag); 2025→2026 was chop/bear and the
   bot sits mostly in cash — protective, but expect flat periods.
4. Parameter picks in walk-forward used only *past* windows by construction;
   the fixed defaults in `ensemble.py` were informed by full-sample research
   (the honest number is the walk-forward one).
5. Slippage on daily closes for BTC/ETH majors is realistic at 5bps; alt
   execution would be worse.

## 7. Going forward

- Paper trade via `scripts/paper_trade.py` (cron daily) for ≥ 1–3 months.
- Compare live fills vs assumptions before sizing up.
- Only then consider live execution via ccxt with small size — and re-run
  walk-forward monthly as new data lands.
