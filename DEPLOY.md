# Deploy Guide — sightline-demos

**Repo name:** `sightline-demos`
**Final URL:** `https://YOUR-USERNAME.github.io/sightline-demos/`

## What you're about to publish

**137 prototypes** spanning **December 5, 2025 → June 5, 2026** (7 months):

| Bucket | Count | Folder | Time period |
|---|---|---|---|
| Curated gallery (original) | 22 | `prototypes/` | Feb 2026 – early Mar 2026 |
| HTML from Claude Chat (past year batch) | 25 | `prototypes-2025/` | Dec 5, 2025 – Feb 5, 2026 |
| HTML from Claude Chat (past 90 days batch) | 38 | `prototypes-2026/` | Mar 12, 2026 – Jun 5, 2026 |
| React/JSX from Claude Chat (both batches) | 52 | `prototypes-jsx/` | Dec 5, 2025 – Mar 3, 2026 |
| **Total** | **137** | | **Dec 5, 2025 – Jun 5, 2026** |

Plus 6 strategy documents in `docs/`. Folder is **7.7 MB** uncompressed.

---

## Step 1: Create the GitHub repo

1. Go to https://github.com/new
2. **Repository name:** `sightline-demos`
3. **Description (optional):** `Sightline & CAST prototype gallery — internal preview`
4. Visibility: **Public** (required for free GitHub Pages — `robots.txt` blocks search indexing)
5. **Do not** initialize with README, .gitignore, or license — we already have those
6. Click **Create repository**

GitHub will show you a "quick setup" page with commands. Ignore those — use the ones below.

## Step 2: Push the folder

Open your terminal and run:

```bash
cd "/Users/digitalfinance/1. PROTOS/sightline-demos"

git init
git add .
git commit -m "Initial prototype gallery — 137 prototypes, Dec 2025 to Jun 2026"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sightline-demos.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username. If you tell me your username I can give you the exact line.

You'll be prompted to authenticate — if you haven't used `git push` with GitHub before, the easiest path is to install the GitHub CLI (`brew install gh && gh auth login`) and re-run the push.

## Step 3: Enable GitHub Pages

1. On your new repo page, click **Settings** (top nav)
2. Click **Pages** in the left sidebar
3. Under **Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` · **Folder:** `/ (root)`
4. Click **Save**

The page will refresh and show a banner: *"Your site is live at https://YOUR-USERNAME.github.io/sightline-demos/"* — usually within 1–2 minutes. First load can take longer; subsequent pushes deploy in ~30 seconds.

## Step 4: Verify

Open the URL. You should see the **Master Prototype Lead Sheet** (the dark dense list with 137 items). Click a few prototype links to confirm they render. JSX prototypes will show a brief "Compiling React component…" message before rendering.

## Updating later

Any time you change files in this folder:

```bash
cd "/Users/digitalfinance/1. PROTOS/sightline-demos"
git add .
git commit -m "What changed"
git push
```

GitHub Pages auto-redeploys within ~30 seconds.

## Privacy notes

- **Anyone with the URL can view it** — there's no login wall on GitHub Pages free tier
- `robots.txt` blocks Google/Bing from crawling, so it won't show up in search results
- Share the URL via email/Slack/DM, not public posts
- **Don't** put anything truly confidential (real customer data, unredacted financials) into this repo — it's public on github.com even if unindexed

If you ever need real privacy (password gate or SSO), the upgrade path is **Cloudflare Pages with Access** (free, restricts to specific email addresses) or **Netlify with site-protection** (free, password gate). The folder itself works on any of those without changes.

## Custom domain (optional)

If you'd rather use `demos.digitalfinancehq.com`:

1. In repo **Settings → Pages → Custom domain**, enter the domain
2. In your DNS provider, add a CNAME: `demos → YOUR-USERNAME.github.io`
3. Wait for DNS propagation (5 min – 24 hours)
4. GitHub provisions SSL automatically

---

**Done.** Tell me when you've created the repo (or your GitHub username) and I'll give you the exact commands with the URL filled in.
