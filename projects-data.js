/* ============================================================
   PROJECTS DATA
   ------------------------------------------------------------
   To add a project, append one object to the PROJECTS array.
   The page renders this list automatically (no HTML edits needed).
   This file is deliberately simple so a script or AI model can
   read it, append an object, and write it back.

   Note: project "link" values are only rendered if they start with
   http:// or https:// (see main.js). This blocks javascript: and other
   unsafe URLs from any auto-generated entry.

   Schema (per project):
   {
     "title":   string  (required)  short project name
     "summary": string  (required)  1 to 3 plain-language sentences
     "status":  string  (required)  "planned" | "in-progress" | "completed"
     "tags":    [string] (optional) methods/tools, shown as pills
     "link":    string  (optional)  http(s) URL to a write-up, repo, or demo
     "date":    string  (optional)  e.g. "2026-06", used for sorting
   }

   Projects are shown newest-first by "date", with "in-progress"
   and "completed" before "planned" when dates tie or are missing.
   ============================================================ */

const PROJECTS = [
  {
    "title": "Sample-size calculator for survey researchers",
    "summary": "A plain-language web tool that answers 'how many people do I need?' for common survey and pre/post designs, with the assumptions spelled out, not hidden.",
    "status": "planned",
    "tags": ["Power analysis", "Web tool"],
    "link": "",
    "date": "2026-07"
  },
  {
    "title": "Which test do I need? An interactive guide",
    "summary": "Answer a few questions about your data (paired or not, how many groups, what kind of scale) and get the appropriate statistical test, with a short explanation of why.",
    "status": "planned",
    "tags": ["Decision guide", "Statistics education"],
    "link": "",
    "date": "2026-08"
  },
  {
    "title": "Reporting templates for common analyses",
    "summary": "Fill-in-the-blank results paragraphs and table templates (APA-style) for t-tests, ANOVA, and their non-parametric counterparts, so results are written up correctly the first time.",
    "status": "planned",
    "tags": ["APA reporting", "Templates"],
    "link": "",
    "date": "2026-09"
  }
];
