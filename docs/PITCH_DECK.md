# AquaLens — Pitch Deck (6 slides, ~4 minutes)

## Slide 1 — Title
**AquaLens** · *Your stream has a story. Lens helps you read it.*
IEEE OneAquaHealth Global Hackathon 2026 · Track 3: AI-Supported Assessment
Solo · Kiran Kumar Moharana
> Say: one line on what it is — "a conversational field companion that makes citizen
> stream data trustworthy, at the moment of collection."

## Slide 2 — Problem
- Urban streams are monitored by citizens — but citizen observations are inconsistent
  and error-prone (the track's own problem statement).
- Today's fix is post-hoc expert review: slow, unscalable, and it catches errors weeks
  after the citizen has left the water's edge.
- Raw observations don't translate into decisions: a spreadsheet of pH readings means
  nothing to a resident or a policymaker.
> Say: "The data is collected by humans, but validated as if humans weren't in the loop."

## Slide 3 — Solution (how it works)
1. **Answer** — Lens guides a 60-second, 7-question stream check in plain language.
   No jargon, no ecology degree.
2. **Get cross-checked** — Lens evaluates 10 ecological validation rules mid-interview.
   Contradictions surface instantly, each with a plain-language explanation.
3. **You decide** — every flag offers *Keep my answer / Let me recheck*. The human is
   the final judge, always.
4. **Read the snapshot** — explainable 0–100 health score, confidence meter, and a
   One Health story card per stream.
> Demo the contradiction moment live here if possible.

## Slide 4 — The intelligence (judge slide)
- **Explainable by design:** every deduction and every flag shows its reasoning.
  Example: murky water after heavy rain gets its silt penalty *halved* — the context
  explains it, and the app says so.
- **Responsible AI, honestly framed:** Lens is a rule-based assessment companion, not
  a black box. Auditable, offline-capable, honest about limits — exactly the
  human-in-the-loop position Track 3 asks for.
- **Architecture:** frontend-only, zero backend, zero API keys. One link, works on any
  judge's laptop in seconds; static hosting scales to a city or a continent.

## Slide 5 — Impact & alignment
- **Citizens:** a 60-second habit that teaches ecological literacy while they contribute.
- **Researchers:** cleaner, confidence-scored observations — with the flags and
  resolutions attached as data-quality metadata.
- **Policymakers:** readable health snapshots + One Health stories instead of raw tables.
- **One Health:** every report connects stream signals → ecosystem → human wellbeing,
  e.g. nutrient overload → algal blooms → oxygen crash → mosquito risk near homes.
- **Scale story:** no-install, browser-based, local-first — deployable anywhere,
  sync API pluggable later without touching the core.

## Slide 6 — Future work & close
- Photo-based assessment (on-device vision) · FHIR-compatible observation export
  (Track 7 bridge) · multi-language · researcher dashboard · longitudinal trends.
- **Close:** "AquaLens doesn't replace the citizen scientist. It makes them
  *better* — and proves it, one explained flag at a time."
- Live prototype link + GitHub repo QR.
