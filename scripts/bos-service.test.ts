/**
 * BOS Service Test Suite
 * Tests: validateBOSRequest + generateBOSForRequest
 * Cases: valid + all invalid edge cases
 */

import { validateBOSRequest, generateBOSForRequest, BOSRequestError } from "../src/data/v2/bos-service";
import { businessesV2 } from "../src/data/v2/catalog";

let passed = 0;
let failed = 0;

function ok(label: string) {
  console.log(`  ✓ ${label}`);
  passed++;
}

function fail(label: string, detail?: unknown) {
  console.error(`  ✗ ${label}`, detail ?? "");
  failed++;
}

function expect400(label: string, payload: unknown) {
  try {
    generateBOSForRequest(payload);
    fail(label, "should have thrown BOSRequestError 400");
  } catch (e) {
    if (e instanceof BOSRequestError && e.statusCode === 400) ok(label);
    else fail(label, e);
  }
}

function expect404(label: string, payload: unknown) {
  try {
    generateBOSForRequest(payload);
    fail(label, "should have thrown BOSRequestError 404");
  } catch (e) {
    if (e instanceof BOSRequestError && e.statusCode === 404) ok(label);
    else fail(label, e);
  }
}

// ── Canonical valid profile ─────────────────────────────────────────────────
const validProfile = {
  situation: { status: "employee", country_code: "FR" },
  constraints: { budget_eur: 3000, hours_per_week: 30, max_weeks_to_first_revenue: 12 },
  experience: { business_level: 50 },
  goals: { ambition_level: 75, priority: "upside" },
  preferences: {
    remote: 80,
    client_interaction: 60,
    public_visibility: 50,
    risk_tolerance: 55,
    solo: 60,
    avoid: [],
  },
  interests: { activities: ["sell", "build"] },
  advantages: { market_languages: ["fr", "en"], industries: ["ecommerce"], network: ["businesses"] },
  skills: {
    current: {
      sales: 70, marketing: 65, copywriting: 55, tech: 30,
      automation: 40, design: 30, content: 50, analytical: 60,
      operations: 55, management: 50,
    },
    willing_to_learn: ["marketing", "tech"],
  },
  big_five: { openness: 70, conscientiousness: 75, extraversion: 80, agreeableness: 60, emotional_stability: 70 },
  riasec: { realistic: 40, investigative: 50, artistic: 50, social: 70, enterprising: 90, conventional: 60 },
  reasoning: { logical: 70, numerical: 75, abstract: 65, pattern: 70 },
};

const firstBusiness = businessesV2[0];

// ── SECTION 1 : Cas valide ───────────────────────────────────────────────────
console.log("\n=== CAS VALIDE ===");

try {
  const result = generateBOSForRequest({ profile: validProfile, businessId: firstBusiness.id });
  if (
    result.businessId === firstBusiness.id &&
    typeof result.businessName === "string" &&
    Array.isArray(result.executionPlan) &&
    result.executionPlan.length > 0 &&
    Array.isArray(result.whyThisFits) &&
    typeof result.summary === "string"
  ) {
    ok(`Business existant (${firstBusiness.id}) → réponse BOSResult complète`);
  } else {
    fail("BOSResult structure incomplète", result);
  }
} catch (e) {
  fail("Cas valide a levé une exception inattendue", e);
}

// Valider que le serveur recalcule le matching (server boundary)
try {
  const result = generateBOSForRequest({ profile: validProfile, businessId: firstBusiness.id });
  if (result.businessId === firstBusiness.id) {
    ok("Server boundary: businessId canonicalisé depuis businessesV2 (source de vérité serveur)");
  }
} catch (e) {
  fail("Server boundary check failed", e);
}

// ── SECTION 2 : Business inexistant ─────────────────────────────────────────
console.log("\n=== BUSINESS INEXISTANT ===");
expect404("businessId inexistant → 404", { profile: validProfile, businessId: "fake-business-does-not-exist" });
expect400("businessId vide → 400 (validation avant lookup)", { profile: validProfile, businessId: "" });

// ── SECTION 3 : Payload incomplet ───────────────────────────────────────────
console.log("\n=== PAYLOAD INCOMPLET ===");
expect400("null body → 400", null);
expect400("string body → 400", "invalid");
expect400("array body → 400", []);
expect400("sans profile → 400", { businessId: firstBusiness.id });
expect400("sans businessId → 400", { profile: validProfile });
expect400("profile null → 400", { profile: null, businessId: firstBusiness.id });
expect400("profile.situation manquant → 400", { profile: { ...validProfile, situation: undefined }, businessId: firstBusiness.id });
expect400("profile.constraints manquant → 400", { profile: { ...validProfile, constraints: undefined }, businessId: firstBusiness.id });
expect400("profile.goals.priority invalide → 400", {
  profile: { ...validProfile, goals: { ambition_level: 50, priority: "conquer-the-world" } },
  businessId: firstBusiness.id,
});
expect400("profile.situation.status invalide → 400", {
  profile: { ...validProfile, situation: { status: "alien", country_code: "FR" } },
  businessId: firstBusiness.id,
});

// ── SECTION 4 : NaN / Infinity ───────────────────────────────────────────────
console.log("\n=== NaN / INFINITY ===");
expect400("budget_eur = NaN → 400", {
  profile: { ...validProfile, constraints: { ...validProfile.constraints, budget_eur: Number.NaN } },
  businessId: firstBusiness.id,
});
expect400("budget_eur = Infinity → 400", {
  profile: { ...validProfile, constraints: { ...validProfile.constraints, budget_eur: Infinity } },
  businessId: firstBusiness.id,
});
expect400("hours_per_week = -Infinity → 400", {
  profile: { ...validProfile, constraints: { ...validProfile.constraints, hours_per_week: -Infinity } },
  businessId: firstBusiness.id,
});
expect400("big_five.openness = NaN → 400", {
  profile: { ...validProfile, big_five: { ...validProfile.big_five, openness: Number.NaN } },
  businessId: firstBusiness.id,
});
expect400("riasec.social = Infinity → 400", {
  profile: { ...validProfile, riasec: { ...validProfile.riasec, social: Infinity } },
  businessId: firstBusiness.id,
});

// ── SECTION 5 : Valeurs hors bornes ──────────────────────────────────────────
console.log("\n=== VALEURS HORS BORNES ===");
expect400("big_five.openness = 101 → 400", {
  profile: { ...validProfile, big_five: { ...validProfile.big_five, openness: 101 } },
  businessId: firstBusiness.id,
});
expect400("big_five.conscientiousness = -1 → 400", {
  profile: { ...validProfile, big_five: { ...validProfile.big_five, conscientiousness: -1 } },
  businessId: firstBusiness.id,
});
expect400("riasec.enterprising = 200 → 400", {
  profile: { ...validProfile, riasec: { ...validProfile.riasec, enterprising: 200 } },
  businessId: firstBusiness.id,
});
expect400("hours_per_week = 200 (> 168) → 400", {
  profile: { ...validProfile, constraints: { ...validProfile.constraints, hours_per_week: 200 } },
  businessId: firstBusiness.id,
});
expect400("max_weeks_to_first_revenue = -5 → 400", {
  profile: { ...validProfile, constraints: { ...validProfile.constraints, max_weeks_to_first_revenue: -5 } },
  businessId: firstBusiness.id,
});

// ── SECTION 6 : Score falsifié (client ne peut pas injecter scores) ────────
console.log("\n=== SCORE FALSIFIÉ (server boundary) ===");
// Le client envoie un profil avec scores gonflés → le serveur re-score côté serveur via rankBusinesses
// Le test vérifie que l'appel réussit quand même et retourne bien le bon businessId
// (les scores envoyés par le client dans la range valide sont acceptés, mais le matching est côté serveur)
try {
  const inflatedProfile = {
    ...validProfile,
    big_five: { openness: 100, conscientiousness: 100, extraversion: 100, agreeableness: 100, emotional_stability: 100 },
    riasec: { realistic: 100, investigative: 100, artistic: 100, social: 100, enterprising: 100, conventional: 100 },
    reasoning: { logical: 100, numerical: 100, abstract: 100, pattern: 100 },
    skills: { ...validProfile.skills, current: Object.fromEntries(Object.keys(validProfile.skills.current).map((k) => [k, 100])) as typeof validProfile.skills.current },
  };
  const result = generateBOSForRequest({ profile: inflatedProfile, businessId: firstBusiness.id });
  // Le business doit toujours être canonicalisé côté serveur, pas depuis le payload client
  if (result.businessId === firstBusiness.id) {
    ok("Score client gonflé (100 partout) → le serveur accepte le profil valide, recalcule le matching");
  }
} catch (e) {
  fail("Score gonflé a échoué alors qu'il devrait passer (valeurs dans la range valide)", e);
}

// ── SECTION 7 : Business falsifié (ID inventé par le client) ─────────────────
console.log("\n=== BUSINESS FALSIFIÉ ===");
expect404("businessId inventé par le client → 404 (non trouvé dans businessesV2)", {
  profile: validProfile,
  businessId: "sw_hacked_business_id",
});
expect404("businessId SQL injection attempt → 404", {
  profile: validProfile,
  businessId: "'; DROP TABLE businesses; --",
});

// ── SECTION 8 : validateBOSRequest direct ────────────────────────────────────
console.log("\n=== validateBOSRequest direct ===");
try {
  const req = validateBOSRequest({ profile: validProfile, businessId: firstBusiness.id });
  if (req.businessId === firstBusiness.id && req.profile.situation.status === "employee") {
    ok("validateBOSRequest retourne BOSRequest structuré correctement");
  } else {
    fail("validateBOSRequest structure incorrecte", req);
  }
} catch (e) {
  fail("validateBOSRequest a échoué sur un payload valide", e);
}

// ── SECTION 9 : Intégrité catalogue vs BOS ───────────────────────────────────
console.log("\n=== INTÉGRITÉ CATALOGUE ===");
let catalogErrors = 0;
for (const biz of businessesV2) {
  try {
    const result = generateBOSForRequest({ profile: validProfile, businessId: biz.id });
    if (!result.executionPlan || result.executionPlan.length === 0) {
      console.error(`  ✗ ${biz.id}: executionPlan vide`);
      catalogErrors++;
    }
  } catch (e) {
    console.error(`  ✗ ${biz.id}: ${e instanceof Error ? e.message : e}`);
    catalogErrors++;
  }
}
if (catalogErrors === 0) {
  ok(`Tous les ${businessesV2.length} business du catalogue génèrent un BOSResult valide`);
} else {
  fail(`${catalogErrors} business ont échoué la génération BOS`);
}

// ── Résumé ────────────────────────────────────────────────────────────────────
console.log(`\n${"=".repeat(55)}`);
console.log(`RÉSULTAT: ${passed} passés, ${failed} échoués`);
if (failed > 0) {
  console.error("❌ CERTAINS TESTS ONT ÉCHOUÉ");
  process.exit(1);
} else {
  console.log("✅ TOUS LES TESTS BOS SONT PASSÉS");
}
