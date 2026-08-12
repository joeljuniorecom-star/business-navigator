import { businessesV2 } from "./catalog";
import { rankBusinesses } from "./matching-engine";
import type { BOSRequest, BOSResult } from "./bos-schema";
import type { BigFiveKey, BusinessV2, ReasoningKey, RiasecKey } from "./business-schema";
import type { SkillKey, UserProfileV2 } from "./profile-schema";
import { generateDeterministicBOS } from "./bos-generator";

export class BOSRequestError extends Error {
  constructor(
    message: string,
    public readonly statusCode: 400 | 404 = 400,
  ) {
    super(message);
    this.name = "BOSRequestError";
  }
}

const SKILL_KEYS: SkillKey[] = [
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
const BIG_FIVE_KEYS: BigFiveKey[] = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "emotional_stability",
];
const RIASEC_KEYS: RiasecKey[] = [
  "realistic",
  "investigative",
  "artistic",
  "social",
  "enterprising",
  "conventional",
];
const REASONING_KEYS: Exclude<ReasoningKey, "verbal">[] = [
  "logical",
  "numerical",
  "abstract",
  "pattern",
];
const BUSINESS_UNIVERSES = ["ecommerce", "agency_services", "software", "information", "physical"] as const;
const STATUSES = ["student", "employee", "jobseeker", "freelance", "founder"] as const;
const GOAL_PRIORITIES = ["speed", "stability", "freedom", "upside", "passion"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(field: string, message = "is invalid"): never {
  throw new BOSRequestError(`Invalid BOS payload: ${field} ${message}.`);
}

function finiteNumber(value: unknown, field: string, min = 0, max = 100): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    fail(field, `must be a finite number between ${min} and ${max}`);
  }
  return value;
}

function requiredRecord(value: unknown, field: string): Record<string, unknown> {
  if (!isRecord(value)) fail(field, "must be an object");
  return value;
}

function stringValue(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) fail(field, "must be a non-empty string");
  return value;
}

function stringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    fail(field, "must be an array of strings");
  }
  return value;
}

function scoredRecord<T extends string>(value: unknown, keys: readonly T[], field: string): Record<T, number> {
  const record = requiredRecord(value, field);
  const output = {} as Record<T, number>;
  for (const key of keys) {
    if (!(key in record)) fail(`${field}.${key}`, "is required");
    output[key] = finiteNumber(record[key], `${field}.${key}`);
  }
  return output;
}

function validateProfile(value: unknown): UserProfileV2 {
  const profile = requiredRecord(value, "profile");
  const situation = requiredRecord(profile.situation, "profile.situation");
  const constraints = requiredRecord(profile.constraints, "profile.constraints");
  const experience = requiredRecord(profile.experience, "profile.experience");
  const goals = requiredRecord(profile.goals, "profile.goals");
  const preferences = requiredRecord(profile.preferences, "profile.preferences");
  const interests = requiredRecord(profile.interests, "profile.interests");
  const advantages = requiredRecord(profile.advantages, "profile.advantages");
  const skills = requiredRecord(profile.skills, "profile.skills");

  if (!STATUSES.includes(situation.status as (typeof STATUSES)[number])) fail("profile.situation.status");
  const countryCode = stringValue(situation.country_code, "profile.situation.country_code");

  const budget = finiteNumber(constraints.budget_eur, "profile.constraints.budget_eur", 0, Number.MAX_SAFE_INTEGER);
  const hours = finiteNumber(constraints.hours_per_week, "profile.constraints.hours_per_week", 0, 168);
  const maxWeeks = finiteNumber(
    constraints.max_weeks_to_first_revenue,
    "profile.constraints.max_weeks_to_first_revenue",
    0,
    520,
  );

  const priority = goals.priority;
  if (!GOAL_PRIORITIES.includes(priority as (typeof GOAL_PRIORITIES)[number])) fail("profile.goals.priority");

  return {
    situation: {
      status: situation.status as UserProfileV2["situation"]["status"],
      country_code: countryCode,
    },
    constraints: {
      budget_eur: budget,
      hours_per_week: hours,
      max_weeks_to_first_revenue: maxWeeks,
    },
    experience: {
      business_level: finiteNumber(experience.business_level, "profile.experience.business_level"),
    },
    goals: {
      ambition_level: finiteNumber(goals.ambition_level, "profile.goals.ambition_level"),
      priority: priority as UserProfileV2["goals"]["priority"],
    },
    preferences: {
      remote: finiteNumber(preferences.remote, "profile.preferences.remote"),
      client_interaction: finiteNumber(preferences.client_interaction, "profile.preferences.client_interaction"),
      public_visibility: finiteNumber(preferences.public_visibility, "profile.preferences.public_visibility"),
      risk_tolerance: finiteNumber(preferences.risk_tolerance, "profile.preferences.risk_tolerance"),
      solo: finiteNumber(preferences.solo, "profile.preferences.solo"),
      avoid: stringArray(preferences.avoid, "profile.preferences.avoid"),
    },
    interests: {
      activities: stringArray(interests.activities, "profile.interests.activities"),
    },
    advantages: {
      market_languages: stringArray(advantages.market_languages, "profile.advantages.market_languages"),
      industries: stringArray(advantages.industries, "profile.advantages.industries"),
      network: stringArray(advantages.network, "profile.advantages.network"),
    },
    skills: {
      current: scoredRecord(skills.current, SKILL_KEYS, "profile.skills.current"),
      willing_to_learn: stringArray(skills.willing_to_learn, "profile.skills.willing_to_learn") as SkillKey[],
    },
    big_five: scoredRecord(profile.big_five, BIG_FIVE_KEYS, "profile.big_five"),
    riasec: scoredRecord(profile.riasec, RIASEC_KEYS, "profile.riasec"),
    reasoning: scoredRecord(profile.reasoning, REASONING_KEYS, "profile.reasoning"),
  };
}

function validateBusinessId(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) fail("businessId", "must be a non-empty string");
  return value;
}

function canonicalBusiness(businessId: string) {
  const business = businessesV2.find((candidate) => candidate.id === businessId);
  if (!business) throw new BOSRequestError("Business not found.", 404);
  if (!BUSINESS_UNIVERSES.includes(business.universe)) {
    throw new Error("Business catalogue is invalid.");
  }
  return business;
}

export function validateBOSRequest(value: unknown): BOSRequest {
  if (!isRecord(value)) fail("body", "must be an object");
  return {
    profile: validateProfile(value.profile),
    businessId: validateBusinessId(value.businessId),
  };
}

export function generateBOSForRequest(value: unknown): BOSResult {
  const request = validateBOSRequest(value);
  const business = canonicalBusiness(request.businessId);
  const matches = rankBusinesses(request.profile, businessesV2);
  const match = matches.find((candidate) => candidate.business_id === business.id);
  if (!match) throw new BOSRequestError("The selected business could not be matched.", 404);
  return generateDeterministicBOS({ profile: request.profile, business, match });
}
