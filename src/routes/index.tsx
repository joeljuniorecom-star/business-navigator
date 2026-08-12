import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Brain, Coins, Compass, Heart, Layers, Sparkles, Target, Timer,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Business Fit — Quel business est fait pour toi ?" },
      {
        name: "description",
        content:
          "Test interactif de 5 minutes : découvre les modèles de business les plus compatibles avec ta personnalité, tes compétences, ton budget et tes ambitions.",
      },
      { property: "og:title", content: "Business Fit — Quel business est fait pour toi ?" },
      {
        property: "og:description",
        content: "Découvre les modèles de business les plus compatibles avec ton profil, tes compétences et tes ambitions.",
      },
    ],
  }),
  component: Landing,
});

const criteria = [
  { icon: Heart, label: "Personnalité" },
  { icon: Layers, label: "Compétences" },
  { icon: Coins, label: "Capital" },
  { icon: Target, label: "Objectifs" },
  { icon: Compass, label: "Intérêts" },
  { icon: Brain, label: "Raisonnement" },
  { icon: Timer, label: "Style de travail" },
];

function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-hero">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-primary)] opacity-40" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-sm font-semibold tracking-tight">
          Business<span className="text-primary">Fit</span>
        </span>
        <span className="hidden text-xs text-muted-foreground sm:block">120 modèles de business analysés</span>
      </header>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-16 text-center sm:pt-24">
        <span className="animate-in-up inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Test de compatibilité · 5 minutes
        </span>

        <h1 className="animate-in-up mt-8 text-4xl font-semibold leading-[1.08] sm:text-6xl">
          Quel business est <span className="text-gradient">réellement</span> fait pour toi ?
        </h1>

        <p className="animate-in-up mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          Découvre les modèles de business les plus compatibles avec ton profil, tes compétences et tes ambitions.
        </p>

        <Link
          to="/test"
          className="animate-in-up group mt-10 inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-8 py-4 font-medium text-primary-foreground shadow-elegant transition-transform duration-300 hover:scale-[1.03]"
        >
          Faire le test
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <p className="mt-4 text-xs text-muted-foreground">Aucune inscription. Résultats immédiats.</p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <p className="text-center text-sm text-muted-foreground">L'analyse prend en compte</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {criteria.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors hover:border-border-strong"
            >
              <Icon className="h-4 w-4 text-primary" />
              {label}
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Business Fit · Analyse de compatibilité entrepreneuriale
      </footer>
    </main>
  );
}
