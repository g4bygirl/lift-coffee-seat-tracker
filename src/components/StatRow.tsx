import { useCafe } from "@/lib/cafe-store";
import { Activity, Users2, Sparkles } from "lucide-react";
import { useMemo } from "react";

export function StatRow() {
  const { state } = useCafe();
  const total = state.capacity;
  const occupied = state.seats.filter((s) => s.status === "Occupied").length;
  const available = Math.max(0, total - occupied);
  const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const positive = useMemo(() => {
    if (!state.feedback.length) return 0;
    return Math.round(
      (state.feedback.filter((f) => f.sentiment === "Positive").length / state.feedback.length) * 100,
    );
  }, [state.feedback]);

  const cards = [
    { icon: Activity, label: "Live Availability", value: `${available} / ${total}`, tone: "text-accent" },
    { icon: Users2, label: "Occupancy Rate", value: `${rate}%`, tone: "text-copper" },
    { icon: Sparkles, label: "Customer Sentiment", value: `${positive}% Positive`, tone: "text-espresso" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-latte/50 text-espresso">
            <c.icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.label}</div>
            <div className={`font-display text-2xl font-semibold ${c.tone}`}>{c.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
