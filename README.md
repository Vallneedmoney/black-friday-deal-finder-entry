[![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/Vallneedmoney/black-friday-deal-finder-entry/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/Vallneedmoney/black-friday-deal-finder-entry/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

# FridayProof — Black Friday deals, checked by hand

A static deal finder of **12 real Black Friday 2026 deals**, each found and
price-checked by hand on Black Friday, 27 November 2026, at its store
(Amazon, Best Buy, Walmart). Every deal shows its product, store, store link,
sale price, usual price, discount, the time its price was checked, and the
source that showed the price — plus an honest verdict on whether it is
really a deal.

## What it does

- **Search** across product, brand, store and category
- **Filters** by category, store, minimum discount and verdict
- **Sort** by biggest discount, biggest dollar saving, lowest price, or name
- **Verdict on every deal**: `REAL DEAL` (a genuine steal, 40%+ off or an
  all-time low), `STRONG PRICE` (a solid 20–39% saving), or `MODEST CUT`
  (a real cut under 20% — no rush). Each verdict carries its reason.
- **Proof on every card**: check time and source, so a shopper can see
  where each price came from.
- **Phone layout** that works: one-column cards, stacked controls.
- **No network at run time**: all data lives in `app/data.js`; no fonts,
  images or scripts are fetched from anywhere.

## The deals

| Deal | Store | Sale | Was | Cut |
| --- | --- | --- | --- | --- |
| Apple AirPods Pro 3 | Amazon | $149.00 | $249.00 | 40% |
| TCL 65" S4CF 4K Fire TV (2026) | Best Buy | $229.99 | $469.99 | 51% |
| Sony WH-1000XM5, Black | Best Buy | $169.99 | $398.00 | 57% |
| HP OmniBook 5 14" 2K OLED (256GB) | Best Buy | $449.99 | $799.99 | 44% |
| LG 55" B6E OLED 4K (2026) | Best Buy | $699.99 | $1,399.99 | 50% |
| Dyson V9 Motorbar | Amazon | $269.95 | $599.99 | 55% |
| Apple Watch Series 12 GPS 46mm | Amazon | $299.00 | $399.00 | 25% |
| Nintendo Switch 2 + Mario Kart World Bundle | Amazon | $499.99 | $549.99 | 9% |
| Beats Studio Pro, White & Black | Walmart | $99.00 | $299.00 | 67% |
| Apple AirPods Max 2 | Amazon | $419.00 | $549.00 | 24% |
| Samsung 9100 PRO 2TB SSD | Amazon | $349.99 | $679.97 | 49% |
| Kindle Paperwhite 16GB (12th gen) | Amazon | $129.99 | $199.99 | 35% |

Average cut 42%, total saving $2,828.03. All prices read 27 Nov 2026,
21:00 WIB. Prices move all day on Black Friday — re-check at checkout.

## Run it

```sh
# Serve the static site (any static server works)
node serve.ts            # or: npx serve app / python3 -m http.server -d app
# Open http://localhost:8080

# Build the hand-in output (app/ + screenshots/ + dossier.json)
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `main.ts` — hand-in program: copies `app/` and `screenshots/` to
  `/output` and writes `dossier.json` with the vendored make.fun library.
- `app/index.html` — page shell, controls, stats, method section.
- `app/style.css` — the whole look: warm paper, dark ink, burnt orange.
- `app/data.js` — the twelve checked deals, with source and verdict notes.
- `app/filters.js` — pure filter/sort rules (also reads `?q=&cat=&store=&min=&verdict=&sort=` from the URL).
- `app/main.js` — renders the cards and wires the controls.
- `screenshots/` — real renders of the site.
- `vendor/makefun-frontend.ts` — copied from the kit, unchanged.

## License

MIT — see [LICENSE](LICENSE).
