#!/usr/bin/env python3
"""Reads a headless dump of the deck and prints, per slide, the fill before
auto-fit, the scale auto-fit chose, and the fill after. Fed by deck-audit.sh."""
import re
import sys

html = sys.stdin.read()
rows = []
for tag in re.findall(r"<section[^>]*\bclass=\"slide[^\"]*\"[^>]*>", html):
    attr = dict(re.findall(r"data-([a-z]+)=\"([^\"]*)\"", tag))
    if "slide" in attr:
        rows.append((attr["slide"], attr.get("natural"), attr.get("scale"), attr.get("fill")))

if not rows:
    print("no fitted slides found — is the export built, and did the script run?")
    sys.exit(1)

print(f"{len(rows)} slide(s) in the deck\n")
print(f"{'slide':<12}{'before':>8}{'scale':>8}{'after':>8}   note")
print("-" * 46)
for sid, nat, sc, fi in rows:
    n, s, f = float(nat or 0), float(sc or 1), float(fi or 0)
    note = "overflow" if f > 1 else ("sparse" if f < 0.6 else "")
    print(f"{sid:<12}{n:>7.0%}{s:>8.2f}{f:>7.0%}   {note}")
