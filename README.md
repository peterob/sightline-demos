# Sightline & CAST Prototype Gallery

Private prototype gallery for customer demos, sales conversations, and CFO advisory engagements.

## What's Inside

- **167 prototypes** — 22 curated + 62 HTML + 83 JSX (React wrapped) — from chat exports spanning Dec 2025 – Jun 2026
- **Master lead-sheet** as the new homepage (`index.html`) — dense vertical list, sorted newest first, search/filter by category, status, and type
- **Curated gallery view** preserved at `gallery.html` (the original card-style grid)
- **6 strategy documents** in `docs/` (catalog, feature matrix, demo paths, design insights, settlement architecture, proof-based settlement)

## Folder Structure

```
sightline-demos/
├── index.html              # Master lead-sheet (start here)
├── gallery.html            # Original curated card view
├── robots.txt              # Prevents search engine indexing
├── docs/                   # Strategy & reference documents
│   ├── catalog.html
│   ├── feature-matrix.html
│   ├── demo-paths.html
│   ├── design-insights.html
│   ├── settlement-architecture.html
│   └── proof-based-settlement.html
├── prototypes/             # 22 curated prototypes (kebab-case names)
│   └── …
├── prototypes-2025/        # 25 HTML prototypes from Claude Chat (Dec 2025–Feb 2026)
│   └── …
├── prototypes-2026/        # 37 HTML prototypes from Claude Chat (Mar–Jun 2026)
│   └── …
└── prototypes-jsx/         # 83 React/JSX prototypes wrapped to render in-browser
    ├── *.html              # 81 self-contained wrappers (Babel standalone + CDN React)
    ├── source/             # Original .jsx files from past 90 days (8 files)
    ├── 2025-source/        # Original .jsx files from past year (44 files)
    └── home-claude-source/ # Original .jsx files from /home/claude/ scratch dir (31 files)
```

## How to Use the Lead Sheet

The lead sheet (`index.html`) is built for review:

- **Sorted newest first**, grouped by month
- **Search box** matches filename, description, category, and source conversation
- **Category filter** (CAST core, settlement, AP/PO, advisory, etc.)
- **Status filter** — current, superseded, internal-only
- **Superseded items** are dimmed and labeled with what replaces them
- **Click any filename** to open the prototype in a new tab

## Status Tags

| Tag | Meaning |
|-----|---------|
| Current | Live, demo-ready |
| Superseded by `<file>` | Older version of an active prototype |
| Internal | Planning doc / dev reference / customer-intake form (not demo-facing) |

## Type Tags

| Tag | Meaning |
|-----|---------|
| HTML | Self-contained static page |
| JSX | React component wrapped with Babel standalone — first render takes ~1 sec while Babel compiles. CDN dependencies: React 18, Tailwind, plus lucide/d3 where used. |

## Deployment

This folder is already structured for static hosting. To deploy:

### GitHub Pages (chosen path)

```bash
cd "/Users/digitalfinance/1. PROTOS/sightline-demos"
git add .
git commit -m "Add 38 prototypes from Claude Chat past 90 days + master lead-sheet"
git push
```

If this is the first push:
```bash
git init
git add .
git commit -m "Initial prototype gallery"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sightline-demos.git
git push -u origin main
```
Then in your GitHub repo: Settings → Pages → Source: `main` branch, `/ (root)` folder.

### Privacy

`robots.txt` prevents search-engine indexing. The URL is public but unlisted — only people you share it with will see it.

For password protection, switch to Netlify, Cloudflare Pages Access, or Vercel — GitHub Pages does not support password gating.

---

Generated: June 2026 · 167 prototypes total · 22 curated + 62 HTML + 83 JSX from Claude Chat data exports (past year + past 90 days + /home/claude/ scratch dir)
