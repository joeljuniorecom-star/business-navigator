import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { hydrateAnswers } from "@/lib/quiz-store";

export const Route = createFileRoute("/analyse")({
  head: () => ({
    meta: [
      { title: "Analyse de ton profil — Business Fit" },
      { name: "description", content: "Comparaison de ton profil avec 120 modèles de business pour calculer ton Business Fit." },
      { property: "og:title", content: "Analyse de ton profil — Business Fit" },
      { property: "og:description", content: "Comparaison de ton profil avec 120 modèles de business." },
    ],
  }),
  component: AnalysePage,
});

const STEPS = [
  "Analyse de ton profil",
  "Comparaison avec 120 modèles de business",
  "Prise en compte de tes contraintes",
  "Recherche de tes avantages naturels",
  "Calcul de ton Business Fit",
];

function AnalysePage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    hydrateAnswers();
  }, []);

  useEffect(() => {
    if (index >= STEPS.length) {
      const t = setTimeout(() => navigate({ to: "/resultats" }), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), 900);
    return () => clearTimeout(t);
  }, [index, navigate]);

  const progress = Math.min(100, (index / STEPS.length) * 100);

  return (
    <main className="flex min-h-screen items-center justify-center bg-hero px-6">
      <div className="w-full max-w-md">
        <div className="relative mx-auto mb-12 h-28 w-28">
          <span className="absolute inset-0 rounded-full border border-primary/40 animate-pulse-ring" />
          <span className="absolute inset-0 rounded-full border border-primary/30 animate-pulse-ring [animation-delay:0.7s]" />
          <div className="absolute inset-3 flex items-center justify-center rounded-full border border-border bg-surface">
            <span className="font-display text-2xl font-semibold text-gradient">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="space-y-3">
          {STEPS.map((s, i) => {
            const done = i < index;
            const active = i === index;
            return (
              <div
                key={s}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-500 ${
                  active
                    ? "border-primary/50 bg-primary/5"
                    : done
                      ? "border-border bg-surface"
                      : "border-transparent opacity-35"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center">
                  {done ? (
                    <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  )}
                </span>
                <span className={`text-sm ${active ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
