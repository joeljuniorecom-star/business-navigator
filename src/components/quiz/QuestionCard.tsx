import { Glyph } from "./Glyph";
import { OptionCard } from "./OptionCard";
import { ScaleInput } from "./ScaleInput";
import { CountrySelect } from "./CountrySelect";
import { Slider } from "@/components/ui/slider";
import type { AnswerValue, Question } from "@/data/types";

interface QuestionCardProps {
  question: Question;
  value?: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  compact?: boolean | undefined;
}

export function QuestionCard({ question: q, value, onChange, compact }: QuestionCardProps) {
  const isMulti = q.type === "multi" || (q.type === "grid" && (q.max ?? 1) > 1);
  const selected = Array.isArray(value) ? value : [];

  const toggle = (id: string) => {
    if (!isMulti) return onChange(id);
    const has = selected.includes(id);
    if (has) return onChange(selected.filter((s) => s !== id));
    if (q.max && selected.length >= q.max) return onChange([...selected.slice(1), id]);
    onChange([...selected, id]);
  };

  const sliderValue = typeof value === "number" ? value : (q.sliderDefault ?? q.sliderMin ?? 0);

  const isScaleType = q.type === "scale" || q.type === "interest_scale" || q.type === "skill_scale";

  return (
    <div className="animate-in-up">
      <h2 className={compact ? "text-base font-semibold sm:text-lg" : "text-xl font-semibold sm:text-2xl"}>{q.title}</h2>
      {q.subtitle && <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{q.subtitle}</p>}

      <div className="mt-5">
        {q.type === "country_select" && (
          <CountrySelect
            value={typeof value === "string" ? value : undefined}
            onChange={(code) => onChange(code)}
          />
        )}

        {(q.type === "single" || q.type === "multi" || q.type === "range_choice") && (
          <div className="grid gap-3 sm:grid-cols-2">
            {q.options?.map((o) => (
              <OptionCard
                key={o.id}
                label={o.label}
                hint={o.hint}
                icon={o.icon}
                selected={isMulti ? selected.includes(o.id) : value === o.id}
                onClick={() => toggle(o.id)}
              />
            ))}
          </div>
        )}

        {q.type === "grid" && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {q.options?.map((o) => (
              <OptionCard
                key={o.id}
                label={o.label}
                hint={o.hint}
                icon={o.icon}
                layout="tile"
                selected={isMulti ? selected.includes(o.id) : value === o.id}
                onClick={() => toggle(o.id)}
              />
            ))}
          </div>
        )}

        {isScaleType && (
          <ScaleInput
            value={typeof value === "number" ? value : typeof value === "string" ? Number(value) : undefined}
            labels={q.scaleLabels}
            stepOptions={q.options}
            onChange={(v) => onChange(v)}
          />
        )}

        {q.type === "slider" && (
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-6 text-center">
              <span className="font-display text-4xl font-semibold text-gradient sm:text-5xl">
                {sliderValue.toLocaleString("fr-FR")}
              </span>
              <span className="ml-1 text-xl text-muted-foreground">{q.sliderUnit}</span>
            </div>
            <Slider
              value={[sliderValue]}
              min={q.sliderMin ?? 0}
              max={q.sliderMax ?? 100}
              step={q.sliderStep ?? 1}
              onValueChange={([v]) => onChange(v ?? 0)}
            />
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>{q.sliderMin?.toLocaleString("fr-FR")} {q.sliderUnit}</span>
              <span>{q.sliderMax?.toLocaleString("fr-FR")} {q.sliderUnit}+</span>
            </div>
          </div>
        )}

        {q.type === "matrix" && (
          <div className="flex flex-col items-center gap-8">
            {q.cells && q.cells.length > 0 && (
              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-surface p-3 sm:gap-3 sm:p-4">
                {q.cells.map((c, i) => (
                  <div
                    key={i}
                    className={`flex h-16 w-16 items-center justify-center rounded-xl sm:h-20 sm:w-20 ${
                      c === "?" ? "border border-dashed border-primary/60 bg-primary/5" : "bg-surface-2"
                    }`}
                  >
                    <Glyph code={c} />
                  </div>
                ))}
              </div>
            )}
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
              {q.options?.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onChange(o.id)}
                  aria-pressed={value === o.id}
                  className={`flex h-20 items-center justify-center rounded-2xl border transition-all duration-300 ${
                    value === o.id
                      ? "border-primary bg-primary/10 shadow-elegant font-medium"
                      : "border-border bg-surface hover:border-border-strong hover:bg-surface-2 text-muted-foreground"
                  }`}
                >
                  {o.label.includes(":") ? <Glyph code={o.label} /> : <span className="text-sm">{o.label}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {q.type === "sequence" && (
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {q.sequence?.map((s, i) => (
                <div
                  key={i}
                  className={`flex h-14 w-14 items-center justify-center rounded-xl font-display text-lg font-semibold sm:h-16 sm:w-16 sm:text-xl ${
                    s === "?" ? "border border-dashed border-primary/60 text-primary" : "bg-surface-2 text-foreground"
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
              {q.options?.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onChange(o.id)}
                  aria-pressed={value === o.id}
                  className={`h-16 rounded-2xl border font-display text-lg font-semibold transition-all duration-300 ${
                    value === o.id
                      ? "border-primary bg-primary/10 text-primary shadow-elegant"
                      : "border-border bg-surface hover:border-border-strong hover:bg-surface-2 text-muted-foreground"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isMulti && (
        <p className="mt-4 text-xs text-muted-foreground">
          {q.max
            ? `${selected.length}/${q.max} sélectionné${selected.length > 1 ? "s" : ""}`
            : `${selected.length} sélectionné${selected.length > 1 ? "s" : ""}`}
        </p>
      )}
    </div>
  );
}
