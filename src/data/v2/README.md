# Business Fit V2 — Data architecture

This folder is the source of truth for the V2 matching engine.

## Goals

- 120 genuinely differentiated business models across five universes.
- 100% closed-choice questionnaire: no free-text input required.
- Separate hard constraints, skill requirements, preferences, unfair advantages, RIASEC, Big Five and reasoning.
- Keep personality and reasoning as low-weight signals: they must never hard-exclude a business.
- Keep economic values in real units (EUR, hours, weeks) instead of mixing them with 0–100 fit scores.
- Every recommendation must be explainable through subscores and explicit positive/attention reasons.

## Target catalogue

- E-commerce: 30
- Agency / services: 30
- Software / SaaS / apps: 25
- Information / audience / digital products: 25
- Physical businesses: 10
- Total: 120

## Questionnaire design

The V2 questionnaire is grouped so the UI can show short modules instead of a long question counter.

1. Profile and location
2. Constraints
3. Goals
4. Interests / activities
5. Unfair advantages
6. Skills and willingness to learn
7. Big Five
8. RIASEC
9. Reasoning

The planned V2 instrument contains 79 closed-choice items, many of which are rendered together as matrices or grouped screens. This is intentionally different from showing 79 separate screens.

## Psychometrics

Big Five is treated as a lightweight personality signal, not a clinical or diagnostic test. The implementation uses 20 balanced items (4 per factor) and reverse-keyed items. RIASEC is measured with multiple activity-interest items for all six Holland dimensions. The reasoning module is an original short screening of logical, numerical, abstract and pattern reasoning and must not be labelled as an IQ score.

## Scoring principles

The engine must use three different rule types:

1. **Hard constraints** — capital, time, legal/operational prerequisites.
2. **Minimum requirements** — having more skill than required is never a mismatch.
3. **Preferences** — distance/proximity is appropriate for desired work style.

Default weighting:

- Constraints: 20%
- Skills + willingness to learn: 20%
- Unfair advantages: 20%
- Work style / preferences: 15%
- Goals: 10%
- RIASEC: 7.5%
- Big Five: 5%
- Reasoning: 2.5%

## Evidence policy

Business requirement scores (for example `sales: 80` or `risk: 55`) are editorial heuristics used for ranking. They are **not probabilities of success** and must not be presented as empirically measured facts. The application should keep the scoring configurable so the catalogue can be calibrated using real user outcomes later.

## Research basis

The design was informed by:

- International Personality Item Pool (IPIP): public-domain Big Five item/scale repository.
- O*NET Interest Profiler: RIASEC structure and multi-item vocational-interest methodology.
- EU EntreComp / OECD entrepreneurship competency work: opportunity recognition, resources, initiative, planning, uncertainty, collaboration and learning.
- Shopify documentation: dropshipping, print-on-demand, DTC, wholesale and subscription model distinctions.
- Stripe documentation: recurring and usage-based software pricing models.

See `SOURCES.md` for source links and implementation notes.
