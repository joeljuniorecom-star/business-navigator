import coreQuestions from "./questions-core.json";
import bigFiveQuestions from "./questions-big-five.json";
import riasecQuestions from "./questions-riasec.json";
import reasoningQuestions from "./questions-reasoning.json";
import type { BigFiveKey, RiasecKey } from "./business-schema";
import type { SkillKey, UserProfileV2 } from "./profile-schema";

export type V2Answer = string | string[];
export type V2Answers = Record<string, V2Answer>;
type AnyQuestion = { id: string; options?: { id: string; value?: number }[]; scoring?: any };

const normalizeLikert = (value: number) => Math.max(0, Math.min(100, (value - 1) * 25));
const asArray = (value: V2Answer | undefined) => value === undefined ? [] : Array.isArray(value) ? value : [value];
const optionValue = (questions: AnyQuestion[], questionId: string, answer: V2Answer | undefined, fallback = 0) => {
  if (answer === undefined || Array.isArray(answer)) return fallback;
  const q = questions.find((item) => item.id === questionId);
  const option = q?.options?.find((item) => item.id === answer);
  return Number(option?.value ?? answer ?? fallback);
};

function scoreBigFive(answers: V2Answers) {
  const factors: BigFiveKey[] = ["openness", "conscientiousness", "extraversion", "agreeableness", "emotional_stability"];
  return Object.fromEntries(factors.map((factor) => {
    const items = (bigFiveQuestions as AnyQuestion[]).filter((q) => q.scoring?.factor === factor);
    const values = items.map((q) => {
      const raw = optionValue(bigFiveQuestions as AnyQuestion[], q.id, answers[q.id], 3);
      const keyed = q.scoring.key === -1 ? 6 - raw : raw;
      return normalizeLikert(keyed);
    });
    return [factor, Math.round(values.reduce((a,b)=>a+b,0) / values.length)];
  })) as Record<BigFiveKey, number>;
}

function scoreRiasec(answers: V2Answers) {
  const factors: RiasecKey[] = ["realistic", "investigative", "artistic", "social", "enterprising", "conventional"];
  return Object.fromEntries(factors.map((factor) => {
    const items = (riasecQuestions as AnyQuestion[]).filter((q) => q.scoring?.factor === factor);
    const values = items.map((q) => normalizeLikert(optionValue(riasecQuestions as AnyQuestion[], q.id, answers[q.id], 3)));
    return [factor, Math.round(values.reduce((a,b)=>a+b,0) / values.length)];
  })) as Record<RiasecKey, number>;
}

function scoreReasoning(answers: V2Answers) {
  const dimensions = ["logical", "numerical", "pattern", "abstract"] as const;
  return Object.fromEntries(dimensions.map((dimension) => {
    const items = (reasoningQuestions as AnyQuestion[]).filter((q) => q.scoring?.dimension === dimension);
    const correct = items.filter((q) => answers[q.id] === q.scoring.answer_id).length;
    return [dimension, Math.round((correct / Math.max(1, items.length)) * 100)];
  })) as UserProfileV2["reasoning"];
}

const skillIds: Record<SkillKey,string> = {
  sales:"skill_sales", marketing:"skill_marketing", copywriting:"skill_copy", tech:"skill_code",
  automation:"skill_nocode", design:"skill_design", content:"skill_video", analytical:"skill_data",
  operations:"skill_ops", management:"skill_leadership",
};

export function buildUserProfileV2(answers: V2Answers): UserProfileV2 {
  const currentSkills = Object.fromEntries(Object.entries(skillIds).map(([skill,questionId]) => [skill, optionValue(coreQuestions as AnyQuestion[], questionId, answers[questionId], 0)])) as Record<SkillKey,number>;
  return {
    situation: {
      status: String(answers["profile_status"] ?? "jobseeker") as UserProfileV2["situation"]["status"],
      country_code: String(answers["profile_country"] ?? "FR"),
    },
    constraints: {
      budget_eur: optionValue(coreQuestions as AnyQuestion[], "constraint_budget", answers["constraint_budget"], 0),
      hours_per_week: optionValue(coreQuestions as AnyQuestion[], "constraint_hours", answers["constraint_hours"], 8),
      max_weeks_to_first_revenue: optionValue(coreQuestions as AnyQuestion[], "constraint_first_money", answers["constraint_first_money"], 12),
    },
    experience: {
      business_level: Number((coreQuestions as AnyQuestion[]).find((q)=>q.id==="profile_business_exp")?.scoring?.map?.[String(answers["profile_business_exp"] ?? "none")] ?? 0),
    },
    goals: {
      ambition_level: Number((coreQuestions as AnyQuestion[]).find((q)=>q.id==="goal_12m")?.scoring?.map?.[String(answers["goal_12m"] ?? "living")] ?? 50),
      priority: String(answers["goal_priority"] ?? "passion") as UserProfileV2["goals"]["priority"],
    },
    preferences: {
      remote: normalizeLikert(optionValue(coreQuestions as AnyQuestion[], "constraint_remote", answers["constraint_remote"], 3)),
      client_interaction: normalizeLikert(optionValue(coreQuestions as AnyQuestion[], "constraint_clients", answers["constraint_clients"], 3)),
      public_visibility: normalizeLikert(optionValue(coreQuestions as AnyQuestion[], "constraint_public", answers["constraint_public"], 3)),
      risk_tolerance: normalizeLikert(optionValue(coreQuestions as AnyQuestion[], "constraint_risk", answers["constraint_risk"], 3)),
      solo: optionValue(coreQuestions as AnyQuestion[], "constraint_solo", answers["constraint_solo"], 50),
      avoid: asArray(answers["interest_avoid"]),
    },
    interests: { activities: asArray(answers["interest_activities"]) },
    advantages: {
      market_languages: asArray(answers["profile_market"]),
      industries: asArray(answers["adv_industries"]),
      network: asArray(answers["adv_network"]),
    },
    skills: {
      current: currentSkills,
      willing_to_learn: asArray(answers["skills_learning"]) as SkillKey[],
    },
    big_five: scoreBigFive(answers),
    riasec: scoreRiasec(answers),
    reasoning: scoreReasoning(answers),
  };
}
