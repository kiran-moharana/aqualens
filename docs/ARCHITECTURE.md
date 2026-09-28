# AquaLens — Architecture

## Overview
Frontend-only single-page app. No backend, no database server, no API keys, no build
step. Opens from a static host (GitHub Pages) and runs the entire assessment loop
offline-capable in the browser.

## Modules
- `index.html` — two views: Home (mission, start, history) and Check (chat + report).
- `css/styles.css` — design system: paper/ink/river-teal palette, Fraunces + Inter,
  mobile-first, desktop split-view ≥1024px.
- `js/data.js` — **the domain brain**: 7 interview questions, 10 validation rules with
  ecological explanations, scoring tables, One Health insight templates.
- `js/app.js` — **the engine**: chat state machine (ask → validate → resolve flags →
  report), explainable scorer, confidence model, live field-report renderer,
  localStorage history.

## Data flow
```
citizen answer → state.answers → validation engine (rules evaluated)
     → flag? → human resolves (keep/change) → re-evaluate once
     → scorer (deductions + rain context) → confidence model
     → report: score ring, breakdown, insight cards → localStorage
```

## Why no backend (a feature, not a gap)
- **Judging:** one link, zero setup, works on any laptop in seconds.
- **Field use:** citizens open it in a phone browser — no install barrier.
- **Scale story:** static hosting serves a city or a continent identically; a sync API
  can be added later without changing the interview/validation core.
- **Privacy:** observations never leave the device in the prototype.

## Honest limits
Rule-based, not ML — auditable and explainable, but heuristics can't learn from data.
Single-device storage in the prototype. Seeded demo content is labeled as such.

## Future work (pitch-slide material)
Photo-based assessment with on-device vision models · FHIR-compatible observation
export for health-system interoperability (Track 7 bridge) · multi-language ·
community sync API + researcher dashboard · longitudinal trend analysis.
