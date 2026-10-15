# Business Navigator

**Quel business est réellement fait pour toi ?**

Business Navigator est une web app qui fait passer un test interactif (personnalité, compétences, budget, objectifs, raisonnement) puis compare le profil obtenu à **90 modèles de business** pour proposer un Top 3 avec un score de compatibilité et un plan de lancement.

Pas un formulaire : une expérience fluide, par modules, pensée mobile et desktop.

## Le parcours

1. **Landing** — une promesse, un bouton « Faire le test ».
2. **Questionnaire par modules** — 79 questions réparties en 4 blocs : situation & compétences (29), personnalité Big Five (20), intérêts RIASEC (18), profil de raisonnement (12). Uniquement des cartes, sliders, grilles et matrices visuelles — aucun champ texte.
3. **Écran d'analyse** — animation pendant que le moteur compare le profil au catalogue.
4. **Résultats Top 3** — pour chaque business : score global + sous-scores (profil, budget, compétences, potentiel, style de travail), pourquoi ça correspond, points d'attention.
5. **Page business** — description, compétences nécessaires, capital recommandé, temps avant premier euro, risques, journée type, scalabilité.
6. **« Construire mon plan »** — génération d'un plan d'exécution personnalisé pour le business choisi.

## Comment ça marche

```
réponses brutes ──▶ buildUserProfileV2 ──▶ rankBusinesses(profile, catalogue) ──▶ Top 3
                                                                                   │
                                                          POST /api/bos/generate ◀─┘
                                                          (plan d'exécution)
```

- **Catalogue** : 90 business en 5 univers (software, e-commerce, agences & services, infoproduits, physique), chacun décrit par budget min/idéal, heures/semaine, délai avant premier revenu, risque, scalabilité, difficulté, compétences clés et profil psychométrique cible — `src/data/v2/seeds-*.ts`.
- **Matching** : scoring déterministe côté client, pondéré par `scoring-config.json` — `src/data/v2/matching-engine.ts`. Aucun LLM nécessaire pour le classement.
- **Plan de lancement** : généré côté serveur par `src/data/v2/bos-generator.ts`, exposé via la route API `/api/bos/generate`.
- **Questions** : quatre fichiers JSON (`questions-core`, `questions-big-five`, `questions-riasec`, `questions-reasoning`) pour pouvoir les faire évoluer ou les charger depuis une base sans toucher à l'UI.

Les choix de conception (ne pas présenter le score comme une probabilité de succès, ne pas appeler le module de raisonnement « QI », garder le scoring explicable) sont documentés dans `src/data/v2/IMPLEMENTATION.md` et `QUESTIONNAIRE-UX.md`. Les sources psychométriques sont listées dans `SOURCES.md`.

## Stack

React 19 · TypeScript · TanStack Start / Router · Vite · Tailwind CSS · shadcn/ui (Radix) · Zod

## Lancer en local

```sh
npm install
npm run dev
```

Puis ouvrir l'URL affichée dans le terminal. Pas de variable d'environnement, pas de base de données : tout tourne en local avec le catalogue embarqué.

## Roadmap

- [ ] Brancher le catalogue et les questions sur une base de données
- [ ] Enrichir le plan d'exécution avec un LLM côté serveur (clés et prompts restent serveur)
- [ ] Comptes utilisateurs et sauvegarde des résultats
- [ ] Monétisation (plan détaillé premium)

## Auteur

Joël-Junior Melane — [Appmelane](https://github.com/joeljuniorecom-star)

Interface initialement prototypée avec Lovable, moteur de matching et catalogue V2 écrits à la main.
