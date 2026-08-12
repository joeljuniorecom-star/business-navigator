import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, Clock3, Coins, Gauge, Target } from "lucide-react";
import type { BOSResult, BOSPhase, BOSRisk, BOSConstraint } from "@/data/v2/bos-schema";
import { readBOSResult } from "@/lib/bos-plan-store";

export const Route = createFileRoute("/business/$businessId/plan")({
  head: () => ({
    meta: [
      { title: "Ton plan d'exécution — Business Fit" },
      { name: "description", content: "Un plan d'exécution personnalisé, structuré par étapes et critères de validation." },
    ],
  }),
  component: BOSPlanPage,
});

function BOSPlanPage() {
  const { businessId } = Route.useParams();
  const [result, setResult] = useState<BOSResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setResult(readBOSResult());
    setReady(true);
  }, []);

  if (!ready) return <main className="min-h-screen bg-hero" />;

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-hero px-6 text-center">
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">Plan indisponible</p>
          <h1 className="mt-4 text-3xl font-semibold">Construis d'abord ton plan personnalisé</h1>
          <p className="mt-4 text-muted-foreground">Le résultat de ta génération n'est plus présent dans cette session.</p>
          <Link
            to="/resultats"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-elegant"
          >
            Retour aux résultats <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-hero pb-24">
      <header className="mx-auto max-w-5xl px-6 pb-10 pt-10">
        <Link to="/business/$businessId" params={{ businessId }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour au business
        </Link>
        <div className="mt-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">Business Operating System · V1</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">Ton plan pour {result.businessName}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{result.summary}</p>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <Panel title="Pourquoi ce business te correspond" icon={Target}>
            <ul className="space-y-3">
              {result.whyThisFits.map((reason) => (
                <li key={reason} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Positionnement">
            <p className="text-sm leading-relaxed text-foreground">{result.positioning.statement}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.positioning.differentiation.map((item) => (
                <span key={item} className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted-foreground">{item}</span>
              ))}
            </div>
          </Panel>

          <Panel title="À qui vendre">
            <p className="text-sm leading-relaxed text-muted-foreground">{result.idealCustomer.description}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <List title="Problèmes prioritaires" items={result.idealCustomer.problems} />
              <List title="Caractéristiques" items={result.idealCustomer.characteristics} />
            </div>
          </Panel>

          <Panel title="Offre à construire">
            <p className="text-sm font-medium">{result.offer.coreOffer}</p>
            <List title="Livrables" items={result.offer.deliverables} />
            {result.offer.priceRange && (
              <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <Coins className="h-4 w-4 text-primary" />
                Fourchette indicative : {result.offer.priceRange.min.toLocaleString("fr-FR")}–{result.offer.priceRange.max.toLocaleString("fr-FR")} {result.offer.priceRange.currency}
                {result.offer.priceRange.period === "month" ? " / mois" : result.offer.priceRange.period === "unit" ? " / unité" : result.offer.priceRange.period === "year" ? " / an" : ""}
              </div>
            )}
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Contraintes principales" icon={CircleAlert}>
            <div className="space-y-4">
              {result.mainConstraints.map((constraint) => <Constraint key={constraint.id} constraint={constraint} />)}
            </div>
          </Panel>

          <Panel title="Acquisition initiale">
            <div className="space-y-4">
              {result.acquisitionChannels.map((channel) => (
                <div key={channel.channel} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">{channel.channel}</p>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">P{channel.priority}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{channel.rationale}</p>
                  <p className="mt-2 text-xs font-medium">Premier geste : {channel.firstAction}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Monétisation">
            <p className="text-sm font-medium">{result.monetization.model}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.monetization.strategy}</p>
          </Panel>

          <Panel title="Risques à surveiller">
            <div className="space-y-4">
              {result.risks.map((risk) => <Risk key={risk.id} risk={risk} />)}
            </div>
          </Panel>
        </aside>
      </section>

      <section className="mx-auto mt-8 max-w-5xl space-y-6 px-6">
        <Panel title="Stratégie de lancement">
          <p className="text-sm leading-relaxed text-muted-foreground">{result.launchStrategy}</p>
        </Panel>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Exécution</p>
              <h2 className="mt-2 text-2xl font-semibold">Les étapes dans l'ordre</h2>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">Chaque phase possède son test de passage</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {result.executionPlan.map((phase, index) => <PhaseCard key={phase.id} phase={phase} index={index} />)}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Jalons">
            <div className="space-y-4">
              {result.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                  <span className="text-sm font-medium">{milestone.name}</span>
                  <span className="text-xs text-muted-foreground">{milestone.target}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Métriques de pilotage">
            <div className="space-y-4">
              {result.metrics.map((metric) => (
                <div key={metric.id}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <span className="text-sm text-primary">{metric.target}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{metric.reason}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Tes prochaines actions">
          <div className="grid gap-3 sm:grid-cols-2">
            {result.nextActions.map((action) => (
              <div key={action.id} className="rounded-2xl border border-border bg-surface-2 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{action.priority}</span>
                  <div>
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function PhaseCard({ phase, index }: { phase: BOSPhase; index: number }) {
  return (
    <article className="rounded-3xl border border-border bg-surface/80 p-6 shadow-card backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.18em] text-primary">Phase {index + 1}</span>
          <h3 className="mt-2 text-xl font-semibold">{phase.name}</h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {phase.estimatedDurationDays} jours</span>
          <span className="inline-flex items-center gap-1"><Coins className="h-3.5 w-3.5" /> {phase.estimatedBudget.toLocaleString("fr-FR")} €</span>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{phase.objective}</p>
      <div className="mt-5 space-y-3">
        {phase.tasks.map((task) => (
          <div key={task.id} className="rounded-2xl border border-border bg-surface-2 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{task.title}</p>
              <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{task.priority}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{task.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Critère de validation</p>
        <ul className="mt-2 space-y-1">
          {phase.validationCriteria.map((criterion) => <li key={criterion} className="text-sm text-foreground">{criterion}</li>)}
        </ul>
      </div>
    </article>
  );
}

function Constraint({ constraint }: { constraint: BOSConstraint }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{constraint.label}</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${constraint.severity === "high" ? "bg-destructive/10 text-destructive" : constraint.severity === "medium" ? "bg-gold/10 text-gold" : "bg-primary/10 text-primary"}`}>
          {constraint.severity}
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{constraint.explanation}</p>
    </div>
  );
}

function Risk({ risk }: { risk: BOSRisk }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-destructive/80" />
        <p className="text-sm font-medium">{risk.risk}</p>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Réponse : {risk.mitigation}</p>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => <li key={item} className="text-sm text-muted-foreground">{item}</li>)}
      </ul>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon?: typeof Target; children: React.ReactNode }) {
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
