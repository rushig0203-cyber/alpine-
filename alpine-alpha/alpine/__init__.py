"""alpine-alpha — an adaptive ensemble crypto trading bot.

Borrows proven ideas from the best open-source bots (freqtrade protections &
hyperopt discipline, Jesse's no-look-ahead backtests, NostalgiaForInfinity's
multi-condition confluence) and adds its own: dual-momentum rotation with
regime switching, volatility-targeted sizing, a drawdown circuit breaker, and
mandatory walk-forward validation.
"""
__version__ = "0.1.0"
