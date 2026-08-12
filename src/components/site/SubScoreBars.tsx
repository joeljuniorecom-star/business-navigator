import type { MatchBreakdownV2 } from "@/data/v2/profile-schema";

const LABELS_V2: Record<keyof MatchBreakdownV2, string> = {
  constraints: "Contraintes & Cadre",
  skills_and_learning: "Compétences",
  unfair_advantages: "Atouts & Réseau",
  workstyle_preferences: "Style de travail",
  goals: "Objectifs",
  riasec: "Intérêts pro",
  big_five: "Personnalité",
  reasoning: "Raisonnement",
};

export function SubScoreBars({ breakdown }: { breakdown: MatchBreakdownV2 }) {
  const keys = Object.keys(LABELS_V2) as (keyof MatchBreakdownV2)[];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {keys.map((k) => {
        const val = breakdown[k] ?? 50;
        return (
          <div key={k}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{LABELS_V2[k]}</span>
              <span className="font-medium">{val}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-[image:var(--gradient-primary)] transition-all duration-1000"
                style={{ width: `${Math.max(0, Math.min(100, val))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
