# Dhruv Shah · Statistical Consulting — Website

A static website (no build step, no framework). Open `index.html` in a browser,
or host the folder as-is on GitHub Pages, Netlify, Cloudflare Pages, etc.

## Files

| File | Purpose |
|---|---|
| `index.html` | All page content and sections |
| `styles.css` | All styling |
| `projects-data.js` | **The projects list — edit this to add/update projects** |
| `main.js` | Renders projects, mobile nav, footer year |
| `render.yaml` | Render deployment config (static site, auto-deploy on push) |

## Deploying (GitHub → Render)

One-time setup:

1. **Push to GitHub** (repo is already initialized locally):
   ```powershell
   gh auth login                # log in to GitHub, one time
   gh repo create statistical-consulting --public --source . --push
   ```
   (Use `--private` instead of `--public` if you prefer; Render works with both.)
2. **Connect Render**: at [dashboard.render.com](https://dashboard.render.com) →
   **New → Blueprint** → select the `statistical-consulting` repo → Apply.
   Render reads `render.yaml` and creates the static site (free tier).
   You'll get a `*.onrender.com` URL; add a custom domain later in the
   site's Settings if you want one.

## Publishing updates

After editing any file (e.g. adding a project to `projects-data.js`):

```powershell
git add -A
git commit -m "Describe the change"
git push
```

Render auto-deploys every push to `main` — the live site updates in
about a minute. Nothing else to do.

## Adding a project

Open `projects-data.js` and append one object to the `PROJECTS` array:

```js
{
  "title": "My new project",
  "summary": "One to three plain-language sentences about it.",
  "status": "in-progress",        // "planned" | "in-progress" | "completed"
  "tags": ["SEM", "R"],           // optional
  "link": "https://example.com",  // optional — shows a "View project →" link
  "date": "2026-06"               // optional — newest shown first
}
```

No HTML changes needed — the page renders whatever is in the array.
The file is plain, documented, and schema'd on purpose so an automation or AI
model can read it, append a project object, and write it back (e.g. a script
that drafts a project card from a repo README).

## Contact details (where to update them)

All live in `index.html` (a couple of spots each). Change them and push; Render redeploys automatically.

- **Email:** `dhruv@dsstatistics.ca` (About link and the "Email me" button)
- **Booking:** Calendly `https://calendly.com/dhruv-dsstatistics/10` (10-minute call) on the two "Book a ... call" buttons
- **LinkedIn:** `https://www.linkedin.com/in/dhruv-shah-2964a9137/` (About section)
