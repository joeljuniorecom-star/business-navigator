# Business Navigator

Construis le frontend d'une application web premium appelée provisoirement Business Fit.

OBJECTIF

L'utilisateur passe un test entièrement interactif pour découvrir les business les plus compatibles avec :

sa personnalité

ses compétences

son budget

son expérience

ses intérêts

son temps disponible

ses objectifs

son niveau de risque

ses capacités cognitives

ses langues

sa localisation

Le produit ne doit surtout PAS ressembler à un formulaire administratif ou à Google Forms.

Je veux une expérience moderne, premium, très fluide et addictive.

PARCOURS

Landing page

Introduction au test

Questionnaire par modules

Écran d'analyse

Résultats Top 3

Page détaillée d'un business

Bouton « Construire mon plan »

LANDING PAGE

Hero très simple.

Titre possible :
« Quel business est réellement fait pour toi ? »

Sous-titre :
« Découvre les modèles de business les plus compatibles avec ton profil, tes compétences et tes ambitions. »

CTA :
« Faire le test »

Afficher ensuite brièvement que l'analyse prend en compte :

personnalité

compétences

capital

objectifs

intérêts

raisonnement

style de travail

QUESTIONNAIRE

Aucun champ de texte libre.

Uniquement :

cartes sélectionnables

boutons

choix multiples

sliders

grilles

choix avec icônes

questions visuelles

matrices pour les questions cognitives

Créer plusieurs modules :

Ta situation

Ce que tu aimes

Tes compétences

Tes avantages

Tes ambitions

Ton style de travail

Personnalité

Raisonnement

Ne jamais donner l'impression à l'utilisateur qu'il répond à 60 questions.

Afficher plutôt une progression par modules.

Exemple :

Profil ✓
Compétences ✓
Personnalité ●
Raisonnement
Résultats

Les transitions doivent être fluides.

Une question importante peut occuper tout l'écran.

Les petites questions peuvent parfois être regroupées intelligemment.

PERSONNALITÉ

Prévoir des composants pour :

Big Five

RIASEC

Les questions doivent utiliser des échelles ou cartes facilement sélectionnables.

TEST COGNITIF

Prévoir des composants visuels capables d'afficher :

suites logiques

matrices

suites numériques

analogies

problèmes de raisonnement

Ne pas appeler directement le résultat « QI ».

Utiliser :
« Profil de raisonnement ».

ÉCRAN D'ANALYSE

Après la dernière question :

Créer une animation élégante donnant l'impression que le système analyse :

120 modèles de business

personnalité

contraintes

compétences

objectifs

Exemples de messages :

« Analyse de ton profil »
« Comparaison avec 120 modèles de business »
« Recherche de tes avantages naturels »
« Calcul de ton Business Fit »

RÉSULTATS

Présenter principalement 3 business.

Exemple :

#1 Agence d'automatisation IA
94 % de compatibilité

Afficher des sous-scores :

Profil
Budget
Compétences
Potentiel
Style de travail

Puis :

« Pourquoi ce business te correspond »

et quelques arguments.

#2 Micro-SaaS B2B
87 %

#3 E-commerce organique
82 %

Ajouter :

« Voir les autres résultats »

mais ne jamais submerger l'utilisateur.

PAGE BUSINESS

Afficher :

compatibilité

description

pourquoi cela correspond au profil

compétences nécessaires

capital recommandé

temps avant premier euro

potentiel

risques

journée type

difficulté

scalabilité

CTA principal :

« Construire mon plan »

IMPORTANT TECHNIQUE

Pour l'instant, utilise des données mockées/locales.

Architecture le frontend pour qu'ensuite :

les questions puissent provenir d'un JSON ou d'une base de données

les business puissent provenir d'une base de données

le scoring puisse être remplacé par une fonction réelle

un backend puisse être connecté sans refaire toute l'interface

Créer des composants réutilisables.

Responsive parfait desktop + mobile.

Ne crée pas encore d'authentification, paiement ou abonnement.

Priorité absolue :
UX, design, questionnaire et page de résultats.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f6aeff3b-2f4b-4c4c-92c7-59667d392e37).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
