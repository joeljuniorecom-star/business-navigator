import { useState } from "react";
import { Search } from "lucide-react";

interface CountrySelectProps {
  value?: string | undefined;
  onChange: (code: string) => void;
}

const COUNTRIES = [
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "BE", name: "Belgique", flag: "🇧🇪" },
  { code: "CH", name: "Suisse", flag: "🇨🇭" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "MA", name: "Maroc", flag: "🇲🇦" },
  { code: "SN", name: "Sénégal", flag: "🇸🇳" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "DZ", name: "Algérie", flag: "🇩🇿" },
  { code: "TN", name: "Tunisie", flag: "🇹🇳" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "GB", name: "Royaume-Uni", flag: "🇬🇧" },
  { code: "US", name: "États-Unis", flag: "🇺🇸" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪" },
  { code: "ES", name: "Espagne", flag: "🇪🇸" },
  { code: "IT", name: "Italie", flag: "🇮🇹" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "OTHER", name: "Autre pays", flag: "🌍" },
];

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  const [query, setQuery] = useState("");

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher ton pays..."
          className="w-full rounded-2xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 max-h-72 overflow-y-auto pr-1">
        {filtered.map((c) => {
          const active = value === c.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onChange(c.code)}
              aria-pressed={active}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all duration-200 ${
                active
                  ? "border-primary bg-primary/10 font-medium text-foreground shadow-sm"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-2 text-muted-foreground"
              }`}
            >
              <span className="text-lg">{c.flag}</span>
              <span className="text-xs truncate">{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
