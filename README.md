# AquaLens

**An AI field companion for stream health** — built for the IEEE OneAquaHealth Global Hackathon 2026 (Track 3: AI-Supported Assessment).

AquaLens interviews you like a field ecologist: seven quick questions about the water in front of you, cross-checked for consistency *while* you answer, with every score explained in plain language. The human at the water's edge always gets the last word.

## Try it

Open `index.html` in any browser — no build step, no server, no sign-up. Or visit the live GitHub Pages link once deployed.

## How it works

1. **Answer 7 questions** — clarity, smell, surface, wildlife, and context, in plain words, zero jargon.
2. **Get cross-checked** — Lens looks for combinations that don't add up (e.g. crystal-clear water that smells like rotten eggs) and asks you to recheck, politely and with reasons.
3. **Read the snapshot** — an explainable 0–100 Stream Health Score plus a One Health story card, saved to your field journal.

## What's inside

- `index.html` — page markup and the interview/report shells.
- `css/styles.css` — the whole field-journal design system (light + dark).
- `js/data.js` — questions, scoring tables, contradiction rules, One Health stories.
- `js/app.js` — interview flow, cross-check engine, scoring, report, journal.
- `docs/` — PRD, USP, architecture, pitch deck, demo script.

No build step, no dependencies beyond Google Fonts. Open `index.html` and it runs.

## About the intelligence inside

Lens is an **explainable assessment companion**, not a black box and not a claim to machine learning. It encodes real field-ecology heuristics, shows its reasoning for every flag, and never overrides your judgment. That's deliberate: in citizen science, the observer is the expert — AI is the second pair of eyes.

## Deploy to GitHub Pages

1. Create a new **public** repository and upload everything in this folder.
2. Go to **Settings → Pages**.
3. Under *Build and deployment*, set **Source** to *Deploy from a branch*, branch `main`, folder `/ (root)`. Save.
4. Wait about a minute — your app is live at `https://<username>.github.io/<repo>/`.
