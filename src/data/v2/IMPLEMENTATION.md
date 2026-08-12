# V2 integration boundary

The files in this folder are intentionally isolated from the existing Lovable UI until the data/matching layer is reviewed.

## Integration sequence for Antigravity

1. Keep the current Lovable routes/components and visual design.
2. Replace the legacy coarse `src/data/businesses.ts` catalogue with `businessesV2` from `src/data/v2/catalog.ts` only after UI adapters are ready.
3. Render questions from the four V2 JSON files; group them according to `QUESTIONNAIRE-UX.md`.
4. Store raw answers, then call `buildUserProfileV2` once the questionnaire is complete.
5. Call `rankBusinesses(profile, businessesV2)` locally. No LLM is required for this stage.
6. Show Top 3 plus sub-scores, strengths and attention points.
7. Only after the user chooses one business, send the selected model + normalized profile + scores to the server-side BOS/LLM layer for the detailed launch plan.
8. Keep API keys and BOS prompt assembly server-side.

## Do not do yet

- Do not merge personality with identity claims such as “you are an entrepreneur type X”.
- Do not label the reasoning module as IQ.
- Do not present Business Fit as a probability of success.
- Do not add authentication, billing or a large dashboard before the core matching flow is stable.
