import { useState } from "react";
import { SeatMap } from "@/components/SeatMap";
import { StatRow } from "@/components/StatRow";
import { ForecastPanel } from "@/components/ForecastPanel";
import { SentimentStrip } from "@/components/SentimentStrip";
import { useCafe, type FeatureTag } from "@/lib/cafe-store";
import { Wifi, Zap, Users, Filter, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS: { label: FeatureTag; icon: any }[] = [
  { label: "Reliable Wi-Fi", icon: Wifi },
  { label: "Nearby Outlets", icon: Zap },
  { label: "Large Table Size", icon: Users },
];

export function CustomerPortal() {
  const { isOpen } = useCafe();
  const [active, setActive] = useState<FeatureTag | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">Customer Portal</h1>
        <p className="text-muted-foreground">Live map of every seat — filter by what your session needs.</p>
      </div>

      <StatRow />

      <section className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center gap-2">
          <Filter className="h-5 w-5 text-copper" />
          <h2 className="font-display text-lg font-semibold text-espresso">Filter Seating by Workspace Needs</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = active === f.label;
            return (
              <button
                key={f.label}
                onClick={() => setActive(on ? null : f.label)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors",
                  on
                    ? "border-espresso bg-espresso text-cream"
                    : "border-border bg-background text-espresso hover:bg-latte/40",
                )}
              >
                <f.icon className="h-4 w-4" />
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-espresso">
              <MapPin className="h-5 w-5 text-copper" /> Interactive Cafe Layout Map
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time seat status — {isOpen ? "tap a table to explore." : "reservations resume at 7 AM."}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Live Feed
          </span>
        </div>
        <SeatMap highlightFeature={active} />
      </section>

      <ForecastPanel />
      <SentimentStrip />
    </div>
  );
}
