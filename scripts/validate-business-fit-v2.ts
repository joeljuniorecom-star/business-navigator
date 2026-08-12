import { readFileSync } from "node:fs";
import { businessesV2, BUSINESS_COUNTS } from "../src/data/v2/catalog";

const fail = (message: string): never => { throw new Error(`Business Fit V2 validation failed: ${message}`); };
const assert = (condition: unknown, message: string) => { if (!condition) fail(message); };
const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));

assert(BUSINESS_COUNTS.total === 120, `expected 120 businesses, got ${BUSINESS_COUNTS.total}`);
assert(BUSINESS_COUNTS.ecommerce === 30, `expected 30 ecommerce models, got ${BUSINESS_COUNTS.ecommerce}`);
assert(BUSINESS_COUNTS.agency_services === 30, `expected 30 agency/service models, got ${BUSINESS_COUNTS.agency_services}`);
assert(BUSINESS_COUNTS.software === 25, `expected 25 software models, got ${BUSINESS_COUNTS.software}`);
assert(BUSINESS_COUNTS.information === 25, `expected 25 information models, got ${BUSINESS_COUNTS.information}`);
assert(BUSINESS_COUNTS.physical === 10, `expected 10 physical models, got ${BUSINESS_COUNTS.physical}`);

const ids = businessesV2.map((b) => b.id);
assert(new Set(ids).size === ids.length, "business IDs must be unique");

const scoreFingerprint = (b: (typeof businessesV2)[number]) => JSON.stringify({
  economics: b.economics,
  demands: b.demands,
  workstyle: b.workstyle,
  riasec: b.riasec_target,
  bigFive: b.big_five_target,
  cognition: b.cognition_relevance,
});
const fingerprints = businessesV2.map(scoreFingerprint);
assert(new Set(fingerprints).size === fingerprints.length, "two businesses have identical complete scoring fingerprints");

for (const b of businessesV2) {
  for (const [groupName, group] of Object.entries({ demands: b.demands, workstyle: b.workstyle, riasec: b.riasec_target, bigFive: b.big_five_target, cognition: b.cognition_relevance })) {
    for (const [key, value] of Object.entries(group)) {
      assert(Number.isFinite(value) && value >= 0 && value <= 100, `${b.id}.${groupName}.${key} must be in 0..100`);
    }
  }
  assert(b.economics.budget_min_eur >= 0, `${b.id} budget minimum must be >= 0`);
  assert(b.economics.budget_ideal_eur >= b.economics.budget_min_eur, `${b.id} ideal budget must be >= minimum`);
  assert(b.economics.hours_per_week_min > 0, `${b.id} weekly hours must be positive`);
  assert(b.economics.first_revenue_weeks_typical > 0, `${b.id} first-revenue time must be positive`);
}

const core = readJson("src/data/v2/questions-core.json");
const bigFive = readJson("src/data/v2/questions-big-five.json");
const riasec = readJson("src/data/v2/questions-riasec.json");
const reasoning = readJson("src/data/v2/questions-reasoning.json");
const allQuestions = [...core, ...bigFive, ...riasec, ...reasoning];

assert(allQuestions.length === 79, `expected 79 V2 items, got ${allQuestions.length}`);
const questionIds = allQuestions.map((q: any) => q.id);
assert(new Set(questionIds).size === questionIds.length, "question IDs must be unique");
assert(allQuestions.every((q: any) => q.type !== "text" && q.type !== "textarea"), "free-text questions are forbidden");
assert(allQuestions.every((q: any) => !/opérationnel n°|placeholder|à compléter/i.test(q.text ?? "")), "placeholder questions detected");

const bfFactors = ["openness", "conscientiousness", "extraversion", "agreeableness", "emotional_stability"];
for (const factor of bfFactors) {
  const items = bigFive.filter((q: any) => q.scoring?.factor === factor);
  assert(items.length === 4, `Big Five factor ${factor} needs exactly 4 items`);
  assert(items.some((q: any) => q.scoring?.key === 1), `Big Five factor ${factor} needs positive-keyed items`);
  assert(items.some((q: any) => q.scoring?.key === -1), `Big Five factor ${factor} needs reverse-keyed items`);
}

const riasecFactors = ["realistic", "investigative", "artistic", "social", "enterprising", "conventional"];
for (const factor of riasecFactors) {
  assert(riasec.filter((q: any) => q.scoring?.factor === factor).length === 3, `RIASEC factor ${factor} needs exactly 3 items`);
}

const reasoningDimensions = ["logical", "numerical", "pattern", "abstract"];
for (const dimension of reasoningDimensions) {
  const items = reasoning.filter((q: any) => q.scoring?.dimension === dimension);
  assert(items.length === 3, `reasoning dimension ${dimension} needs exactly 3 items`);
  assert(items.every((q: any) => q.options.some((o: any) => o.id === q.scoring.answer_id)), `reasoning dimension ${dimension} has an invalid answer_id`);
}

const config = readJson("src/data/v2/scoring-config.json");
const weightSum = Object.values(config.weights).reduce((sum: number, value: any) => sum + Number(value), 0);
assert(Math.abs(weightSum - 1) < 1e-9, `scoring weights must sum to 1, got ${weightSum}`);

console.log(`✓ ${BUSINESS_COUNTS.total} differentiated business models`);
console.log(`✓ ${allQuestions.length} closed-choice items`);
console.log("✓ Big Five: 5 factors × 4 balanced items");
console.log("✓ RIASEC: 6 factors × 3 items");
console.log("✓ Reasoning: 4 dimensions × 3 items");
console.log("✓ No identical complete scoring fingerprints");
console.log("✓ V2 dataset validation passed");
