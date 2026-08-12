import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Brain, ChevronDown, RotateCcw } from "lucide-react";
import { ScoreRing } from "@/components/site/ScoreRing";
import { SubScoreBars } from "@/components/site/SubScoreBars";
import { hydrateAnswers, quizStore, useAnswers } from "@/lib/quiz-store";
import { buildProfile, scoreAll } from "@/lib/scoring";

export const Route = createFileRoute("/resultats")({
  head: () => ({
    meta: [
      { title: "Tes 3 business les plus compatibles — Business Fit" },
      { name: "description", content: "Ton top 3 de modèles de business, avec scores de compatibilité détaillés par profil, budget, compétences et style de travail." },
      { property: "og:title", content: "Tes 3 business les plus compatibles" },
      { property: "og:description", content: "Ton top 3 de modèles de business, avec scores détaillés." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const answers = useAnswers();
  const [ready, setReady] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    hydrateAnswers();
    setReady(true);
  }, []);

  const results = useMemo(() => scoreAll(answers), [answers]);
  const profile = useMemo(() => buildProfile(answers), [answers]);
  const hasAnswers = Object.keys(answers).length > 0;

  if (!ready) return <main className="min-h-screen bg-hero" />;

  if (!hasAnswers) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-hero px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Aucun résultat pour l'instant</h1>
          <p className="mt-2 text-muted-foreground">Passe le test pour découvrir tes business compatibles.</p>
          <Link
            to="/test"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-elegant"
          >
            Faire le test <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  const top3 = results.slice(0, 3);
  const others = results.slice(3);

  return (
    <main className="min-h-screen bg-hero pb-24">
      <header className="mx-auto max-w-4xl px-6 pb-10 pt-16 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">Ton Business Fit</p>
        <h1 className="animate-in-up mt-4 text-3xl font-semibold sm:text-5xl">Tes 3 meilleures compatibilités</h1>
        <p className="mt-4 text-muted-foreground">
          Calculées à partir de ton profil, tes contraintes et tes ambitions.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-2 text-sm">
          <Brain className="h-4 w-4 text-primary" />
          Profil de raisonnement · <span className="font-medium">{profile.reasoningLabel}</span>
        </div>
      </header>

      <section className="mx-auto max-w-4xl space-y-6 px-6">
        {top3.map((r, i) => (
          <article
            key={r.business.id}
            className="animate-in-up rounded-3xl border border-border bg-surface/80 p-6 shadow-card backdrop-blur transition-colors hover:border-border-strong sm:p-8"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <ScoreRing value={r.score} size={i === 0 ? 108 : 88} label="compatibilité" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span
                    className={`font-display text-sm font-semibold ${i === 0 ? "text-gold" : "text-muted-foreground"}`}
                  >
                    #{i + 1}
                  </span>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                    {r.business.category}
                  </span>
                </div>
                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  {r.business.emoji} {r.business.name}
                </h2>
                <p className="mt-1 text-muted-foreground">{r.business.tagline}</p>

                <div className="mt-6">
                  <SubScoreBars sub={r.sub} />
                </div>

                <h3 className="mt-6 text-sm font-semibold">Pourquoi ce business te correspond</h3>
                <ul className="mt-3 space-y-2">
                  {r.reasons.map((reason) => (
                    <li key={reason} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {reason}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/business/$businessId"
                  params={{ businessId: r.business.id }}
                  className="group mt-6 inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2"
                >
                  Explorer ce business
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-10 max-w-4xl px-6">
        <button
          type="button"
          onClick={() => setShowMore((s) => !s)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {showMore ? "Masquer" : "Voir les autres résultats"}
          <ChevronDown className={`h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
        </button>

        {showMore && (
          <div className="mt-4 space-y-2">
            {others.map((r, i) => (
              <Link
                key={r.business.id}
                to="/business/$businessId"
                params={{ businessId: r.business.id }}
                className="animate-in-up flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-border-strong hover:bg-surface-2"
              >
                <span className="w-6 text-xs text-muted-foreground">#{i + 4}</span>
                <span className="text-lg">{r.business.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{r.business.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{r.business.tagline}</span>
                </span>
                <span className="font-display text-sm font-semibold">{r.score}%</span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => quizStore.reset()}
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Recommencer le test
          </button>
        </div>
      </section>
    </main>
  );
}
