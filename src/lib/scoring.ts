import { questions } from "@/data/questions";
import { businesses } from "@/data/businesses";
import type { Answers, Business, BusinessResult, Question, TraitKey, Traits } from "@/data/types";

/**
 * Local scoring engine. Pure function: replace this file (or point it at a
 * server function) without touching any UI component.
 */

const TRAIT_KEYS: TraitKey[] = [
  "tech", "creative", "social", "sales", "analytic", "ops", "patience", "risk",
  "capital", "time", "autonomy", "structure", "writing", "video", "b2b", "b2c", "reasoning",
];

function add(target: Record<string, number>, traits: Traits | undefined, factor = 1) {
  if (!traits) return;
  for (const [k, v] of Object.entries(traits)) target[k] = (target[k] ?? 0) + (v ?? 0) * factor;
}

export interface Profile {
  traits: Record<TraitKey, number>;
  raw: Record<TraitKey, number>;
  capital: number;
  hoursPerWeek: number;
  reasoningScore: number;
  reasoningLabel: string;
}

export function buildProfile(answers: Answers): Profile {
  const raw: Record<string, number> = {};
  let cognitiveTotal = 0;
  let cognitiveOk = 0;

  for (const q of questions) {
    const value = answers[q.id];
    if (value === undefined) continue;

    if (q.answerId) {
      cognitiveTotal += 1;
      if (value === q.answerId) {
        cognitiveOk += 1;
        add(raw, q.traits, 1);
      }
      continue;
    }

    if (q.type === "scale" && typeof value === "number") {
      add(raw, q.traits, (value - 3) / 2);
    } else if (q.type === "slider" && typeof value === "number") {
      const min = q.sliderMin ?? 0;
      const max = q.sliderMax ?? 100;
      add(raw, q.traits, (value - min) / Math.max(1, max - min));
    } else {
      const ids = Array.isArray(value) ? value : [value as string];
      for (const id of ids) add(raw, q.options?.find((o) => o.id === id)?.traits, 1);
    }
  }

  const maxAbs = Math.max(1, ...TRAIT_KEYS.map((k) => Math.abs(raw[k] ?? 0)));
  const traits = Object.fromEntries(
    TRAIT_KEYS.map((k) => [k, (raw[k] ?? 0) / maxAbs]),
  ) as Record<TraitKey, number>;

  const reasoningScore = cognitiveTotal ? Math.round((cognitiveOk / cognitiveTotal) * 100) : 0;
  const reasoningLabel =
    reasoningScore >= 85 ? "Analytique abstrait"
      : reasoningScore >= 65 ? "Logique structuré"
        : reasoningScore >= 40 ? "Pragmatique concret"
          : "Intuitif";

  return {
    traits,
    raw: raw as Record<TraitKey, number>,
    capital: Number(answers["adv_capital"] ?? 0),
    hoursPerWeek: Number(answers["adv_temps"] ?? 0),
    reasoningScore,
    reasoningLabel,
  };
}

function cosine(profile: Record<TraitKey, number>, target: Traits) {
  let dot = 0, na = 0, nb = 0;
  for (const k of TRAIT_KEYS) {
    const a = profile[k] ?? 0;
    const b = target[k] ?? 0;
    dot += a * b;
    na += a * a;
    nb += b * b;
  }
  if (!na || !nb) return 0;
  return dot / Math.sqrt(na * nb);
}

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

function subScores(profile: Profile, b: Business) {
  const t = profile.traits;
  const affinity = cosine(t, b.traits);

  const budget = b.capitalMin === 0 ? 96 : clamp(45 + (Math.min(profile.capital / b.capitalMin, 2) * 27));
  const skillKeys: TraitKey[] = ["tech", "creative", "writing", "video", "sales", "analytic", "ops"];
  const skillMatch =
    skillKeys.reduce((acc, k) => acc + Math.max(0, t[k]) * (b.traits[k] ?? 0), 0) /
    Math.max(1, skillKeys.reduce((acc, k) => acc + (b.traits[k] ?? 0), 0));
  const styleKeys: TraitKey[] = ["autonomy", "structure", "social", "patience", "risk", "b2b", "b2c"];
  const styleMatch =
    styleKeys.reduce((acc, k) => acc + Math.max(0, t[k]) * (b.traits[k] ?? 0), 0) /
    Math.max(1, styleKeys.reduce((acc, k) => acc + (b.traits[k] ?? 0), 0));

  const timeFit = Math.min(1, profile.hoursPerWeek / (b.difficulty * 8));
  const potentiel = clamp(50 + b.scalability * 7 + timeFit * 12);

  return {
    profil: clamp(50 + affinity * 50),
    budget,
    competences: clamp(48 + skillMatch * 130),
    potentiel,
    style: clamp(48 + styleMatch * 130),
  };
}

function buildReasons(profile: Profile, b: Business, sub: ReturnType<typeof subScores>): string[] {
  const reasons: string[] = [];
  const t = profile.traits;
  const top = (Object.keys(b.traits) as TraitKey[])
    .filter((k) => (b.traits[k] ?? 0) >= 2 && t[k] > 0.3)
    .slice(0, 2);

  const label: Partial<Record<TraitKey, string>> = {
    tech: "ton aisance technique",
    creative: "ta créativité",
    social: "ton énergie relationnelle",
    sales: "ton goût pour la vente",
    analytic: "ton esprit analytique",
    ops: "ton sens de l'organisation",
    patience: "ta patience",
    risk: "ta tolérance au risque",
    writing: "ta plume",
    video: "ton aisance face caméra",
    autonomy: "ton autonomie",
    structure: "ton besoin de cadre",
    b2b: "ton orientation B2B",
    b2c: "ton orientation grand public",
    reasoning: "ton profil de raisonnement",
  };

  for (const k of top) reasons.push(`Ce modèle exploite directement ${label[k] ?? "ton profil"}.`);
  if (sub.budget >= 80) reasons.push(`Ton capital disponible couvre largement le ticket d'entrée (${b.capital}).`);
  else if (sub.budget >= 60) reasons.push(`Le ticket d'entrée (${b.capital}) reste atteignable pour toi.`);
  if (profile.hoursPerWeek >= b.difficulty * 6) reasons.push(`Tes ${profile.hoursPerWeek} h/semaine suffisent pour tenir le rythme demandé.`);
  if (profile.reasoningScore >= 65 && (b.traits.reasoning ?? 0) >= 2)
    reasons.push("Ton profil de raisonnement est un avantage réel sur ce type de problèmes.");
  reasons.push(...b.why.slice(0, Math.max(0, 4 - reasons.length)));
  return reasons.slice(0, 4);
}

export function scoreAll(answers: Answers, catalogue: Business[] = businesses): BusinessResult[] {
  const profile = buildProfile(answers);
  return catalogue
    .map((business) => {
      const sub = subScores(profile, business);
      const score = clamp(
        sub.profil * 0.34 + sub.competences * 0.22 + sub.style * 0.2 + sub.budget * 0.14 + sub.potentiel * 0.1,
        40,
        97,
      );
      return { business, score, sub, reasons: buildReasons(profile, business, sub) };
    })
    .sort((a, b) => b.score - a.score);
}

export function isAnswered(q: Question, answers: Answers) {
  const v = answers[q.id];
  if (v === undefined) return false;
  if (Array.isArray(v)) return v.length >= (q.min ?? 1);
  return true;
}
