interface ScoreRingProps {
  value: number;
  size?: number;
  label?: string;
}

export function ScoreRing({ value, size = 96, label }: ScoreRingProps) {
  const stroke = size >= 90 ? 8 : 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-semibold leading-none" style={{ fontSize: size / 4 }}>
          {value}
          <span className="text-[0.5em] text-muted-foreground">%</span>
        </span>
        {label && <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}
