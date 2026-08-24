#!/usr/bin/env python3
"""Fetch daily price/volume data for the alpine-alpha universe.

Source: CoinMetrics community data (github.com/coinmetrics/data), cloned via
git (works even on sandboxes where most exchange APIs are blocked).

Output: data/prices.csv with columns
    date, asset, close, volume_usd
Close = ReferenceRateUSD (falls back to PriceUSD), volume = reported spot USD.
"""
from __future__ import annotations

import csv
import shutil
import subprocess
import sys
from pathlib import Path

REPO = "https://github.com/coinmetrics/data.git"
UNIVERSE = [
    "btc", "eth", "ltc", "xmr", "dash", "doge", "xrp", "bch", "ada",
    "link", "dot", "aave",
]
HERE = Path(__file__).resolve().parent.parent
DATA = HERE / "data"


def main() -> None:
    DATA.mkdir(exist_ok=True)
    tmp = Path("/tmp/cmdata")
    if not (tmp / "csv").exists():
        print("cloning coinmetrics/data ...")
        subprocess.run(
            ["git", "clone", "-q", "--depth", "1", REPO, str(tmp)], check=True
        )
    out_rows: list[dict] = []
    for asset in UNIVERSE:
        path = tmp / "csv" / f"{asset}.csv"
        if not path.exists():
            print(f"!! {asset}: file missing, skipped")
            continue
        with path.open() as f:
            n = 0
            for row in csv.DictReader(f):
                close = row.get("ReferenceRateUSD") or row.get("PriceUSD") or ""
                vol = row.get("volume_reported_spot_usd_1d") or ""
                if close and close not in ("NaN", "0"):
                    out_rows.append(
                        {
                            "date": row["time"],
                            "asset": asset.upper(),
                            "close": close,
                            "volume_usd": vol if vol and vol != "NaN" else "",
                        }
                    )
                    n += 1
        print(f"{asset:5s} {n} rows")
    out = DATA / "prices.csv"
    with out.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["date", "asset", "close", "volume_usd"])
        w.writeheader()
        w.writerows(out_rows)
    print(f"wrote {out} ({out.stat().st_size/1e6:.2f} MB, {len(out_rows)} rows)")
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
