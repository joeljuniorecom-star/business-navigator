interface ScaleInputProps {
  value?: number | undefined;
  labels?: [string, string] | undefined;
  stepOptions?: { id: string; label: string; value?: number }[] | undefined;
  onChange: (v: number) => void;
}

export function ScaleInput({ value, labels, stepOptions, onChange }: ScaleInputProps) {
  const steps = stepOptions && stepOptions.length > 0
    ? stepOptions.map((o) => ({ value: o.value ?? Number(o.id), label: o.label }))
    : [
        { value: 1, label: labels?.[0] ?? "Pas du tout" },
        { value: 2, label: "" },
        { value: 3, label: "Neutre" },
        { value: 4, label: "" },
        { value: 5, label: labels?.[1] ?? "Tout à fait" },
      ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
        {steps.map((s, i) => {
          const active = value === s.value;
          return (
            <button
              key={s.value ?? i}
              type="button"
              onClick={() => onChange(s.value)}
              aria-label={s.label || `Niveau ${s.value}`}
              aria-pressed={active}
              className={`flex flex-col items-center justify-center rounded-2xl border p-2 text-center transition-all duration-300 min-h-[58px] sm:min-h-[68px] ${
                active
                  ? "border-primary bg-primary/15 font-semibold text-primary shadow-elegant scale-[1.02]"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-2 text-muted-foreground"
              }`}
            >
              <span className="text-xs sm:text-sm font-semibold">{s.value}</span>
              {s.label && <span className="text-[10px] sm:text-xs opacity-80 leading-tight mt-0.5 line-clamp-2">{s.label}</span>}
            </button>
          );
        })}
      </div>
      {labels && !stepOptions && (
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      )}
    </div>
  );
}
