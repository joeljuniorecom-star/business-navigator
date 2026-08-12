interface ScaleInputProps {
  value?: number;
  labels: [string, string];
  onChange: (v: number) => void;
}

export function ScaleInput({ value, labels, onChange }: ScaleInputProps) {
  const steps = [1, 2, 3, 4, 5];
  return (
    <div>
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {steps.map((s) => {
          const active = value === s;
          const size = s === 3 ? "h-10 w-10 sm:h-12 sm:w-12" : s === 1 || s === 5 ? "h-14 w-14 sm:h-16 sm:w-16" : "h-12 w-12 sm:h-14 sm:w-14";
          return (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              aria-label={`Niveau ${s}`}
              aria-pressed={active}
              className={`${size} rounded-full border transition-all duration-300 ${
                active
                  ? "border-primary bg-primary/20 shadow-elegant scale-105"
                  : "border-border-strong bg-surface hover:border-primary/50 hover:bg-surface-2"
              }`}
            >
              <span className={`block text-sm font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
    </div>
  );
}
