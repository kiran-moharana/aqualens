# AquaLens — Product Requirements Document
**IEEE OneAquaHealth Global Hackathon 2026 · Track 3: AI-Supported Assessment**
Deadline: Oct 1, 2026, 09:30 IST · Solo build · Web app (mobile-first, responsive)

## 1. Problem
Citizen observations of urban streams are inconsistent and error-prone (the track's own
problem statement). Raw observations don't translate into trustworthy data, so researchers
can't rely on them and citizens can't interpret them. Existing validation happens
*after* submission via slow expert review — errors are caught too late, if at all.

## 2. Product
AquaLens is a conversational field companion. A citizen answers 7 plain-language questions
about a stream; **Lens** (the in-app guide) cross-checks the answers for ecological
contradictions *during* collection, explains every flag in plain language, and lets the
human confirm or correct each one. Output: an explainable Stream Health Snapshot —
score, confidence, per-indicator breakdown, and a One Health story card.

## 3. Users
- **Primary:** citizen scientists / residents near urban streams (non-experts, on phones)
- **Secondary:** researchers & NGOs (receive cleaner, confidence-scored data), local
  policymakers (readable health snapshots instead of raw tables)

## 4. Goals / Non-goals
**Goals:** catch observation errors at collection time; keep the human as final judge;
every score fully explainable; zero-install, works on a judge's laptop in one click.
**Non-goals (cut list):** user accounts, photo/ML analysis, backend/database, FHIR export,
multi-language, offline sync. These become the "Future work" pitch slide.

## 5. Functional requirements (MVP)
1. Guided 7-question interview (location, clarity, smell, surface, wildlife, recent rain,
   nearby outlet) in plain language, tap-to-answer.
2. Rule-based validation engine: ≥8 ecological contradiction/consistency rules, each with
   a plain-language explanation grounded in real limnology.
3. Human-in-the-loop resolution: every flag offers **Keep my answer / Change answer**;
   the AI never overrides the citizen.
4. Explainable scoring: 0–100 Stream Health Score with per-indicator deductions shown;
   confidence score derived from internal consistency.
5. One Health insight cards generated from the top issues (ecosystem → human links).
6. Live field-report panel (desktop split view) updating as the interview unfolds.
7. Local history of past checks (localStorage).
8. Honest framing: the app states it uses an explainable rule-based companion, not ML.

## 6. Validation rules (spec)
| # | Trigger | Type | Challenges |
|---|---------|------|-----------|
| R1 | crystal-clear water + rotten-egg smell | flag | clarity |
| R2 | crystal-clear water + foam/oily film/algae | flag | clarity |
| R3 | no smell + oily film | flag | smell |
| R4 | clean surface + rotten/chemical smell | flag | surface |
| R5 | algae mat + no recent rain | insight | — |
| R6 | murky water + heavy recent rain | consistency (halves silt deduction) | — |
| R7 | outlet/pipe + foam/oil/chemical signs | insight (report recommendation) | — |
| R8 | no wildlife + otherwise clean | note (not penalized) | — |
| R9 | fish present + strong odor | insight (check for gasping = low oxygen) | — |
| R10 | clear + no smell + clean surface | consistency (confidence boost) | — |

## 7. Scoring (spec)
Base 100. Deductions: clarity 0/8/18/15 · smell 0/5/20/25 · surface 0/12/15/18/22 ·
outlet +10 risk deduction · wildlife never penalized (small bonus for observed life).
Rain context: heavy rain within 2 days halves the murky-water deduction (runoff silt is
expected). Grade bands: 80+ Healthy · 60–79 Fair · 40–59 Stressed · <40 Critical.
Confidence: starts 88; −10 per kept flag, −4 per corrected flag, +4 per consistency
(capped 96, floor 45).

## 8. UX flow
Home (mission → Start check → past checks) → chat interview → "cross-checking…"
→ flag resolution cards → Stream Health Snapshot report → save → new check / home.
Desktop ≥1024px: chat + live field-report side by side.

## 9. Tech
Vanilla HTML/CSS/JS, no build step, no backend, no API keys. Google Fonts (Fraunces +
Inter). Deployed to GitHub Pages. Data persists in localStorage.

## 10. Risks & mitigations
- **"Where's the ML?"** → Frame as responsible/explainable AI per the track brief;
  the human-in-the-loop story is the differentiator, not a weakness.
- **Demo failure** → fully client-side, no network dependency for the core loop.
- **Scope creep** → cut list is final; anything else goes to "Future work".

## 11. Submission checklist
- [ ] Devpost: track stated, description (problem/solution/users/impact)
- [ ] Demo video 3–5 min (script in docs/DEMO_SCRIPT.md)
- [ ] Public GitHub repo + README
- [ ] Working prototype link (GitHub Pages)
- [ ] Pitch deck 5–7 slides (docs/PITCH_DECK.md)
