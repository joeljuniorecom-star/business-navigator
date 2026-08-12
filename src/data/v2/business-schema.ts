export type BusinessUniverse = "ecommerce" | "agency_services" | "software" | "information" | "physical";

export type DemandKey =
  | "sales" | "client_interaction" | "tech" | "creativity" | "content"
  | "copywriting" | "analytical" | "operations" | "management" | "logistics" | "networking";

export type RiasecKey = "realistic" | "investigative" | "artistic" | "social" | "enterprising" | "conventional";
export type BigFiveKey = "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "emotional_stability";
export type ReasoningKey = "logical" | "numerical" | "abstract" | "pattern" | "verbal";

export interface BusinessSeed {
  id: string;
  name: string;
  universe: BusinessUniverse;
  family: string;
  budgetMinEur: number;
  budgetIdealEur: number;
  hoursPerWeekMin: number;
  firstRevenueWeeksTypical: number;
  risk: number;
  scalability: number;
  financialUpside: number;
  difficulty: number;
  /** Core editorial requirements: sales, tech, creativity, analytical, operations, content, client interaction. */
  core: [number, number, number, number, number, number, number];
  skillsCore: string[];
  hardRequirements?: string[];
  tags?: string[];
}

export interface BusinessV2 {
  id: string;
  name: string;
  universe: BusinessUniverse;
  family: string;
  description: string;
  economics: {
    budget_min_eur: number;
    budget_ideal_eur: number;
    hours_per_week_min: number;
    first_revenue_weeks_typical: number;
    risk: number;
    scalability: number;
    financial_upside: number;
    difficulty: number;
  };
  demands: Record<DemandKey, number>;
  workstyle: {
    remote_compatibility: number;
    solo_compatibility: number;
    team_dependency: number;
    public_visibility: number;
    routine_tolerance: number;
    ambiguity_tolerance: number;
    execution_speed: number;
  };
  riasec_target: Record<RiasecKey, number>;
  big_five_target: Record<BigFiveKey, number>;
  cognition_relevance: Record<ReasoningKey, number>;
  skills_core: string[];
  skills_learnable: string[];
  hard_requirements: string[];
  tags: string[];
  evidence_status: "heuristic_editorial_estimate";
  notes: string;
}
