import type { Question } from "@/data/types";

interface SkillsMatrixProps {
  questions: Question[];
  answers: Record<string, any>;
  onChange: (id: string, value: number) => void;
}

const LEVEL_LABELS: Record<number, string> = {
  0: "Aucune",
  25: "Bases",
  50: "Correct",
  75: "Bon",
  100: "Expert",
};

const LEVELS = [0, 25, 50, 75, 100];

export function SkillsMatrix({ questions, answers, onChange }: SkillsMatrixProps) {
  return (
    <div className="space-y-4">
      {questions.map((q) => {
        const val = typeof answers[q.id] === "number" ? answers[q.id] : undefined;
        return (
          <div
            key={q.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="sm:max-w-xs">
              <h3 className="text-sm font-semibold">{q.title}</h3>
              {val !== undefined && (
                <span className="text-xs text-primary font-medium">
                  {LEVEL_LABELS[val] ?? `${val}%`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {LEVELS.map((lvl) => {
                const active = val === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onChange(q.id, lvl)}
                    aria-label={`${q.title} - ${LEVEL_LABELS[lvl]}`}
                    aria-pressed={active}
                    className={`flex flex-1 flex-col items-center justify-center rounded-xl border py-2 px-1.5 transition-all duration-200 sm:w-16 sm:flex-none ${
                      active
                        ? "border-primary bg-primary/15 text-primary shadow-sm font-medium"
                        : "border-border bg-background hover:border-border-strong hover:bg-surface-2 text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs font-semibold">{lvl}</span>
                    <span className="text-[10px] opacity-80 hidden sm:inline">{LEVEL_LABELS[lvl]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
