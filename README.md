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

## Before going live — replace placeholders

1. **LinkedIn URL** — in `index.html`, the About section links to
   `https://www.linkedin.com/`. Replace with your profile URL.
2. **Booking link** — the "Book a 20-minute call" buttons currently open a
   pre-filled email. If you set up Calendly/Cal.com, replace those `mailto:`
   hrefs with your booking URL.
3. **Email** — currently `Shahdhruv.19498@gmail.com` everywhere; consider a
   dedicated consulting address later (one find-and-replace).
