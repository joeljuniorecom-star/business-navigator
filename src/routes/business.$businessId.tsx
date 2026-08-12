import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Coins, Gauge, ShieldAlert, TrendingUp, Wrench, Layers, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ScoreRing } from "@/components/site/ScoreRing";
import { SubScoreBars } from "@/components/site/SubScoreBars";
import { businessesV2 } from "@/data/v2/catalog";
import { matchBusiness } from "@/data/v2/matching-engine";
import { buildUserProfileV2 } from "@/data/v2/questionnaire-scoring";
import type { BusinessUniverse, BusinessV2 } from "@/data/v2/business-schema";
import { hydrateAnswers, useAnswers } from "@/lib/quiz-store";

export const Route = createFileRoute("/business/$businessId")({
  loader: ({ params }) => {
    const business = businessesV2.find((b) => b.id === params.businessId);
    if (!business) throw notFound();
    return { business };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Business introuvable — Business Fit V2" }, { name: "robots", content: "noindex" }] };
    }
    const { business } = loaderData;
    const description = `${business.description}. Capital minimum ${business.economics.budget_min_eur} €, premier revenu estimé à ~${business.economics.first_revenue_weeks_typical} semaines.`;
    return {
      meta: [
        { title: `${business.name} — Business Fit V2` },
        { name: "description", content: description },
        { property: "og:title", content: `${business.name} — Business Fit V2` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: BusinessPage,
});

const UNIVERSE_LABELS: Record<BusinessUniverse, { label: string; emoji: string }> = {
  ecommerce: { label: "E-commerce", emoji: "🛒" },
  agency_services: { label: "Agence & Services", emoji: "🤝" },
  software: { label: "Software & SaaS", emoji: "💻" },
  information: { label: "Information & Contenu", emoji: "📚" },
  physical: { label: "Business Physique", emoji: "🏬" },
};

function formatLevel(val: number) {
  if (val >= 80) return "Très élevé";
  if (val >= 60) return "Élevé";
  if (val >= 40) return "Modéré";
  if (val >= 20) return "Accessible";
  return "Faible";
}

function BusinessPage() {
  const { business } = Route.useLoaderData() as { business: BusinessV2 };
  const answers = useAnswers();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateAnswers();
    setReady(true);
  }, []);

  const profile = useMemo(() => buildUserProfileV2(answers), [answers]);
  const match = useMemo(() => matchBusiness(profile, business), [profile, business]);
  const hasAnswers = ready && Object.keys(answers).length > 0;

  const uInfo = UNIVERSE_LABELS[business.universe] ?? { label: business.universe, emoji: "💡" };

  const handleBuildPlan = () => {
    // Boundary payload prepared for BOS server-side integration
    const payload = {
      profileV2: profile,
      selectedBusiness: business,
      matchResult: match,
    };
    console.log("Boundary BOS ready with payload:", payload);
    toast("Préparation du plan BOS", {
      description: `Transmission du profil V2 et du modèle ${business.name} au générateur.`,
    });
  };

  return (
    <main className="min-h-screen bg-hero pb-32">
      <div className="mx-auto max-w-4xl px-6 pt-8">
        <Link to="/resultats" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour aux résultats
        </Link>
      </div>

      <header className="mx-auto max-w-4xl px-6 pt-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface text-3xl shrink-0">
            {uInfo.emoji}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs text-muted-foreground">
                {uInfo.label}
              </span>
              <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-muted-foreground">
                Famille : {business.family}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{business.name}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{business.description}</p>
          </div>
          {hasAnswers && <ScoreRing value={match.score} size={104} label="Business Fit" />}
        </div>
      </header>

      {/* Metrics Bar */}
      <section className="mx-auto mt-8 max-w-4xl px-6">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Metric icon={Coins} label="Capital minimum" value={`${business.economics.budget_min_eur.toLocaleString("fr-FR")} €`} hint={`Idéal : ${business.economics.budget_ideal_eur.toLocaleString("fr-FR")} €`} />
          <Metric icon={Clock} label="Temps minimum" value={`${business.economics.hours_per_week_min} h/semaine`} hint="Engagement de départ" />
          <Metric icon={Sparkles} label="Premier revenu" value={`~${business.economics.first_revenue_weeks_typical} semaines`} hint="Délai moyen constaté" />
          <Metric icon={Gauge} label="Difficulté globale" value={`${business.economics.difficulty}/100`} hint={formatLevel(business.economics.difficulty)} />
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-4xl gap-6 px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Panel title="Caractéristiques économiques & Modèle">
            <div className="grid grid-cols-3 gap-3 mb-4 rounded-2xl border border-border bg-surface/50 p-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400" /> Risque
                </div>
                <div className="text-base font-semibold">{business.economics.risk}/100</div>
                <div className="text-[10px] text-muted-foreground">{formatLevel(business.economics.risk)}</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" /> Scalabilité
                </div>
                <div className="text-base font-semibold">{business.economics.scalability}/100</div>
                <div className="text-[10px] text-muted-foreground">{formatLevel(business.economics.scalability)}</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                  <Coins className="h-3.5 w-3.5 text-emerald-400" /> Potentiel
                </div>
                <div className="text-base font-semibold">{business.economics.financial_upside}/100</div>
                <div className="text-[10px] text-muted-foreground">{formatLevel(business.economics.financial_upside)}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{business.notes || business.description}</p>
          </Panel>

          {hasAnswers && (
            <Panel title="Analyse de ton Business Fit V2">
              {match.strengths.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="h-4 w-4" /> Points forts du match
                  </h3>
                  <ul className="space-y-1.5">
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
                <div className="mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="h-4 w-4" /> Points d'attention & vigilance
                  </h3>
                  <ul className="space-y-1.5">
                    {match.attention.map((a) => (
                      <li key={a} className="flex gap-2 text-xs text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Décomposition des 8 dimensions</h4>
              <SubScoreBars breakdown={match.breakdown} />
            </Panel>
          )}
        </div>

        <div className="space-y-6">
          <Panel title="Compétences nécessaires" icon={Wrench}>
            <div className="flex flex-wrap gap-2">
              {business.skills_core.map((s) => (
                <span key={s} className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium">
                  {s}
                </span>
              ))}
            </div>
          </Panel>

          {business.hard_requirements && business.hard_requirements.length > 0 && (
            <Panel title="Prérequis & Exigences" icon={Layers}>
              <ul className="space-y-2">
                {business.hard_requirements.map((req) => (
                  <li key={req} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {req}
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel title="Tags & Catégories">
            <div className="flex flex-wrap gap-1.5">
              {business.tags.map((t) => (
                <span key={t} className="rounded-lg border border-border/60 bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
                  #{t}
                </span>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      {/* Floating CTA */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 backdrop-blur z-20">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{business.name}</p>
            <p className="text-xs text-muted-foreground">Construis le plan d'action personnalisé pour ce modèle</p>
          </div>
          <button
            type="button"
            onClick={handleBuildPlan}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-8 py-3.5 font-medium text-primary-foreground shadow-elegant transition-transform hover:scale-[1.02] sm:w-auto"
          >
            Construire mon plan <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value, hint }: { icon: typeof Coins; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2.5 text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>}
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
