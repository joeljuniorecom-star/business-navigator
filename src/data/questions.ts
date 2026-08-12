import coreQuestions from "./v2/questions-core.json";
import bigFiveQuestions from "./v2/questions-big-five.json";
import riasecQuestions from "./v2/questions-riasec.json";
import reasoningQuestions from "./v2/questions-reasoning.json";
import type { Question, QuizModule } from "./types";

export const modules: QuizModule[] = [
  { id: "profile", label: "Ta situation", short: "Profil", intro: "Qui tu es et ton marché" },
  { id: "constraints", label: "Tes contraintes", short: "Contraintes", intro: "Budget, temps et rythme" },
  { id: "goals", label: "Tes objectifs", short: "Objectifs", intro: "Ambition et priorités" },
  { id: "interests", label: "Tes activités", short: "Intérêts", intro: "Ce qui t'anime ou te déplaît" },
  { id: "advantages", label: "Tes atouts", short: "Atouts", intro: "Expérience et réseau" },
  { id: "skills", label: "Tes compétences", short: "Skills", intro: "Ce que tu sais et veux apprendre" },
  { id: "personality", label: "Ta personnalité", short: "Personnalité", intro: "Big Five · Style personnel" },
  { id: "riasec", label: "Tes intérêts pro", short: "Intérêts pro", intro: "RIASEC · Préférences d'activités" },
  { id: "reasoning", label: "Raisonnement", short: "Raisonnement", intro: "Logique, chiffres et structuration" },
];

function transformRawQuestion(q: any): Question {
  return {
    id: q.id,
    moduleId: q.module,
    type: q.type,
    title: q.text,
    subtitle: q.subtitle,
    group: q.group,
    min: q.min_choices ?? (q.min_choices ? q.min_choices : q.type === "multi" ? 1 : undefined),
    max: q.max_choices,
    options: q.options?.map((o: any) => ({
      id: o.id,
      label: o.label,
      hint: o.hint,
      icon: o.icon,
      value: o.value,
    })),
  };
}

export const rawV2Questions: Question[] = [
  ...(coreQuestions as any[]).map(transformRawQuestion),
  ...(bigFiveQuestions as any[]).map(transformRawQuestion),
  ...(riasecQuestions as any[]).map(transformRawQuestion),
  ...(reasoningQuestions as any[]).map(transformRawQuestion),
];

export const questions: Question[] = rawV2Questions;

export const questionsByModule = (moduleId: string) =>
  questions.filter((q) => q.moduleId === moduleId);

export interface Screen {
  moduleId: string;
  questions: Question[];
  title?: string;
  subtitle?: string;
  isSkillsMatrix?: boolean;
}

export const screens: Screen[] = [
  // Module 1: Profile
  {
    moduleId: "profile",
    title: "Situation & Localisation",
    questions: questions.filter((q) => q.id === "profile_status" || q.id === "profile_country"),
  },
  {
    moduleId: "profile",
    title: "Marchés & Langues",
    questions: questions.filter((q) => q.id === "profile_market"),
  },
  {
    moduleId: "profile",
    title: "Expérience Entrepreneuriale",
    questions: questions.filter((q) => q.id === "profile_business_exp"),
  },

  // Module 2: Constraints
  {
    moduleId: "constraints",
    title: "Budget & Temps disponible",
    questions: questions.filter((q) => q.id === "constraint_budget" || q.id === "constraint_hours"),
  },
  {
    moduleId: "constraints",
    title: "Rythme & Organisation",
    questions: questions.filter((q) => q.id === "constraint_first_money" || q.id === "constraint_solo"),
  },
  {
    moduleId: "constraints",
    title: "Cadre de travail",
    questions: questions.filter((q) => q.id === "constraint_remote" || q.id === "constraint_clients"),
  },
  {
    moduleId: "constraints",
    title: "Postures & Risque",
    questions: questions.filter((q) => q.id === "constraint_public" || q.id === "constraint_risk"),
  },

  // Module 3: Goals
  {
    moduleId: "goals",
    questions: questions.filter((q) => q.id === "goal_12m"),
  },
  {
    moduleId: "goals",
    questions: questions.filter((q) => q.id === "goal_priority"),
  },

  // Module 4: Interests
  {
    moduleId: "interests",
    questions: questions.filter((q) => q.id === "interest_activities"),
  },
  {
    moduleId: "interests",
    questions: questions.filter((q) => q.id === "interest_avoid"),
  },

  // Module 5: Advantages
  {
    moduleId: "advantages",
    questions: questions.filter((q) => q.id === "adv_industries"),
  },
  {
    moduleId: "advantages",
    questions: questions.filter((q) => q.id === "adv_network"),
  },

  // Module 6: Skills
  {
    moduleId: "skills",
    title: "Matrice de tes compétences actuelles",
    subtitle: "Évalue ton niveau actuel sur chaque domaine (0 = aucune expérience, 100 = expert).",
    isSkillsMatrix: true,
    questions: questions.filter((q) => q.group === "skills_matrix"),
  },
  {
    moduleId: "skills",
    questions: questions.filter((q) => q.id === "skills_learning"),
  },

  // Module 7: Personality (Big Five - 5 screens of 4 items)
  {
    moduleId: "personality",
    title: "Ouverture d'esprit & Idées",
    questions: questions.filter((q) => q.group === "bf_openness"),
  },
  {
    moduleId: "personality",
    title: "Organisation & Discipline",
    questions: questions.filter((q) => q.group === "bf_conscientiousness"),
  },
  {
    moduleId: "personality",
    title: "Énergie sociale & Relations",
    questions: questions.filter((q) => q.group === "bf_extraversion"),
  },
  {
    moduleId: "personality",
    title: "Coopération & Empathie",
    questions: questions.filter((q) => q.group === "bf_agreeableness"),
  },
  {
    moduleId: "personality",
    title: "Gestion de la pression & Incertitude",
    questions: questions.filter((q) => q.group === "bf_emotional_stability"),
  },

  // Module 8: RIASEC (6 screens of 3 items)
  {
    moduleId: "riasec",
    title: "Activités concrètes (Réaliste)",
    questions: questions.filter((q) => q.id.startsWith("ri_r")),
  },
  {
    moduleId: "riasec",
    title: "Analyse & Résolution (Investigateur)",
    questions: questions.filter((q) => q.id.startsWith("ri_i")),
  },
  {
    moduleId: "riasec",
    title: "Création & Expression (Artistique)",
    questions: questions.filter((q) => q.id.startsWith("ri_a")),
  },
  {
    moduleId: "riasec",
    title: "Accompagnement & Écoute (Social)",
    questions: questions.filter((q) => q.id.startsWith("ri_s")),
  },
  {
    moduleId: "riasec",
    title: "Influence & Leadership (Entreprenant)",
    questions: questions.filter((q) => q.id.startsWith("ri_e")),
  },
  {
    moduleId: "riasec",
    title: "Structure & Rigueur (Conventionnel)",
    questions: questions.filter((q) => q.id.startsWith("ri_c")),
  },

  // Module 9: Reasoning (12 screens)
  ...questions
    .filter((q) => q.moduleId === "reasoning")
    .map((q) => ({
      moduleId: "reasoning",
      questions: [q],
    })),
];
