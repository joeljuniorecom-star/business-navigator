import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Brain, ChevronDown, Info, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ScoreRing } from "@/components/site/ScoreRing";
import { SubScoreBars } from "@/components/site/SubScoreBars";
import { hydrateAnswers, quizStore, useAnswers } from "@/lib/quiz-store";
import { buildUserProfileV2 } from "@/data/v2/questionnaire-scoring";
import { rankBusinesses } from "@/data/v2/matching-engine";
import { businessesV2 } from "@/data/v2/catalog";
import type { BusinessUniverse } from "@/data/v2/business-schema";

export const Route = createFileRoute("/resultats")({
  head: () => ({
    meta: [
      { title: "Tes 3 business les plus compatibles — Business Fit V2" },
      { name: "description", content: "Ton top 3 de modèles de business sur 120 analysés, avec calcul de compatibilité déterministe V2." },
      { property: "og:title", content: "Tes 3 business les plus compatibles — Business Fit V2" },
      { property: "og:description", content: "Ton top 3 de modèles d'affaires V2 avec scores détaillés." },
    ],
  }),
  component: ResultsPage,
});

const UNIVERSE_LABELS: Record<BusinessUniverse, { label: string; emoji: string }> = {
  ecommerce: { label: "E-commerce", emoji: "🛒" },
  agency_services: { label: "Agence & Services", emoji: "🤝" },
  software: { label: "Software & SaaS", emoji: "💻" },
  information: { label: "Information & Contenu", emoji: "📚" },
  physical: { label: "Business Physique", emoji: "🏬" },
};

function ResultsPage() {
  const answers = useAnswers();
  const [ready, setReady] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    hydrateAnswers();
    setReady(true);
  }, []);

  const profile = useMemo(() => buildUserProfileV2(answers), [answers]);
  const rankedMatches = useMemo(() => rankBusinesses(profile, businessesV2), [profile]);
  const hasAnswers = Object.keys(answers).length > 0;

  if (!ready) return <main className="min-h-screen bg-hero" />;

  if (!hasAnswers) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-hero px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Aucun résultat pour l'instant</h1>
          <p className="mt-2 text-sm text-muted-foreground">Passe le test V2 pour découvrir tes business compatibles.</p>
          <Link
            to="/test"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-elegant"
          >
            Faire le test V2 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  const top3Matches = rankedMatches.slice(0, 3);
  const otherMatches = rankedMatches.slice(3);

  const reasoningSummary = `Logique ${profile.reasoning.logical}% · Numérique ${profile.reasoning.numerical}% · Pattern ${profile.reasoning.pattern}% · Abstrait ${profile.reasoning.abstract}%`;

  return (
    <main className="min-h-screen bg-hero pb-24">
      <header className="mx-auto max-w-4xl px-6 pb-8 pt-12 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-primary font-medium">Moteur Business Fit V2 · 120 Modèles</p>
        <h1 className="animate-in-up mt-3 text-3xl font-semibold sm:text-5xl">Tes 3 meilleures compatibilités</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-2xl mx-auto">
          Calculées déterministiquement à partir de tes contraintes d'investissements, compétences, style de travail et ambitions.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-2 text-xs sm:text-sm">
            <Brain className="h-4 w-4 text-primary" />
            Raisonnement · <span className="font-medium text-foreground">{reasoningSummary}</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 text-primary shrink-0" />
            Business Fit = compatibilité profil/modèle (pas une probabilité de réussite).
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl space-y-6 px-6">
        {top3Matches.map((match, i) => {
          const biz = businessesV2.find((b) => b.id === match.business_id)!;
          const uInfo = UNIVERSE_LABELS[biz.universe] ?? { label: biz.universe, emoji: "💡" };

          return (
            <article
              key={biz.id}
              className="animate-in-up rounded-3xl border border-border bg-surface/80 p-6 shadow-card backdrop-blur transition-colors hover:border-border-strong sm:p-8"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <ScoreRing value={match.score} size={i === 0 ? 108 : 88} label="Business Fit" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-display text-sm font-semibold ${i === 0 ? "text-gold" : "text-muted-foreground"}`}
                    >
                      #{i + 1}
                    </span>
                    <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs text-muted-foreground">
                      {uInfo.emoji} {uInfo.label}
                    </span>
                    <span className="text-xs text-muted-foreground">Famille : {biz.family}</span>
                  </div>

                  <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                    {biz.name}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{biz.description}</p>

                  <div className="mt-4 flex flex-wrap gap-4 rounded-xl border border-border/50 bg-background/50 p-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Capital min :</span>{" "}
                      <span className="font-semibold text-foreground">{biz.economics.budget_min_eur.toLocaleString("fr-FR")} €</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Temps min :</span>{" "}
                      <span className="font-semibold text-foreground">{biz.economics.hours_per_week_min} h/semaine</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Premier revenu :</span>{" "}
                      <span className="font-semibold text-foreground">~{biz.economics.first_revenue_weeks_typical} semaines</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Subscores de compatibilité</h4>
                    <SubScoreBars breakdown={match.breakdown} />
                  </div>

                  {match.strengths.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Points forts du match
                      </h3>
                      <ul className="mt-2 space-y-1.5">
                        {match.strengths.map((s) => (
                          <li key={s} className="flex gap-2 text-xs text-muted-foreground">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {match.attention.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" /> Points de vigilance
                      </h3>
                      <ul className="mt-2 space-y-1.5">
                        {match.attention.map((a) => (
                          <li key={a} className="flex gap-2 text-xs text-muted-foreground">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link
                    to="/business/$businessId"
                    params={{ businessId: biz.id }}
                    className="group mt-6 inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2"
                  >
                    Explorer ce business
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mx-auto mt-10 max-w-4xl px-6">
        <button
          type="button"
          onClick={() => setShowMore((s) => !s)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {showMore ? "Masquer les autres business" : `Voir les ${otherMatches.length} autres modèles classés`}
          <ChevronDown className={`h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
        </button>

        {showMore && (
          <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {otherMatches.map((match, i) => {
              const biz = businessesV2.find((b) => b.id === match.business_id)!;
              const uInfo = UNIVERSE_LABELS[biz.universe] ?? { label: biz.universe, emoji: "💡" };

              return (
                <Link
                  key={biz.id}
                  to="/business/$businessId"
                  params={{ businessId: biz.id }}
                  className="animate-in-up flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-3.5 transition-colors hover:border-border-strong hover:bg-surface-2 text-xs sm:text-sm"
                >
                  <span className="w-8 shrink-0 text-muted-foreground font-mono text-xs">#{i + 4}</span>
                  <span className="text-base">{uInfo.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">{biz.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{uInfo.label} · {biz.economics.budget_min_eur}€ min · {biz.economics.hours_per_week_min}h/sem</span>
                  </span>
                  <span className="font-display font-semibold text-primary">{match.score}%</span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => quizStore.reset()}
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Recommencer le test V2
          </button>
        </div>
      </section>
    </main>
  );
}
