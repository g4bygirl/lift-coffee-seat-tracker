import { Coffee, User, Wrench } from "lucide-react";
import { useCafe, formatHour } from "@/lib/cafe-store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { view, setView, currentHour, isOpen, useRealClock, setUseRealClock, mockHour, setMockHour } = useCafe();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 text-espresso">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-espresso text-cream">
            <Coffee className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Lift Coffee Roasters</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Seating Management System</div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs md:flex">
            <span className={cn("h-2 w-2 rounded-full", isOpen ? "bg-accent" : "bg-destructive")} />
            <span className="font-medium text-espresso">
              {isOpen ? "Open" : "Closed"} · {formatHour(currentHour)}
            </span>
            <button
              type="button"
              onClick={() => setUseRealClock(!useRealClock)}
              className="ml-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-espresso"
              title="Toggle real clock"
            >
              {useRealClock ? "real" : "demo"}
            </button>
            {!useRealClock && (
              <input
                type="range"
                min={0}
                max={23}
                value={mockHour}
                onChange={(e) => setMockHour(Number(e.target.value))}
                className="ml-1 h-1 w-24 accent-espresso"
                aria-label="Simulated hour"
              />
            )}
          </div>

          <div className="flex items-center gap-1 rounded-full border border-border bg-background/80 p-1">
            <button
              type="button"
              onClick={() => setView("student")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                view === "student" ? "bg-espresso text-cream" : "text-espresso/70 hover:bg-latte/40",
              )}
            >
              <User className="h-3.5 w-3.5" /> Customer Portal
            </button>
            <button
              type="button"
              onClick={() => setView("employee")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                view === "employee" ? "bg-espresso text-cream" : "text-espresso/70 hover:bg-latte/40",
              )}
            >
              <Wrench className="h-3.5 w-3.5" /> Employee Dashboard
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
