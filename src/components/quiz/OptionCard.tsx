import {
  Boxes, Briefcase, Building2, ChartNoAxesColumn, Code, Coins, Compass, Cpu, Globe,
  GraduationCap, Hammer, Handshake, Laptop, Megaphone, Package, Palette, PenLine,
  Rocket, Search, Sparkles, Target, Users, Video, Wallet, Zap, Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  briefcase: Briefcase, graduation: GraduationCap, laptop: Laptop, rocket: Rocket,
  compass: Compass, sparkles: Sparkles, cpu: Cpu, palette: Palette, megaphone: Megaphone,
  chart: ChartNoAxesColumn, video: Video, package: Package, users: Users, building: Building2,
  code: Code, zap: Zap, pen: PenLine, handshake: Handshake, target: Target, boxes: Boxes,
  hammer: Hammer, search: Search, coins: Coins, wallet: Wallet, globe: Globe,
};

interface OptionCardProps {
  label: string;
  hint?: string;
  icon?: string;
  selected: boolean;
  onClick: () => void;
  layout?: "row" | "tile";
  children?: React.ReactNode;
}

export function OptionCard({ label, hint, icon, selected, onClick, layout = "row", children }: OptionCardProps) {
  const Icon = icon ? ICONS[icon] : undefined;
  const base =
    "group relative w-full cursor-pointer rounded-2xl border text-left transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const tone = selected
    ? "border-primary/70 bg-primary/10 shadow-elegant"
    : "border-border bg-surface hover:border-border-strong hover:bg-surface-2";

  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className={`${base} ${tone}`}>
      <span
        className={`${layout === "tile" ? "flex flex-col items-start gap-3 p-5" : "flex items-center gap-4 p-4 sm:p-5"}`}
      >
        {Icon && (
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
              selected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block font-medium leading-snug">{label}</span>
          {hint && <span className="mt-0.5 block text-sm text-muted-foreground">{hint}</span>}
          {children}
        </span>
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
            selected ? "border-primary bg-primary text-primary-foreground" : "border-border-strong"
          } ${layout === "tile" ? "absolute right-4 top-4" : ""}`}
        >
          {selected && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
      </span>
    </button>
  );
}
