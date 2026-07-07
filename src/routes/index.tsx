import { createFileRoute, Link } from "@tanstack/react-router";
import { useCafe } from "@/lib/cafe-store";
import { Activity, Filter, LineChart, Sparkles, ArrowRight, Coffee, ClipboardList, Shield } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { view, state, currentHour, isOpen } = useCafe();
  const available = state.seats.filter((s) => s.status === "Available").length;
  const total = state.seats.length;

  const studentCards = [
    { to: "/real-time", title: "Real-Time Status", desc: "Live map of every seat in the cafe.", icon: Activity },
    { to: "/find-seating", title: "Find Seating by Need", desc: "Filter by Wi-Fi, outlets or table size.", icon: Filter },
    { to: "/forecast", title: "Predictive Forecasting", desc: "Popular times, hour-by-hour predictions.", icon: LineChart },
    { to: "/sentiment", title: "AI Sentiment Analysis", desc: "What customers are saying, in real time.", icon: Sparkles },
  ];
  const employeeCards = [
    { to: "/employee", title: "Status Dashboard", desc: "Manage seats and log hourly headcounts.", icon: Coffee },
    { to: "/employee/raw-data", title: "Raw Data Feed", desc: "Timestamped log of staff updates.", icon: ClipboardList },
    { to: "/employee/verify", title: "Verify / Cleanse", desc: "Two-step confirmation before submit.", icon: Shield },
  ];
  const cards = view === "student" ? studentCards : employeeCards;

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-cream via-background to-latte/30 p-8 sm:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-espresso">
              <span className={`h-2 w-2 rounded-full ${isOpen ? "bg-accent" : "bg-destructive"}`} />
              {isOpen ? "Open now" : "Closed"} · {available}/{total} seats available
            </div>
            <h1 className="mt-4 font-display text-4xl leading-tight text-espresso sm:text-6xl">
              A calmer way to find your <span className="italic text-copper">study seat.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              {view === "student"
                ? "See what's open, reserve a spot with a 10-minute hold, and check in when you arrive."
                : "Manage the floor, log hourly counts, and keep your seating data clean."}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-background/70 p-4 md:min-w-[280px]">
            <Stat label="Available" value={`${available}`} accent="text-accent" />
            <Stat label="Occupancy" value={`${Math.round(((total - available) / total) * 100)}%`} />
            <Stat label="Hour" value={`${currentHour > 12 ? currentHour - 12 : currentHour || 12}${currentHour >= 12 ? "P" : "A"}`} />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold text-espresso">
            {view === "student" ? "Explore the cafe" : "Manage the floor"}
          </h2>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">{view} view</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-espresso/40 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-latte/50 text-espresso group-hover:bg-espresso group-hover:text-cream">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="font-display text-lg font-semibold text-espresso">{c.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              <ArrowRight className="absolute right-6 top-6 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-espresso" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <div className={`font-display text-2xl font-semibold ${accent ?? "text-espresso"}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
