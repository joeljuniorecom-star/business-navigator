import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Coins, Gauge, ShieldAlert, TrendingUp, Wrench } from "lucide-react";
import { toast } from "sonner";
import { ScoreRing } from "@/components/site/ScoreRing";
import { SubScoreBars } from "@/components/site/SubScoreBars";
import { getBusiness, businesses } from "@/data/businesses";
import type { Business } from "@/data/types";
import { hydrateAnswers, useAnswers } from "@/lib/quiz-store";
import { scoreAll } from "@/lib/scoring";

export const Route = createFileRoute("/business/$businessId")({
  loader: ({ params }) => {
    const business = getBusiness(params.businessId);
    if (!business) throw notFound();
    return { business };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Business introuvable — Business Fit" }, { name: "robots", content: "noindex" }] };
    }
    const { business } = loaderData;
    const description = `${business.tagline}. Capital ${business.capital}, premiers revenus en ${business.timeToFirstEuro}.`;
    return {
      meta: [
        { title: `${business.name} — Business Fit` },
        { name: "description", content: description },
        { property: "og:title", content: `${business.name} — Business Fit` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: BusinessPage,
});

function BusinessPage() {
  const { business } = Route.useLoaderData() as { business: Business };
  const answers = useAnswers();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateAnswers();
    setReady(true);
  }, []);

  const result = useMemo(
    () => scoreAll(answers, businesses).find((r) => r.business.id === business.id),
    [answers, business.id],
  );
  const hasAnswers = ready && Object.keys(answers).length > 0;

  return (
    <main className="min-h-screen bg-hero pb-32">
      <div className="mx-auto max-w-4xl px-6 pt-8">
        <Link to="/resultats" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour aux résultats
        </Link>
      </div>

      <header className="mx-auto max-w-4xl px-6 pt-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface text-3xl">
            {business.emoji}
          </div>
          <div className="flex-1">
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
              {business.category}
            </span>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{business.name}</h1>
            <p className="mt-1 text-muted-foreground">{business.tagline}</p>
          </div>
          {hasAnswers && result && <ScoreRing value={result.score} size={104} label="compatibilité" />}
        </div>
      </header>

      <section className="mx-auto mt-10 max-w-4xl px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={Coins} label="Capital recommandé" value={business.capital} />
          <Metric icon={Clock} label="Premier euro" value={business.timeToFirstEuro} />
          <Metric icon={TrendingUp} label="Potentiel" value={business.potential} />
          <Metric icon={Gauge} label="Difficulté" value={`${business.difficulty}/5`} />
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-4xl gap-6 px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Panel title="Le modèle">
            <p className="text-sm leading-relaxed text-muted-foreground">{business.description}</p>
          </Panel>

          {hasAnswers && result && (
            <Panel title="Pourquoi cela correspond à ton profil">
              <ul className="space-y-2">
                {result.reasons.map((r) => (
                  <li key={r} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {r}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <SubScoreBars sub={result.sub} />
              </div>
            </Panel>
          )}

          <Panel title="Journée type">
            <div className="space-y-4">
              {business.day.map((d) => (
                <div key={d.time} className="flex gap-4">
                  <span className="w-14 shrink-0 font-display text-sm text-primary">{d.time}</span>
                  <span className="text-sm text-muted-foreground">{d.task}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Compétences nécessaires" icon={Wrench}>
            <div className="flex flex-wrap gap-2">
              {business.skills.map((s) => (
                <span key={s} className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs">
                  {s}
                </span>
              ))}
            </div>
          </Panel>

          <Panel title="Risques" icon={ShieldAlert}>
            <ul className="space-y-2">
              {business.risks.map((r) => (
                <li key={r} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive/80" />
                  {r}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Scalabilité">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 flex-1 rounded-full ${i < business.scalability ? "bg-[image:var(--gradient-primary)]" : "bg-muted"}`}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {business.scalability >= 4
                ? "Le revenu peut croître sans que ton temps augmente proportionnellement."
                : "La croissance demande davantage de temps ou d'équipe."}
            </p>
          </Panel>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{business.name}</p>
            <p className="text-xs text-muted-foreground">Passe de l'idée à un plan d'action</p>
          </div>
          <button
            type="button"
            onClick={() => toast("Bientôt disponible", { description: "Le générateur de plan arrive très vite." })}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 font-medium text-primary-foreground shadow-elegant transition-transform hover:scale-[1.02] sm:w-auto"
          >
            Construire mon plan <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Coins; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon?: typeof Coins; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-surface/80 p-6 shadow-card backdrop-blur">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        {title}
      </h2>
      {children}
    </section>
  );
}
