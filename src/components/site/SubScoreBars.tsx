import type { SubScores } from "@/data/types";

const LABELS: Record<keyof SubScores, string> = {
  profil: "Profil",
  budget: "Budget",
  competences: "Compétences",
  potentiel: "Potentiel",
  style: "Style de travail",
};

export function SubScoreBars({ sub }: { sub: SubScores }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(Object.keys(LABELS) as (keyof SubScores)[]).map((k) => (
        <div key={k}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{LABELS[k]}</span>
            <span className="font-medium">{sub[k]}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[image:var(--gradient-primary)] transition-all duration-1000"
              style={{ width: `${sub[k]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
