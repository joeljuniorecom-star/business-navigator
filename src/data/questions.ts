import type { Question, QuizModule } from "./types";

export const modules: QuizModule[] = [
  { id: "situation", label: "Ta situation", short: "Profil", intro: "Où tu en es aujourd'hui" },
  { id: "gouts", label: "Ce que tu aimes", short: "Intérêts", intro: "Les univers qui t'attirent" },
  { id: "competences", label: "Tes compétences", short: "Skills", intro: "Ce que tu sais déjà faire" },
  { id: "avantages", label: "Tes avantages", short: "Atouts", intro: "Capital, réseau, temps" },
  { id: "ambitions", label: "Tes ambitions", short: "Objectifs", intro: "Ce que tu veux vraiment" },
  { id: "style", label: "Ton style de travail", short: "Style", intro: "Comment tu avances" },
  { id: "personnalite", label: "Personnalité", short: "Personnalité", intro: "Big Five & RIASEC" },
  { id: "raisonnement", label: "Raisonnement", short: "Raisonnement", intro: "Logique & abstraction" },
];

export const questions: Question[] = [
  // ---------- Situation ----------
  {
    id: "sit_status",
    moduleId: "situation",
    type: "grid",
    title: "Aujourd'hui, tu es plutôt…",
    subtitle: "Une seule réponse, celle qui décrit le mieux tes journées.",
    options: [
      { id: "salarie", label: "Salarié", icon: "briefcase", traits: { structure: 1, ops: 1 } },
      { id: "etudiant", label: "Étudiant", icon: "graduation", traits: { time: 2, capital: -1 } },
      { id: "freelance", label: "Freelance", icon: "laptop", traits: { autonomy: 2, sales: 1, b2b: 1 } },
      { id: "entrepreneur", label: "Déjà entrepreneur", icon: "rocket", traits: { risk: 2, sales: 2 } },
      { id: "transition", label: "En transition", icon: "compass", traits: { time: 1, risk: 1 } },
      { id: "autre", label: "Autre", icon: "sparkles", traits: {} },
    ],
  },
  {
    id: "sit_experience",
    moduleId: "situation",
    type: "single",
    group: "sit_pair",
    title: "Ton expérience business",
    options: [
      { id: "zero", label: "Je pars de zéro", traits: { patience: 1, risk: -1 } },
      { id: "essais", label: "Quelques essais", traits: { risk: 1 } },
      { id: "revenus", label: "Déjà des revenus", traits: { sales: 2, risk: 1 } },
      { id: "pro", label: "Business rentable", traits: { sales: 3, ops: 2, risk: 2 } },
    ],
  },
  {
    id: "sit_lang",
    moduleId: "situation",
    type: "multi",
    group: "sit_pair",
    title: "Tu travailles à l'aise en…",
    min: 1,
    options: [
      { id: "fr", label: "Français", traits: { b2c: 1 } },
      { id: "en", label: "Anglais", traits: { b2b: 2, tech: 1 } },
      { id: "es", label: "Espagnol", traits: { b2c: 1 } },
      { id: "autre", label: "Autre langue", traits: {} },
    ],
  },
  {
    id: "sit_zone",
    moduleId: "situation",
    type: "single",
    title: "Ton marché naturel",
    subtitle: "Là où tu peux vendre le plus facilement.",
    options: [
      { id: "local", label: "Local / ma ville", hint: "Commerces, services de proximité", traits: { social: 2, b2b: 1 } },
      { id: "national", label: "National", hint: "Marché francophone", traits: { b2c: 1 } },
      { id: "monde", label: "International", hint: "En ligne, sans frontières", traits: { tech: 2, b2b: 1 } },
    ],
  },

  // ---------- Ce que tu aimes ----------
  {
    id: "int_univers",
    moduleId: "gouts",
    type: "multi",
    title: "Quels univers t'attirent vraiment ?",
    subtitle: "Choisis-en 2 à 4.",
    min: 2,
    max: 4,
    options: [
      { id: "tech", label: "Tech & IA", icon: "cpu", traits: { tech: 3, analytic: 1 } },
      { id: "design", label: "Design & création", icon: "palette", traits: { creative: 3 } },
      { id: "marketing", label: "Marketing", icon: "megaphone", traits: { sales: 2, creative: 1 } },
      { id: "finance", label: "Finance & data", icon: "chart", traits: { analytic: 3 } },
      { id: "contenu", label: "Contenu & médias", icon: "video", traits: { video: 3, writing: 2, b2c: 1 } },
      { id: "produit", label: "Produits physiques", icon: "package", traits: { ops: 3, b2c: 2 } },
      { id: "humain", label: "Coaching & humain", icon: "users", traits: { social: 3 } },
      { id: "immobilier", label: "Immobilier", icon: "building", traits: { capital: 2, ops: 1 } },
    ],
  },
  {
    id: "int_energie",
    moduleId: "gouts",
    type: "single",
    title: "Ce qui te donne le plus d'énergie",
    options: [
      { id: "resoudre", label: "Résoudre un problème complexe", traits: { analytic: 2, tech: 2 } },
      { id: "creer", label: "Créer quelque chose de beau", traits: { creative: 3 } },
      { id: "convaincre", label: "Convaincre et vendre", traits: { sales: 3, social: 1 } },
      { id: "organiser", label: "Organiser et optimiser", traits: { ops: 3, structure: 1 } },
    ],
  },
  {
    id: "int_visible",
    moduleId: "gouts",
    type: "scale",
    title: "Être visible publiquement ne me dérange pas",
    subtitle: "Caméra, réseaux, prise de parole.",
    scaleLabels: ["Pas du tout", "Totalement"],
    traits: { video: 3, b2c: 2, social: 1 },
  },

  // ---------- Compétences ----------
  {
    id: "sk_niveau",
    moduleId: "competences",
    type: "multi",
    title: "Tes compétences actuelles",
    subtitle: "Sélectionne tout ce que tu sais faire correctement.",
    min: 1,
    options: [
      { id: "code", label: "Code / no-code", icon: "code", traits: { tech: 3 } },
      { id: "auto", label: "Automatisation", icon: "zap", traits: { tech: 2, ops: 2, b2b: 1 } },
      { id: "redac", label: "Écriture", icon: "pen", traits: { writing: 3 } },
      { id: "video", label: "Vidéo / montage", icon: "video", traits: { video: 3, creative: 1 } },
      { id: "design", label: "Design", icon: "palette", traits: { creative: 3 } },
      { id: "vente", label: "Vente", icon: "handshake", traits: { sales: 3, b2b: 1 } },
      { id: "ads", label: "Publicité en ligne", icon: "target", traits: { sales: 2, analytic: 2 } },
      { id: "gestion", label: "Gestion / logistique", icon: "boxes", traits: { ops: 3 } },
      { id: "analyse", label: "Analyse de données", icon: "chart", traits: { analytic: 3 } },
    ],
  },
  {
    id: "sk_apprentissage",
    moduleId: "competences",
    type: "scale",
    group: "sk_pair",
    title: "J'apprends vite une nouvelle compétence technique",
    scaleLabels: ["Difficilement", "Très vite"],
    traits: { tech: 2, reasoning: 1 },
  },
  {
    id: "sk_technique",
    moduleId: "competences",
    type: "scale",
    group: "sk_pair",
    title: "Les outils techniques ne me font pas peur",
    scaleLabels: ["Ils me bloquent", "Je m'amuse"],
    traits: { tech: 3 },
  },

  // ---------- Avantages ----------
  {
    id: "adv_capital",
    moduleId: "avantages",
    type: "slider",
    title: "Combien peux-tu investir au départ ?",
    subtitle: "Sans mettre ta situation en danger.",
    sliderMin: 0,
    sliderMax: 20000,
    sliderStep: 250,
    sliderDefault: 1000,
    sliderUnit: "€",
    traits: { capital: 4 },
  },
  {
    id: "adv_temps",
    moduleId: "avantages",
    type: "slider",
    title: "Combien d'heures par semaine ?",
    sliderMin: 2,
    sliderMax: 60,
    sliderStep: 1,
    sliderDefault: 12,
    sliderUnit: "h",
    traits: { time: 4 },
  },
  {
    id: "adv_reseau",
    moduleId: "avantages",
    type: "single",
    title: "Ton réseau professionnel",
    options: [
      { id: "aucun", label: "Inexistant", traits: {} },
      { id: "petit", label: "Quelques contacts", traits: { social: 1 } },
      { id: "solide", label: "Solide", traits: { social: 2, b2b: 2, sales: 1 } },
      { id: "audience", label: "J'ai déjà une audience", traits: { b2c: 3, video: 2 } },
    ],
  },

  // ---------- Ambitions ----------
  {
    id: "amb_objectif",
    moduleId: "ambitions",
    type: "grid",
    title: "Ton objectif à 12 mois",
    options: [
      { id: "complement", label: "1 000 €/mois en plus", icon: "coins", traits: { risk: -1, patience: 1 } },
      { id: "remplacer", label: "Remplacer mon salaire", icon: "wallet", traits: { sales: 1 } },
      { id: "scaler", label: "Construire une vraie boîte", icon: "rocket", traits: { risk: 2, ops: 2 } },
      { id: "liberte", label: "Liberté géographique", icon: "globe", traits: { tech: 2, autonomy: 2 } },
    ],
  },
  {
    id: "amb_horizon",
    moduleId: "ambitions",
    type: "single",
    group: "amb_pair",
    title: "Ton horizon de patience",
    options: [
      { id: "rapide", label: "Des résultats en 1-2 mois", traits: { patience: -2, sales: 2 } },
      { id: "moyen", label: "3-6 mois", traits: { patience: 1 } },
      { id: "long", label: "1 an et plus", traits: { patience: 3, tech: 1 } },
    ],
  },
  {
    id: "amb_risque",
    moduleId: "ambitions",
    type: "scale",
    group: "amb_pair",
    title: "Je suis prêt à prendre des risques financiers",
    scaleLabels: ["Zéro risque", "Je fonce"],
    traits: { risk: 4 },
  },

  // ---------- Style de travail ----------
  {
    id: "st_seul",
    moduleId: "style",
    type: "single",
    title: "Tu avances mieux…",
    options: [
      { id: "solo", label: "Seul, en profondeur", traits: { autonomy: 3, tech: 1 } },
      { id: "duo", label: "En duo / petite équipe", traits: { social: 2, ops: 1 } },
      { id: "equipe", label: "En pilotant une équipe", traits: { ops: 3, sales: 1 } },
    ],
  },
  {
    id: "st_routine",
    moduleId: "style",
    type: "scale",
    group: "st_pair",
    title: "J'aime les process répétables et cadrés",
    scaleLabels: ["Je m'ennuie", "J'adore"],
    traits: { structure: 3, ops: 2 },
  },
  {
    id: "st_client",
    moduleId: "style",
    type: "scale",
    group: "st_pair",
    title: "Parler à des clients toute la journée me convient",
    scaleLabels: ["Épuisant", "Naturel"],
    traits: { sales: 3, social: 2, b2b: 1 },
  },

  // ---------- Personnalité (Big Five + RIASEC) ----------
  {
    id: "bf_ouverture",
    moduleId: "personnalite",
    type: "scale",
    group: "bf_1",
    title: "J'aime explorer des idées nouvelles et abstraites",
    scaleLabels: ["Pas moi", "Tout à fait moi"],
    traits: { creative: 2, reasoning: 1 },
  },
  {
    id: "bf_conscience",
    moduleId: "personnalite",
    type: "scale",
    group: "bf_1",
    title: "Je termine ce que je commence, même sans motivation",
    scaleLabels: ["Rarement", "Toujours"],
    traits: { structure: 3, patience: 2 },
  },
  {
    id: "bf_extraversion",
    moduleId: "personnalite",
    type: "scale",
    group: "bf_2",
    title: "Le contact humain me recharge",
    scaleLabels: ["Ça me vide", "Ça me recharge"],
    traits: { social: 3, sales: 1 },
  },
  {
    id: "bf_stabilite",
    moduleId: "personnalite",
    type: "scale",
    group: "bf_2",
    title: "Je reste calme quand tout dérape",
    scaleLabels: ["Je stresse", "Très stable"],
    traits: { risk: 2, patience: 2 },
  },
  {
    id: "riasec",
    moduleId: "personnalite",
    type: "grid",
    title: "Choisis les 3 rôles dans lesquels tu te reconnais",
    subtitle: "Modèle RIASEC.",
    // multi handled via type grid + max
    options: [
      { id: "realiste", label: "Le bâtisseur", hint: "Concret, manuel", icon: "hammer", traits: { ops: 2 } },
      { id: "investigateur", label: "L'analyste", hint: "Comprendre, mesurer", icon: "search", traits: { analytic: 3, reasoning: 1 } },
      { id: "artistique", label: "Le créatif", hint: "Imaginer, styliser", icon: "palette", traits: { creative: 3, video: 1 } },
      { id: "social", label: "L'accompagnant", hint: "Aider, transmettre", icon: "users", traits: { social: 3 } },
      { id: "entreprenant", label: "Le closer", hint: "Négocier, diriger", icon: "handshake", traits: { sales: 3, risk: 1 } },
      { id: "conventionnel", label: "L'organisateur", hint: "Structurer, fiabiliser", icon: "boxes", traits: { structure: 3, ops: 2 } },
    ],
    min: 3,
    max: 3,
  },

  // ---------- Raisonnement ----------
  {
    id: "cog_matrix_1",
    moduleId: "raisonnement",
    type: "matrix",
    title: "Quelle figure complète la grille ?",
    subtitle: "Observe la logique en lignes et en colonnes.",
    cells: ["cir:1", "cir:2", "cir:3", "sq:1", "sq:2", "sq:3", "tri:1", "tri:2", "?"],
    options: [
      { id: "a", label: "tri:3" },
      { id: "b", label: "sq:3" },
      { id: "c", label: "tri:2" },
      { id: "d", label: "cir:3" },
    ],
    answerId: "a",
    traits: { reasoning: 4 },
  },
  {
    id: "cog_seq_1",
    moduleId: "raisonnement",
    type: "sequence",
    title: "Quelle est la suite ?",
    sequence: ["2", "6", "12", "20", "30", "?"],
    options: [
      { id: "a", label: "36" },
      { id: "b", label: "42" },
      { id: "c", label: "40" },
      { id: "d", label: "48" },
    ],
    answerId: "b",
    traits: { reasoning: 4 },
  },
  {
    id: "cog_analogie",
    moduleId: "raisonnement",
    type: "single",
    title: "Client est à Revenu ce que Audience est à…",
    options: [
      { id: "a", label: "Attention" },
      { id: "b", label: "Publicité" },
      { id: "c", label: "Contenu" },
      { id: "d", label: "Notoriété" },
    ],
    answerId: "a",
    traits: { reasoning: 3 },
  },
  {
    id: "cog_matrix_2",
    moduleId: "raisonnement",
    type: "matrix",
    title: "Complète la matrice",
    cells: ["sq:1", "cir:1", "tri:1", "cir:1", "tri:1", "sq:1", "tri:1", "sq:1", "?"],
    options: [
      { id: "a", label: "sq:1" },
      { id: "b", label: "tri:1" },
      { id: "c", label: "cir:1" },
      { id: "d", label: "cir:2" },
    ],
    answerId: "c",
    traits: { reasoning: 4 },
  },
  {
    id: "cog_probleme",
    moduleId: "raisonnement",
    type: "single",
    title: "Une offre passe de 100 € à 80 €, puis remonte de 25 %.",
    subtitle: "Quel est le prix final ?",
    options: [
      { id: "a", label: "95 €" },
      { id: "b", label: "100 €" },
      { id: "c", label: "105 €" },
      { id: "d", label: "80 €" },
    ],
    answerId: "b",
    traits: { reasoning: 3 },
  },
  {
    id: "cog_seq_2",
    moduleId: "raisonnement",
    type: "sequence",
    title: "Quelle est la suite ?",
    sequence: ["1", "1", "2", "3", "5", "8", "?"],
    options: [
      { id: "a", label: "11" },
      { id: "b", label: "12" },
      { id: "c", label: "13" },
      { id: "d", label: "15" },
    ],
    answerId: "c",
    traits: { reasoning: 4 },
  },
];

export const questionsByModule = (moduleId: string) =>
  questions.filter((q) => q.moduleId === moduleId);

/** Screens = groups of questions displayed together, in module order. */
export interface Screen {
  moduleId: string;
  questions: Question[];
}

export const screens: Screen[] = modules.flatMap((m) => {
  const out: Screen[] = [];
  const seen = new Set<string>();
  for (const q of questionsByModule(m.id)) {
    if (q.group) {
      if (seen.has(q.group)) continue;
      seen.add(q.group);
      out.push({ moduleId: m.id, questions: questions.filter((x) => x.group === q.group) });
    } else {
      out.push({ moduleId: m.id, questions: [q] });
    }
  }
  return out;
});
