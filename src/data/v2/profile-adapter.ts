import type { Answers } from "@/data/types";
import { businessesV2 } from "./catalog";
import type { UserProfileV2 } from "./profile-schema";
import type { SkillKey } from "./profile-schema";

const LEGACY_TO_V2: Record<string, string> = {
  "agence-automatisation-ia": "agency_ai_automation",
  "micro-saas-b2b": "sw_micro_saas_b2b",
  "ecommerce-organique": "ecom_creator_led",
  "ghostwriting-b2b": "agency_copy",
  "creator-monetise": "info_shortform_creator",
  "conseil-expert": "info_consulting_productized",
  "agence-acquisition": "agency_ppc",
  "produits-digitaux": "info_digital_templates",
  "service-local-premium": "phy_cleaning",
  "investissement-actifs": "info_paid_reports",
};

const skillIds: Record<string, SkillKey> = {
  code: "tech",
  auto: "automation",
  redac: "copywriting",
  video: "content",
  design: "design",
  vente: "sales",
  ads: "marketing",
  gestion: "operations",
  analyse: "analytical",
};

const activityIds: Record<string, string> = {
  tech: "code",
  design: "design",
  marketing: "sell",
  finance: "analyse",
  contenu: "write",
  produit: "source",
  humain: "teach",
  immobilier: "negotiate",
  resoudre: "analyse",
  creer: "design",
  convaincre: "sell",
  organiser: "organize",
};

const toArray = (value: Answers[string] | undefined): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  return typeof value === "string" ? [value] : [];
};

const asNumber = (value: Answers[string] | undefined, fallback = 0): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

function scaleToPercent(value: Answers[string] | undefined, fallback = 50): number {
  const numeric = asNumber(value, fallback);
  if (numeric <= 5) return Math.max(0, Math.min(100, (numeric - 1) * 25));
  return Math.max(0, Math.min(100, numeric));
}

function average(values: number[], fallback = 50): number {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : fallback;
}

function answerScore(answers: Answers, id: string, answerId: string): number {
  return answers[id] === answerId ? 100 : 0;
}

function legacyStatus(answer: Answers[string] | undefined): UserProfileV2["situation"]["status"] {
  switch (answer) {
    case "salarie":
      return "employee";
    case "etudiant":
      return "student";
    case "freelance":
      return "freelance";
    case "entrepreneur":
      return "founder";
    default:
      return "jobseeker";
  }
}

function legacySkills(answers: Answers): Record<SkillKey, number> {
  const selected = new Set(toArray(answers.sk_niveau));
  const current = {} as Record<SkillKey, number>;
  const allSkills: SkillKey[] = [
    "sales",
    "marketing",
    "copywriting",
    "tech",
    "automation",
    "design",
    "content",
    "analytical",
    "operations",
    "management",
  ];

  for (const skill of allSkills) current[skill] = 0;
  for (const [legacyId, skill] of Object.entries(skillIds)) {
    if (selected.has(legacyId)) current[skill] = 75;
  }

  const technicalConfidence = scaleToPercent(answers.sk_technique, 50);
  const learningSpeed = scaleToPercent(answers.sk_apprentissage, 50);
  current.tech = Math.max(current.tech, technicalConfidence);
  if (current.automation > 0) current.automation = Math.max(current.automation, learningSpeed);
  return current;
}

export function getCanonicalV2BusinessId(legacyBusinessId: string): string {
  const mapped = LEGACY_TO_V2[legacyBusinessId] ?? legacyBusinessId;
  return businessesV2.some((business) => business.id === mapped) ? mapped : legacyBusinessId;
}

export function buildUserProfileForBOS(answers: Answers): UserProfileV2 {
  const languages = toArray(answers.sit_lang).map((language) => language === "autre" ? "other" : language);
  const activities = [
    ...toArray(answers.int_univers).map((id) => activityIds[id]).filter((id): id is string => Boolean(id)),
    ...toArray(answers.int_energie).map((id) => activityIds[id]).filter((id): id is string => Boolean(id)),
  ];
  const zone = answers.sit_zone;
  const horizon = answers.amb_horizon;
  const objective = answers.amb_objectif;
  const soloAnswer = answers.st_seul;
  const network = answers.adv_reseau;

  const selectedRiasec = new Set(toArray(answers.riasec));
  const riasec = {
    realistic: selectedRiasec.has("realiste") ? 90 : 50,
    investigative: selectedRiasec.has("investigateur") ? 90 : 50,
    artistic: selectedRiasec.has("artistique") ? 90 : 50,
    social: selectedRiasec.has("social") ? 90 : 50,
    enterprising: selectedRiasec.has("entreprenant") ? 90 : 50,
    conventional: selectedRiasec.has("conventionnel") ? 90 : 50,
  };

  const reasoningMatrix = average([
    answerScore(answers, "cog_matrix_1", "a"),
    answerScore(answers, "cog_matrix_2", "c"),
  ]);
  const reasoningNumerical = average([
    answerScore(answers, "cog_seq_1", "b"),
    answerScore(answers, "cog_seq_2", "c"),
  ]);
  const reasoningLogical = average([
    answerScore(answers, "cog_analogie", "a"),
    answerScore(answers, "cog_probleme", "b"),
  ]);

  const willingToLearn: SkillKey[] = scaleToPercent(answers.sk_apprentissage, 50) >= 50
    ? ["tech", "automation", "marketing", "sales"]
    : [];

  return {
    situation: {
      status: legacyStatus(answers.sit_status),
      country_code: zone === "monde" ? "INT" : "FR",
    },
    constraints: {
      budget_eur: Math.max(0, asNumber(answers.adv_capital, 0)),
      hours_per_week: Math.max(0, Math.min(168, asNumber(answers.adv_temps, 8))),
      max_weeks_to_first_revenue: horizon === "rapide" ? 8 : horizon === "long" ? 52 : 24,
    },
    experience: {
      business_level: answers.sit_experience === "pro" ? 100
        : answers.sit_experience === "revenus" ? 65
          : answers.sit_experience === "essais" ? 30 : 0,
    },
    goals: {
      ambition_level: objective === "scaler" ? 100
        : objective === "remplacer" ? 75
          : objective === "liberte" ? 50 : 25,
      priority: objective === "liberte" ? "freedom"
        : objective === "scaler" ? "upside"
          : objective === "complement" ? "stability" : "passion",
    },
    preferences: {
      remote: zone === "monde" ? 100 : 50,
      client_interaction: scaleToPercent(answers.st_client),
      public_visibility: scaleToPercent(answers.int_visible),
      risk_tolerance: scaleToPercent(answers.amb_risque),
      solo: soloAnswer === "solo" ? 90 : soloAnswer === "equipe" ? 30 : 65,
      avoid: [],
    },
    interests: {
      activities: [...new Set(activities)],
    },
    advantages: {
      market_languages: languages,
      industries: toArray(answers.int_univers),
      network: network === "audience" ? ["audience"] : network === "solide" ? ["businesses", "professionals"] : network === "petit" ? ["professionals"] : ["none"],
    },
    skills: {
      current: legacySkills(answers),
      willing_to_learn: willingToLearn,
    },
    big_five: {
      openness: scaleToPercent(answers.bf_ouverture),
      conscientiousness: scaleToPercent(answers.bf_conscience),
      extraversion: scaleToPercent(answers.bf_extraversion),
      agreeableness: 50,
      emotional_stability: scaleToPercent(answers.bf_stabilite),
    },
    riasec,
    reasoning: {
      logical: reasoningLogical,
      numerical: reasoningNumerical,
      abstract: reasoningMatrix,
      pattern: average([reasoningMatrix, reasoningNumerical]),
    },
  };
}
