import type { BigFiveKey, ReasoningKey, RiasecKey } from "./business-schema";

export type SkillKey = "sales" | "marketing" | "copywriting" | "tech" | "automation" | "design" | "content" | "analytical" | "operations" | "management";

export interface UserProfileV2 {
  situation: {
    status: "student" | "employee" | "jobseeker" | "freelance" | "founder";
    country_code: string;
  };
  constraints: {
    budget_eur: number;
    hours_per_week: number;
    max_weeks_to_first_revenue: number;
  };
  experience: {
    business_level: number;
  };
  goals: {
    ambition_level: number;
    priority: "speed" | "stability" | "freedom" | "upside" | "passion";
  };
  preferences: {
    remote: number;
    client_interaction: number;
    public_visibility: number;
    risk_tolerance: number;
    solo: number;
    avoid: string[];
  };
  interests: {
    activities: string[];
  };
  advantages: {
    market_languages: string[];
    industries: string[];
    network: string[];
  };
  skills: {
    current: Record<SkillKey, number>;
    willing_to_learn: SkillKey[];
  };
  big_five: Record<BigFiveKey, number>;
  riasec: Record<RiasecKey, number>;
  reasoning: Record<Exclude<ReasoningKey, "verbal">, number>;
}

export interface MatchBreakdownV2 {
  constraints: number;
  skills_and_learning: number;
  unfair_advantages: number;
  workstyle_preferences: number;
  goals: number;
  riasec: number;
  big_five: number;
  reasoning: number;
}

export interface BusinessMatchV2 {
  business_id: string;
  score: number;
  hard_penalty: number;
  confidence: number;
  breakdown: MatchBreakdownV2;
  strengths: string[];
  attention: string[];
}
