import { Link, useRouterState } from "@tanstack/react-router";
import { Coffee, Home } from "lucide-react";
import { useCafe, formatHour } from "@/lib/cafe-store";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { view, setView, currentHour, isOpen, useRealClock } = useCafe();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const studentLinks = [
    { to: "/", label: "Home" },
    { to: "/real-time", label: "Real-Time" },
    { to: "/find-seating", label: "Find Seating" },
    { to: "/forecast", label: "Forecast" },
    { to: "/sentiment", label: "Sentiment" },
  ];
  const employeeLinks = [
    { to: "/employee", label: "Dashboard" },
    { to: "/employee/raw-data", label: "Raw Data" },
    { to: "/employee/verify", label: "Verify" },
  ];
  const links = view === "student" ? studentLinks : employeeLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-espresso">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-espresso text-cream">
            <Coffee className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Lift Coffee Roasters</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Seating Management</div>
          </div>
        </Link>

        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto sm:order-2 sm:w-auto sm:flex-1 sm:justify-center">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-espresso text-cream"
                    : "text-espresso/70 hover:bg-latte/40 hover:text-espresso",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="order-2 ml-auto flex items-center gap-3 sm:order-3">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs md:flex">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isOpen ? "bg-accent" : "bg-destructive",
              )}
            />
            <span className="font-medium text-espresso">
              {isOpen ? "Open" : "Closed"} · {formatHour(currentHour)}
            </span>
            {!useRealClock && <span className="text-muted-foreground">(demo)</span>}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5">
            <span
              className={cn(
                "text-xs font-medium transition-colors",
                view === "student" ? "text-espresso" : "text-muted-foreground",
              )}
            >
              Student
            </span>
            <Switch
              checked={view === "employee"}
              onCheckedChange={(c) => setView(c ? "employee" : "student")}
              aria-label="Toggle view"
            />
            <span
              className={cn(
                "text-xs font-medium transition-colors",
                view === "employee" ? "text-espresso" : "text-muted-foreground",
              )}
            >
              Employee
            </span>
          </div>
          <Link
            to="/"
            className="hidden h-9 w-9 place-items-center rounded-full border border-border bg-background/80 text-espresso hover:bg-latte/40 md:grid"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
