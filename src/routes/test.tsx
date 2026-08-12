import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { ModuleProgress } from "@/components/quiz/ModuleProgress";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { modules, screens } from "@/data/questions";
import type { AnswerValue } from "@/data/types";
import { isAnswered } from "@/lib/scoring";
import { hydrateAnswers, quizStore, useAnswers } from "@/lib/quiz-store";

export const Route = createFileRoute("/test")({
  head: () => ({
    meta: [
      { title: "Le test Business Fit — 5 minutes, zéro formulaire" },
      {
        name: "description",
        content: "Cartes, sliders, matrices : un test interactif pour cerner ton profil entrepreneurial en quelques minutes.",
      },
      { property: "og:title", content: "Le test Business Fit" },
      { property: "og:description", content: "Un test interactif pour cerner ton profil entrepreneurial en quelques minutes." },
    ],
  }),
  component: TestPage,
});

const AUTO_ADVANCE = new Set(["single", "grid", "matrix", "sequence", "scale"]);

function TestPage() {
  const navigate = useNavigate();
  const answers = useAnswers();
  const [step, setStep] = useState(-1);
  const [transition, setTransition] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    hydrateAnswers();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const screen = screens[step];
  const progress = (step + 1) / (screens.length + 1);
  const canContinue = !!screen && screen.questions.every((q) => isAnswered(q, answers));

  const goNext = () => {
    if (step + 1 >= screens.length) {
      navigate({ to: "/analyse" });
      return;
    }
    const next = screens[step + 1];
    if (screen && next.moduleId !== screen.moduleId) {
      setTransition(next.moduleId);
      setTimeout(() => {
        setTransition(null);
        setStep((s) => s + 1);
      }, 1100);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleChange = (id: string, value: AnswerValue, type: string, multi: boolean) => {
    quizStore.set(id, value);
    if (!multi && AUTO_ADVANCE.has(type) && screen?.questions.length === 1) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(goNext, 340);
    }
  };

  if (step === -1) return <Intro onStart={() => setStep(0)} />;
  if (transition) return <ModuleTransition moduleId={transition} />;
  if (!screen) return null;

  const currentModule = modules.find((m) => m.id === screen.moduleId);

  return (
    <main className="flex min-h-screen flex-col bg-hero">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <ModuleProgress currentModuleId={screen.moduleId} progress={progress} />
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-10">
        <p className="mb-6 text-xs uppercase tracking-[0.18em] text-primary">{currentModule?.label}</p>
        <div key={step} className="space-y-12">
          {screen.questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              value={answers[q.id]}
              compact={screen.questions.length > 1}
              onChange={(v) =>
                handleChange(q.id, v, q.type, q.type === "multi" || (q.type === "grid" && (q.max ?? 1) > 1))
              }
            />
          ))}
        </div>
      </section>

      <footer className="sticky bottom-0 border-t border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(-1, s - 1))}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-elegant transition-all duration-300 enabled:hover:scale-[1.03] disabled:opacity-30"
          >
            {step + 1 >= screens.length ? "Voir mon analyse" : "Continuer"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </main>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-hero px-6">
      <div className="animate-in-up w-full max-w-lg text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> 8 modules · environ 5 minutes
        </span>
        <h1 className="mt-8 text-3xl font-semibold sm:text-4xl">Avant de commencer</h1>
        <p className="mt-4 text-muted-foreground">
          Aucune bonne ou mauvaise réponse pour les modules de profil. Réponds vite et spontanément : les premières
          intuitions sont les plus fiables.
        </p>
        <div className="mt-8 grid gap-2 text-left">
          {modules.map((m, i) => (
            <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                {i + 1}
              </span>
              <span className="text-sm font-medium">{m.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">{m.intro}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onStart}
          className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-8 py-4 font-medium text-primary-foreground shadow-elegant transition-transform hover:scale-[1.02]"
        >
          Commencer <ArrowRight className="h-4 w-4" />
        </button>
        <Link to="/" className="mt-4 inline-block text-xs text-muted-foreground hover:text-foreground">
          Revenir à l'accueil
        </Link>
      </div>
    </main>
  );
}

function ModuleTransition({ moduleId }: { moduleId: string }) {
  const m = modules.find((x) => x.id === moduleId);
  const index = modules.findIndex((x) => x.id === moduleId);
  return (
    <main className="flex min-h-screen items-center justify-center bg-hero px-6">
      <div className="animate-in-up text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">Module {index + 1}</p>
        <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">{m?.label}</h2>
        <p className="mt-3 text-muted-foreground">{m?.intro}</p>
      </div>
    </main>
  );
}
