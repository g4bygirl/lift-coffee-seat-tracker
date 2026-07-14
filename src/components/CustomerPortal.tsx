import { useEffect, useRef, useState } from "react";
import { SeatMap } from "@/components/SeatMap";
import { StatRow } from "@/components/StatRow";
import { ForecastPanel } from "@/components/ForecastPanel";
import { SentimentStrip } from "@/components/SentimentStrip";
import { useCafe, type FeatureTag, type Seat } from "@/lib/cafe-store";
import { Wifi, Zap, Users, Filter, MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FILTERS: { label: FeatureTag; icon: any }[] = [
  { label: "Reliable Wi-Fi", icon: Wifi },
  { label: "Nearby Outlets", icon: Zap },
  { label: "Large Table Size", icon: Users },
];

const MAX_RESERVATIONS = 4;

export function CustomerPortal() {
  const { state, isOpen, dispatch } = useCafe();
  const [active, setActive] = useState<FeatureTag[]>([]);
  const [selected, setSelected] = useState<Seat | null>(null);
  // Seat IDs this customer currently holds, with the time they held them.
  const [myHolds, setMyHolds] = useState<Record<string, number>>({});
  const notifiedRef = useRef<Set<string>>(new Set());

  const holdCount = Object.keys(myHolds).length;

  // Watch for staff-initiated changes to seats this customer holds.
  useEffect(() => {
    const now = Date.now();
    const stillHeld: Record<string, number> = {};
    for (const [id, heldAt] of Object.entries(myHolds)) {
      const seat = state.seats.find((s) => s.id === id);
      if (!seat) continue;
      if (seat.status === "Reserved") {
        stillHeld[id] = heldAt;
        continue;
      }
      if (seat.status === "Occupied" && seat.claimed) {
        // Customer claimed the seat — silently drop from holds.
        continue;
      }
      if (notifiedRef.current.has(id)) continue;
      notifiedRef.current.add(id);
      const elapsed = now - heldAt;
      if (elapsed >= 10 * 60 * 1000 - 1500 && seat.status === "Available") {
        toast.info(`Your 10-minute hold on ${id} expired. Pick another seat when you're ready.`);
      } else if (seat.status === "Out of Order") {
        toast.error(`Staff marked ${id} out of order — your reservation was released. Please choose another seat.`);
      } else {
        toast.error(`Staff cancelled your reservation for ${id}. Please choose another seat.`);
      }
    }
    if (Object.keys(stillHeld).length !== Object.keys(myHolds).length) {
      setMyHolds(stillHeld);
    }
  }, [state.seats, myHolds]);

  const toggle = (f: FeatureTag) =>
    setActive((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const handleSeatClick = (seat: Seat) => {
    if (!isOpen) {
      toast.error("Cafe is closed — reservations resume at 7 AM.");
      return;
    }
    if (seat.status === "Out of Order") return;
    setSelected(seat);
  };

  const reserve = () => {
    if (!selected) return;
    if (holdCount >= MAX_RESERVATIONS) {
      toast.error(`You can only hold ${MAX_RESERVATIONS} seats at a time. Claim or cancel one first.`);
      setSelected(null);
      return;
    }
    dispatch({ type: "HOLD", id: selected.id });
    setMyHolds((prev) => ({ ...prev, [selected.id]: Date.now() }));
    notifiedRef.current.delete(selected.id);
    toast.success(`${selected.id} reserved for 10 minutes.`);
    setSelected(null);
  };
  const claim = () => {
    if (!selected) return;
    dispatch({ type: "CLAIM", id: selected.id });
    setMyHolds((prev) => {
      const { [selected.id]: _, ...rest } = prev;
      return rest;
    });
    toast.success(`Welcome! ${selected.id} is now yours.`);
    setSelected(null);
  };
  const cancel = () => {
    if (!selected) return;
    dispatch({ type: "CANCEL", id: selected.id });
    setMyHolds((prev) => {
      const { [selected.id]: _, ...rest } = prev;
      return rest;
    });
    notifiedRef.current.add(selected.id);
    toast.success(`${selected.id} reservation cancelled.`);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">Customer Portal</h1>
          <p className="text-muted-foreground">Live map of every seat — filter by what your session needs, tap a seat to reserve.</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
            holdCount >= MAX_RESERVATIONS
              ? "border-destructive/50 bg-destructive/10 text-destructive"
              : "border-border bg-background text-espresso",
          )}
        >
          Active holds: {holdCount} / {MAX_RESERVATIONS}
        </span>
      </div>

      <StatRow />

      <section className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center gap-2">
          <Filter className="h-5 w-5 text-copper" />
          <h2 className="font-display text-lg font-semibold text-espresso">Filter Seating by Workspace Needs</h2>
          <span className="ml-2 text-xs text-muted-foreground">Select any combination — tables must match all.</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = active.includes(f.label);
            return (
              <button
                key={f.label}
                onClick={() => toggle(f.label)}
                aria-pressed={on}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors",
                  on
                    ? "border-espresso bg-espresso text-cream"
                    : "border-border bg-background text-espresso hover:bg-latte/40",
                )}
              >
                {on ? <Check className="h-4 w-4" /> : <f.icon className="h-4 w-4" />}
                {f.label}
              </button>
            );
          })}
          {active.length > 0 && (
            <button
              onClick={() => setActive([])}
              className="ml-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-espresso"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-espresso">
              <MapPin className="h-5 w-5 text-copper" /> Interactive Cafe Layout Map
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time seat status — {isOpen ? "tap a seat to reserve for 10 minutes." : "reservations resume at 7 AM."}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Live Feed
          </span>
        </div>
        <SeatMap highlightFeatures={active} onSeatClick={handleSeatClick} />
      </section>

      <ForecastPanel />
      <SentimentStrip />

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Seat {selected.id}</DialogTitle>
                <DialogDescription>
                  {selected.status === "Available" &&
                    "Hold this seat for 10 minutes. Come check in when you arrive."}
                  {selected.status === "Reserved" &&
                    "This seat is on a 10-minute hold. Confirm you're here or cancel to release it."}
                  {selected.status === "Occupied" && "This seat is currently occupied."}
                  {selected.status === "Reserved" && selected.reservationTimestamp && (
                    <span className="mt-2 block text-espresso">
                      Time left: {Math.max(0, Math.ceil((10 * 60 * 1000 - (Date.now() - selected.reservationTimestamp)) / 60000))}{" "}
                      min
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-2">
                {selected.status === "Available" && (
                  <Button onClick={reserve} disabled={holdCount >= MAX_RESERVATIONS}>
                    {holdCount >= MAX_RESERVATIONS ? `Limit ${MAX_RESERVATIONS} reached` : "Reserve for 10 min"}
                  </Button>
                )}
                {selected.status === "Reserved" && !myHolds[selected.id] && (
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Held by another customer
                  </Button>
                )}
                {selected.status === "Reserved" && (
                  <>
                    <Button variant="outline" onClick={cancel}>
                      Cancel reservation
                    </Button>
                    <Button onClick={claim}>I'm here</Button>
                  </>
                )}
                {selected.status === "Occupied" && (
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
