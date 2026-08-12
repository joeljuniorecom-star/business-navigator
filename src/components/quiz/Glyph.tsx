interface GlyphProps {
  code: string;
  className?: string;
}

/** Renders a cognitive-test figure from a compact code like "tri:3". */
export function Glyph({ code, className }: GlyphProps) {
  if (code === "?") {
    return (
      <div className={`flex items-center justify-center text-2xl font-semibold text-primary ${className ?? ""}`}>?</div>
    );
  }
  const [shape, countStr] = code.split(":");
  const count = Number(countStr ?? 1);

  return (
    <div className={`flex flex-wrap items-center justify-center gap-1 ${className ?? ""}`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden>
          {shape === "cir" && <circle cx="12" cy="12" r="8" className="fill-primary/80" />}
          {shape === "sq" && <rect x="4" y="4" width="16" height="16" rx="2" className="fill-accent/80" />}
          {shape === "tri" && <polygon points="12,3 21,20 3,20" className="fill-gold/85" />}
        </svg>
      ))}
    </div>
  );
}
