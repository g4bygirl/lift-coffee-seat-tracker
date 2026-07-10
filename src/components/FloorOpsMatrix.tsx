import { useCafe, type Seat, type SeatStatus } from "@/lib/cafe-store";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Wifi, Zap, Users, Circle, X, Clock, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const STATUS_OPTS: { s: SeatStatus; icon: any; tone: string }[] = [
  { s: "Available", icon: Circle, tone: "text-accent" },
  { s: "Occupied", icon: X, tone: "text-destructive" },
  { s: "Reserved", icon: Clock, tone: "text-yellow-600" },
  { s: "Out of Order", icon: Wrench, tone: "text-muted-foreground" },
];

function seatColor(s: Seat) {
  if (s.status === "Occupied") return "bg-destructive text-destructive-foreground border-destructive";
  if (s.status === "Reserved") return "bg-yellow-400/90 text-espresso border-yellow-500";
  if (s.status === "Out of Order") return "bg-muted text-muted-foreground border-border";
  return "bg-accent/30 text-espresso border-accent/60 hover:bg-accent/50";
}

function useCountdown(startedAt?: number) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!startedAt) return;
    const id = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, [startedAt]);
  if (!startedAt) return null;
  const remaining = Math.max(0, 10 * 60 * 1000 - (Date.now() - startedAt));
  const m = Math.floor(remaining / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function SeatControl({ seat }: { seat: Seat }) {
  const { dispatch } = useCafe();
  const countdown = useCountdown(seat.status === "Reserved" ? seat.reservationTimestamp : undefined);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative flex h-14 w-14 flex-col items-center justify-center rounded-xl border-2 text-[10px] font-semibold shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95",
            seatColor(seat),
          )}
          title={`${seat.id} · ${seat.status}`}
        >
          {seat.status === "Occupied" && <X className="h-6 w-6" strokeWidth={3} />}
          {seat.status === "Out of Order" && <Wrench className="h-5 w-5" />}
          {seat.status === "Reserved" && countdown && <span className="text-[11px]">{countdown}</span>}
          {seat.status === "Available" && <span className="opacity-70">{seat.id.split("-")[1]}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3">
        <div className="mb-2 text-xs">
          <div className="font-mono font-semibold text-espresso">{seat.id}</div>
          <div className="text-muted-foreground">Current: {seat.status}</div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {STATUS_OPTS.map((o) => (
            <Button
              key={o.s}
              size="sm"
              variant={seat.status === o.s ? "default" : "outline"}
              className="h-8 justify-start px-2 text-[11px]"
              onClick={() => {
                dispatch({ type: "SET_STATUS", id: seat.id, status: o.s });
                toast.success(`${seat.id} → ${o.s}`);
              }}
            >
              <o.icon className={cn("mr-1.5 h-3.5 w-3.5", seat.status === o.s ? "" : o.tone)} />
              {o.s}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function FloorOpsMatrix() {
  const { state } = useCafe();
  const tables = [1, 2, 3, 4, 5];
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-espresso">Floor Operations Matrix</h2>
          <p className="text-sm text-muted-foreground">
            Tap any seat to override its status instantly.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-copper/40 bg-copper/10 px-3 py-1 text-[11px] font-medium text-copper">
          Staff Controls
        </span>
      </div>

      <div className="rounded-3xl border border-border bg-card/60 p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((tn) => {
            const seats = state.seats.filter((s) => s.tableNumber === tn);
            const features = seats[0]?.features ?? [];
            return (
              <div key={tn} className="relative rounded-2xl border border-border bg-background/40 p-4">
                <div className="mb-3">
                  <div className="font-display text-lg font-semibold text-espresso">Table {tn}</div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {features.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {f === "Reliable Wi-Fi" && <Wifi className="h-3 w-3" />}
                        {f === "Nearby Outlets" && <Zap className="h-3 w-3" />}
                        {f === "Large Table Size" && <Users className="h-3 w-3" />}
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative mx-auto mt-3 grid aspect-square max-w-[220px] grid-cols-3 grid-rows-3 place-items-center">
                  <div className="col-start-2 row-start-2 h-24 w-24 rounded-full border-2 border-copper/60 bg-latte/40" />
                  <div className="col-start-2 row-start-1">
                    <SeatControl seat={seats[0]} />
                  </div>
                  <div className="col-start-3 row-start-2">
                    <SeatControl seat={seats[1]} />
                  </div>
                  <div className="col-start-2 row-start-3">
                    <SeatControl seat={seats[2]} />
                  </div>
                  <div className="col-start-1 row-start-2">
                    <SeatControl seat={seats[3]} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <Legend color="bg-accent/40 border-accent" label="Available" />
          <Legend color="bg-yellow-400 border-yellow-500" label="Reserved" />
          <Legend color="bg-destructive border-destructive" label="Occupied" />
          <Legend color="bg-muted border-border" label="Out of Order" />
        </div>
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-4 w-4 rounded border-2", color)} />
      <span>{label}</span>
    </div>
  );
}
