import { Check } from "lucide-react";
import { modules } from "@/data/questions";

interface ModuleProgressProps {
  currentModuleId: string;
  progress: number;
}

export function ModuleProgress({ currentModuleId, progress }: ModuleProgressProps) {
  const currentIndex = modules.findIndex((m) => m.id === currentModuleId);

  return (
    <div className="w-full">
      <div className="hidden flex-wrap items-center gap-x-5 gap-y-2 md:flex">
        {modules.map((m, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={m.id} className="flex items-center gap-2 text-sm">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-colors ${
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : active
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={3} /> : active ? "●" : i + 1}
              </span>
              <span className={done ? "text-muted-foreground" : active ? "font-medium text-foreground" : "text-muted-foreground/60"}>
                {m.short}
              </span>
            </div>
          );
        })}
        <div className="flex items-center gap-2 text-sm text-muted-foreground/60">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-[10px]">★</span>
          Résultats
        </div>
      </div>

      <div className="flex items-center justify-between md:hidden">
        <span className="text-sm font-medium">{modules[currentIndex]?.label}</span>
        <span className="text-xs text-muted-foreground">
          Module {currentIndex + 1}/{modules.length}
        </span>
      </div>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[image:var(--gradient-primary)] transition-all duration-500"
          style={{ width: `${Math.max(2, progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
