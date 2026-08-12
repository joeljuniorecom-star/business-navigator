# Questionnaire V2 — UX plan

The dataset contains **79 closed-choice items**, but the user must not experience 79 separate screens.

## Recommended screen grouping

| Section | Items | Suggested screens |
|---|---:|---:|
| Profile / location | 4 | 3 |
| Constraints / work setup | 8 | 5 |
| Goals | 2 | 2 |
| Interests | 2 | 2 |
| Unfair advantages | 2 | 2 |
| Skills | 11 | 2 (one skills matrix + willingness screen) |
| Big Five | 20 | 5 (4 statements per screen) |
| RIASEC | 18 | 6 (3 activities per screen) |
| Reasoning | 12 | 12 |
| **Total** | **79** | **39 screens max** |

Several lightweight screens can be merged further on desktop. On mobile, keep touch targets large and avoid dense matrices except the skill-level grid.

## Progress UI

Do not display `Question 43/79`. Display section progress instead:

1. Profil
2. Contraintes
3. Objectifs
4. Intérêts
5. Atouts
6. Compétences
7. Personnalité
8. Intérêts professionnels
9. Raisonnement
10. Résultats

## Interaction rules

- No free-text fields.
- Country is a searchable select; this is still closed-choice data.
- Multi-select questions clearly show min/max selections.
- Big Five statements use the same 5-point agreement scale.
- RIASEC uses the same 5-point activity-interest scale.
- Reasoning questions show no personality-style feedback during the test.
- Never expose the correct reasoning answer before the module is completed.
- Allow back navigation without losing answers.
- Autosave locally during the V1; account persistence can come later.

## Result language

Use **Business Fit** or **compatibilité**, never “chance of success.”

Reasoning output examples:
- Raisonnement logique: 67/100
- Raisonnement numérique: 100/100
- Reconnaissance de patterns: 67/100
- Raisonnement abstrait: 100/100

Do not output an IQ number.

Personality output should be descriptive, e.g. `Ouverture 75/100`, not diagnostic.
