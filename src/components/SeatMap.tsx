import { useCafe, type Seat } from "@/lib/cafe-store";
import { cn } from "@/lib/utils";
import { X, Wifi, Zap, Users, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  onSeatClick?: (seat: Seat) => void;
  highlightFeature?: string | null;
  interactiveWhenClosed?: boolean;
}

function seatColor(s: Seat, highlight?: boolean) {
  if (s.status === "Occupied") return "bg-destructive text-destructive-foreground border-destructive";
  if (s.status === "Reserved") return "bg-yellow-400/90 text-espresso border-yellow-500";
  if (s.status === "Out of Order") return "bg-muted text-muted-foreground border-border";
  if (highlight) return "bg-sage text-espresso border-sage";
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

function Seat({ seat, onClick, highlight }: { seat: Seat; onClick?: () => void; highlight?: boolean }) {
  const countdown = useCountdown(seat.status === "Reserved" ? seat.reservationTimestamp : undefined);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex h-14 w-14 flex-col items-center justify-center rounded-xl border-2 text-[10px] font-semibold shadow-sm transition-all",
        seatColor(seat, highlight),
        onClick ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-default",
      )}
      title={`${seat.id} · ${seat.status}`}
    >
      {seat.status === "Occupied" && <X className="h-6 w-6" strokeWidth={3} />}
      {seat.status === "Out of Order" && <Wrench className="h-5 w-5" />}
      {seat.status === "Reserved" && countdown && <span className="text-[11px]">{countdown}</span>}
      {seat.status === "Available" && <span className="opacity-70">{seat.id.split("-")[1]}</span>}
    </button>
  );
}

export function SeatMap({ onSeatClick, highlightFeature }: Props) {
  const { state } = useCafe();
  const tables = [1, 2, 3, 4, 5];
  return (
    <div className="rounded-3xl border border-border bg-card/60 p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((tn) => {
          const seats = state.seats.filter((s) => s.tableNumber === tn);
          const features = seats[0]?.features ?? [];
          const matches = highlightFeature ? features.includes(highlightFeature as any) : false;
          const allOccupied = seats.every((s) => s.status === "Occupied" || s.status === "Out of Order");
          return (
            <div
              key={tn}
              className={cn(
                "relative rounded-2xl border p-4 transition-colors",
                matches ? "border-sage bg-sage/10" : "border-border bg-background/40",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="font-display text-lg font-semibold text-espresso">Table {tn}</div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {features.map((f) => (
                      <span
                        key={f}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
                          highlightFeature === f
                            ? "border-sage bg-sage text-espresso"
                            : "border-border bg-background text-muted-foreground",
                        )}
                      >
                        {f === "Reliable Wi-Fi" && <Wifi className="h-3 w-3" />}
                        {f === "Nearby Outlets" && <Zap className="h-3 w-3" />}
                        {f === "Large Table Size" && <Users className="h-3 w-3" />}
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative mx-auto mt-3 grid aspect-square max-w-[220px] grid-cols-3 grid-rows-3 place-items-center">
                <div className="col-start-2 row-start-2 h-24 w-24 rounded-full border-2 border-copper/60 bg-latte/40" />
                <div className="col-start-2 row-start-1">
                  <Seat seat={seats[0]} onClick={onSeatClick ? () => onSeatClick(seats[0]) : undefined} highlight={matches} />
                </div>
                <div className="col-start-3 row-start-2">
                  <Seat seat={seats[1]} onClick={onSeatClick ? () => onSeatClick(seats[1]) : undefined} highlight={matches} />
                </div>
                <div className="col-start-2 row-start-3">
                  <Seat seat={seats[2]} onClick={onSeatClick ? () => onSeatClick(seats[2]) : undefined} highlight={matches} />
                </div>
                <div className="col-start-1 row-start-2">
                  <Seat seat={seats[3]} onClick={onSeatClick ? () => onSeatClick(seats[3]) : undefined} highlight={matches} />
                </div>
              </div>
              {highlightFeature && !matches && (
                <div className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-center text-xs font-medium text-destructive">
                  Unavailable — does not match "{highlightFeature}"
                </div>
              )}
              {highlightFeature && matches && allOccupied && (
                <div className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-center text-xs font-medium text-destructive">
                  Unavailable — all seats occupied
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
        <Legend color="bg-accent/40 border-accent" label="Available" />
        <Legend color="bg-yellow-400 border-yellow-500" label="Reserved (10-min hold)" />
        <Legend color="bg-destructive border-destructive" label="Occupied" />
        <Legend color="bg-muted border-border" label="Out of Order" />
      </div>
    </div>
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
