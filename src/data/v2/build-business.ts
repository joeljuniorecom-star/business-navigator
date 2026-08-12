import type { BusinessSeed, BusinessV2 } from "./business-schema";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const LEARNABLE = [
  "sales", "marketing", "copywriting", "tech", "automation",
  "design", "content", "analytical", "operations", "management",
];

/**
 * Expands compact, human-auditable business seeds into the full matching vector.
 * The formulas are editorial defaults, deliberately centralized so later outcome
 * data can calibrate them without rewriting 120 catalogue entries.
 */
export function buildBusiness(seed: BusinessSeed): BusinessV2 {
  const [sales, tech, creativity, analytical, operations, content, client] = seed.core;
  const isPhysical = seed.universe === "physical";

  const demands = {
    sales,
    client_interaction: client,
    tech,
    creativity,
    content,
    copywriting: clamp((sales + content) / 2),
    analytical,
    operations,
    management: clamp((operations + client) / 2 - 10),
    logistics: clamp(operations - 20),
    networking: clamp((sales + client) / 2),
  };

  const workstyle = {
    remote_compatibility: isPhysical ? 35 : 95,
    solo_compatibility: clamp(95 - Math.max(client - 40, 0) * 0.35 - Math.max(operations - 70, 0) * 0.2),
    team_dependency: clamp((operations + client) / 2 - 25),
    public_visibility: clamp(content * 0.8 + client * 0.2),
    routine_tolerance: clamp(40 + operations * 0.45 - creativity * 0.2),
    ambiguity_tolerance: clamp(45 + analytical * 0.2 + sales * 0.15),
    execution_speed: clamp(55 + sales * 0.2 - tech * 0.08),
  };

  const riasec_target = {
    realistic: clamp(15 + (isPhysical ? 55 : 0) + operations * 0.15),
    investigative: clamp(20 + analytical * 0.65 + tech * 0.2),
    artistic: clamp(15 + creativity * 0.75 + content * 0.15),
    social: clamp(20 + client * 0.55 + content * 0.1),
    enterprising: clamp(25 + sales * 0.7 + client * 0.15),
    conventional: clamp(20 + operations * 0.65 + analytical * 0.15),
  };

  const big_five_target = {
    openness: clamp(40 + creativity * 0.3 + tech * 0.15),
    conscientiousness: clamp(40 + operations * 0.35 + analytical * 0.15),
    extraversion: clamp(35 + client * 0.35 + sales * 0.2),
    agreeableness: clamp(45 + client * 0.15 - sales * 0.05),
    emotional_stability: clamp(50 + sales * 0.1 + operations * 0.08),
  };

  const cognition_relevance = {
    logical: clamp(25 + analytical * 0.5 + tech * 0.15),
    numerical: clamp(20 + analytical * 0.55),
    abstract: clamp(20 + tech * 0.4 + creativity * 0.2),
    pattern: clamp(20 + analytical * 0.45 + creativity * 0.15),
    verbal: clamp(25 + sales * 0.25 + content * 0.3),
  };

  return {
    id: seed.id,
    name: seed.name,
    universe: seed.universe,
    family: seed.family,
    description: `${seed.name} — modèle ${seed.family.toLowerCase()} à évaluer selon le profil, les contraintes et les avantages personnels de l'utilisateur.`,
    economics: {
      budget_min_eur: seed.budgetMinEur,
      budget_ideal_eur: seed.budgetIdealEur,
      hours_per_week_min: seed.hoursPerWeekMin,
      first_revenue_weeks_typical: seed.firstRevenueWeeksTypical,
      risk: seed.risk,
      scalability: seed.scalability,
      financial_upside: seed.financialUpside,
      difficulty: seed.difficulty,
    },
    demands,
    workstyle,
    riasec_target,
    big_five_target,
    cognition_relevance,
    skills_core: seed.skillsCore,
    skills_learnable: LEARNABLE.filter((skill) => !seed.skillsCore.includes(skill)).slice(0, 4),
    hard_requirements: seed.hardRequirements ?? [],
    tags: [seed.family.toLowerCase(), ...(seed.tags ?? [])],
    evidence_status: "heuristic_editorial_estimate",
    notes: "Scores de profil = heuristiques éditoriales configurables, pas probabilités de réussite.",
  };
}
