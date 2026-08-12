import type { BusinessV2, DemandKey, ReasoningKey } from "./business-schema";
import type { BusinessMatchV2, MatchBreakdownV2, SkillKey, UserProfileV2 } from "./profile-schema";

const WEIGHTS: MatchBreakdownV2 = {
  constraints: 0.20,
  skills_and_learning: 0.20,
  unfair_advantages: 0.20,
  workstyle_preferences: 0.15,
  goals: 0.10,
  riasec: 0.075,
  big_five: 0.05,
  reasoning: 0.025,
};
const clamp = (n: number) => Math.max(0, Math.min(100, n));
const mean = (xs: number[]) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 50;
const proximity = (a: number, b: number) => clamp(100 - Math.abs(a - b));

function thresholdScore(user: number, required: number, willingToLearn = false) {
  if (required <= 10 || user >= required) return 100;
  const ratio = clamp((user / Math.max(1, required)) * 100);
  if (!willingToLearn) return ratio;
  const gap = required - user;
  return clamp(Math.max(ratio, 82 - gap * 0.35));
}

function constraints(profile: UserProfileV2, business: BusinessV2) {
  const e = business.economics;
  const budget = profile.constraints.budget_eur >= e.budget_min_eur ? 100 : clamp((profile.constraints.budget_eur / Math.max(1, e.budget_min_eur)) * 100);
  const time = profile.constraints.hours_per_week >= e.hours_per_week_min ? 100 : clamp((profile.constraints.hours_per_week / e.hours_per_week_min) * 100);
  const revenueSpeed = profile.constraints.max_weeks_to_first_revenue >= e.first_revenue_weeks_typical ? 100 : clamp((profile.constraints.max_weeks_to_first_revenue / e.first_revenue_weeks_typical) * 100);
  const risk = thresholdScore(profile.preferences.risk_tolerance, e.risk);
  return { score: mean([budget, time, revenueSpeed, risk]), budget, time, revenueSpeed, risk };
}

const demandToSkill: Partial<Record<DemandKey, SkillKey | SkillKey[]>> = {
  sales: "sales", tech: ["tech", "automation"], creativity: ["design", "content"], content: "content",
  copywriting: "copywriting", analytical: "analytical", operations: "operations", management: "management",
};

function skills(profile: UserProfileV2, business: BusinessV2) {
  const scores: number[] = [];
  for (const [demand, skill] of Object.entries(demandToSkill) as [DemandKey, SkillKey | SkillKey[]][]) {
    const required = business.demands[demand];
    const candidates = Array.isArray(skill) ? skill : [skill];
    const current = Math.max(...candidates.map((k) => profile.skills.current[k] ?? 0));
    const willing = candidates.some((k) => profile.skills.willing_to_learn.includes(k));
    scores.push(thresholdScore(current, required, willing));
  }
  const marketingRequirement = mean([business.demands.sales, business.demands.content, business.demands.analytical]);
  scores.push(thresholdScore(profile.skills.current.marketing, marketingRequirement, profile.skills.willing_to_learn.includes("marketing")));
  return mean(scores);
}

function unfairAdvantages(profile: UserProfileV2, business: BusinessV2) {
  let score = 35 + profile.experience.business_level * 0.20;
  const network = new Set(profile.advantages.network);
  if (network.has("businesses")) score += business.demands.sales * 0.10 + business.demands.client_interaction * 0.05;
  if (network.has("creators") || network.has("audience")) score += business.demands.content * 0.12;
  if (network.has("developers")) score += business.demands.tech * 0.08;
  if (network.has("suppliers") && business.universe === "ecommerce") score += 16;
  if (network.has("local") && business.universe === "physical") score += 18;
  if (network.has("professionals")) score += 8;
  if (profile.advantages.market_languages.length >= 2 && business.workstyle.remote_compatibility >= 70) score += 8;
  if (profile.advantages.industries.length > 0 && !profile.advantages.industries.includes("none")) score += Math.min(10, profile.advantages.industries.length * 3);
  return clamp(score);
}

function interestFit(profile: UserProfileV2, business: BusinessV2) {
  const d = business.demands;
  const activityScore: Record<string, number> = {
    sell: d.sales,
    build: mean([d.tech, d.operations, d.creativity]),
    code: d.tech,
    design: d.creativity,
    write: mean([d.copywriting, d.content]),
    video: mean([d.content, d.creativity]),
    analyse: d.analytical,
    teach: mean([d.client_interaction, d.content]),
    negotiate: mean([d.sales, d.networking]),
    organize: mean([d.operations, d.management]),
    source: mean([d.logistics, d.analytical]),
    repair: business.universe === "physical" ? mean([d.tech, d.operations, 100]) : mean([d.tech, d.operations]),
  };
  const selected = profile.interests.activities.map((id) => activityScore[id]).filter((value): value is number => value !== undefined);
  return selected.length ? mean(selected) : 50;
}

function avoidanceComfort(profile: UserProfileV2, business: BusinessV2) {
  const d = business.demands;
  const w = business.workstyle;
  const burden: Record<string, number> = {
    sales: d.sales,
    clients: d.client_interaction,
    code: d.tech,
    content: d.content,
    camera: w.public_visibility,
    logistics: d.logistics,
    team: w.team_dependency,
    routine: w.routine_tolerance,
    uncertainty: mean([business.economics.risk, w.ambiguity_tolerance]),
  };
  const selected = profile.preferences.avoid.map((id) => burden[id]).filter((value): value is number => value !== undefined);
  return selected.length ? clamp(100 - mean(selected)) : 75;
}

function workstyle(profile: UserProfileV2, business: BusinessV2) {
  const p = profile.preferences;
  const w = business.workstyle;
  return mean([
    proximity(p.remote, w.remote_compatibility),
    proximity(p.client_interaction, business.demands.client_interaction),
    proximity(p.public_visibility, w.public_visibility),
    proximity(p.solo, w.solo_compatibility),
    proximity(p.risk_tolerance, business.economics.risk),
    interestFit(profile, business),
    avoidanceComfort(profile, business),
  ]);
}

function goals(profile: UserProfileV2, business: BusinessV2) {
  const e = business.economics;
  const ambition = thresholdScore(e.financial_upside, profile.goals.ambition_level);
  if (profile.goals.priority === "speed") return mean([ambition, clamp(110 - e.first_revenue_weeks_typical * 4)]);
  if (profile.goals.priority === "stability") return mean([ambition, clamp(115 - e.risk)]);
  if (profile.goals.priority === "freedom") return mean([ambition, business.workstyle.remote_compatibility, business.workstyle.solo_compatibility]);
  if (profile.goals.priority === "upside") return mean([ambition, e.financial_upside, e.scalability]);
  return mean([ambition, workstyle(profile, business)]);
}

function riasec(profile: UserProfileV2, business: BusinessV2) {
  return mean(Object.keys(business.riasec_target).map((k) => proximity(profile.riasec[k as keyof typeof profile.riasec], business.riasec_target[k as keyof typeof business.riasec_target])));
}
function bigFive(profile: UserProfileV2, business: BusinessV2) {
  return mean(Object.keys(business.big_five_target).map((k) => proximity(profile.big_five[k as keyof typeof profile.big_five], business.big_five_target[k as keyof typeof business.big_five_target])));
}
function reasoning(profile: UserProfileV2, business: BusinessV2) {
  const dims = ["logical", "numerical", "abstract", "pattern"] as const;
  let weighted = 0, weight = 0;
  for (const dim of dims) {
    const relevance = business.cognition_relevance[dim as ReasoningKey] / 100;
    weighted += profile.reasoning[dim] * relevance;
    weight += relevance;
  }
  return weight ? clamp(weighted / weight) : 50;
}

function hardPenalty(profile: UserProfileV2, business: BusinessV2) {
  const e = business.economics;
  let penalty = 0;
  if (profile.constraints.budget_eur < e.budget_min_eur) penalty += Math.min(35, (1 - profile.constraints.budget_eur / Math.max(1, e.budget_min_eur)) * 35);
  if (profile.constraints.hours_per_week < e.hours_per_week_min) penalty += Math.min(25, (1 - profile.constraints.hours_per_week / e.hours_per_week_min) * 25);

  const refused = (skill: SkillKey) => !profile.skills.willing_to_learn.includes(skill);
  if (business.demands.tech >= 90 && Math.max(profile.skills.current.tech, profile.skills.current.automation) < 25 && refused("tech") && refused("automation")) penalty += 35;
  if (business.demands.sales >= 95 && profile.skills.current.sales < 20 && refused("sales")) penalty += 25;
  if (business.demands.operations >= 95 && profile.skills.current.operations < 20 && refused("operations")) penalty += 20;
  return clamp(penalty);
}

function reasons(profile: UserProfileV2, business: BusinessV2, breakdown: MatchBreakdownV2, penalty: number) {
  const strengths: string[] = [];
  const attention: string[] = [];
  const entries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const labels: Record<string,string> = {
    constraints: "tes contraintes de budget et de temps", skills_and_learning: "tes compétences et ce que tu es prêt à apprendre",
    unfair_advantages: "tes avantages personnels et ton réseau", workstyle_preferences: "tes goûts et ta façon préférée de travailler",
    goals: "tes objectifs", riasec: "tes intérêts professionnels", big_five: "ton profil de personnalité", reasoning: "ton profil de raisonnement",
  };
  for (const [key, value] of entries.slice(0, 3)) if (value >= 70) strengths.push(`Bon match avec ${labels[key]}.`);
  if (profile.constraints.budget_eur < business.economics.budget_min_eur) attention.push(`Budget de départ inférieur au minimum estimé de ${business.economics.budget_min_eur.toLocaleString("fr-FR")} €.`);
  if (profile.constraints.hours_per_week < business.economics.hours_per_week_min) attention.push(`Le modèle demande environ ${business.economics.hours_per_week_min} h/semaine au démarrage.`);
  if (penalty >= 25) attention.push("Une contrainte forte ou une compétence indispensable non souhaitée réduit nettement la compatibilité.");
  if (penalty === 0 && strengths.length < 2) strengths.push("Aucune contrainte dure majeure n'a été détectée.");
  return { strengths: strengths.slice(0,3), attention: attention.slice(0,3) };
}

export function matchBusiness(profile: UserProfileV2, business: BusinessV2): BusinessMatchV2 {
  const c = constraints(profile, business);
  const breakdown: MatchBreakdownV2 = {
    constraints: c.score,
    skills_and_learning: skills(profile, business),
    unfair_advantages: unfairAdvantages(profile, business),
    workstyle_preferences: workstyle(profile, business),
    goals: goals(profile, business),
    riasec: riasec(profile, business),
    big_five: bigFive(profile, business),
    reasoning: reasoning(profile, business),
  };
  const raw = Object.entries(WEIGHTS).reduce((sum, [key, weight]) => sum + breakdown[key as keyof MatchBreakdownV2] * weight, 0);
  const penalty = hardPenalty(profile, business);
  const score = clamp(raw - penalty);
  const confidence = clamp(65 + Math.min(20, profile.advantages.industries.length * 3) + (profile.experience.business_level > 0 ? 10 : 0));
  const explanation = reasons(profile, business, breakdown, penalty);
  return { business_id: business.id, score: Math.round(score), hard_penalty: Math.round(penalty), confidence: Math.round(confidence), breakdown: Object.fromEntries(Object.entries(breakdown).map(([k,v])=>[k,Math.round(v)])) as MatchBreakdownV2, ...explanation };
}

export function rankBusinesses(profile: UserProfileV2, businesses: BusinessV2[]) {
  return businesses.map((business) => matchBusiness(profile, business)).sort((a,b) => b.score-a.score);
}
