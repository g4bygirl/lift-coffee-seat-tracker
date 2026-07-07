import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useCafe, type Seat, formatHour } from "@/lib/cafe-store";
import { SeatMap } from "@/components/SeatMap";
import { ClosedOverlay } from "@/components/ClosedOverlay";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/real-time")({
  component: RealTime,
  head: () => ({ meta: [{ title: "Real-Time Seating · Lift Coffee Roasters" }] }),
});

function RealTime() {
  const { state, dispatch, isOpen, currentHour, mockHour, setMockHour, useRealClock, setUseRealClock } = useCafe();
  const [selected, setSelected] = useState<Seat | null>(null);

  const available = state.seats.filter((s) => s.status === "Available").length;
  const total = state.seats.length;
  const occupied = state.seats.filter((s) => s.status === "Occupied").length;
  const occupancy = Math.round((occupied / total) * 100);

  const onSeatClick = (seat: Seat) => {
    if (!isOpen) return;
    setSelected(seat);
  };

  const hold = (s: Seat) => {
    dispatch({ type: "HOLD", id: s.id });
    toast.success(`10-minute hold placed on ${s.id}`);
    setSelected(null);
  };
  const claim = (s: Seat) => {
    dispatch({ type: "CLAIM", id: s.id });
    toast.success(`${s.id} claimed — enjoy your session!`);
    setSelected(null);
  };
  const cancel = (s: Seat) => {
    dispatch({ type: "CANCEL", id: s.id });
    toast.info(`Hold cancelled on ${s.id}`);
    setSelected(null);
  };

  const seatLive = selected ? state.seats.find((s) => s.id === selected.id) ?? selected : null;

  const map = <SeatMap onSeatClick={isOpen ? onSeatClick : undefined} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">Real-Time Status</h1>
          <p className="text-muted-foreground">
            Time: <span className="font-medium text-espresso">{formatHour(currentHour)}</span> ·
            Available Seats: <span className="font-medium text-espresso">{available}/{total}</span> ·
            Seating Capacity: <span className="font-medium text-espresso">{occupancy}% occupied</span>
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs">
            <Switch checked={useRealClock} onCheckedChange={setUseRealClock} />
            <span>Real clock</span>
          </div>
          {!useRealClock && (
            <div className="min-w-[180px]">
              <div className="mb-1 text-xs text-muted-foreground">Simulated hour: <b className="text-espresso">{formatHour(mockHour)}</b></div>
              <Slider value={[mockHour]} min={0} max={23} step={1} onValueChange={(v) => setMockHour(v[0])} />
            </div>
          )}
        </div>
      </div>

      {isOpen ? map : <ClosedOverlay>{map}</ClosedOverlay>}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Seat {seatLive?.id}</DialogTitle>
          </DialogHeader>
          {seatLive && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
                Status: <b>{seatLive.status}</b> · Table {seatLive.tableNumber}
              </div>
              {seatLive.status === "Available" && (
                <Button className="w-full" onClick={() => hold(seatLive)}>
                  Place 10-Minute Hold
                </Button>
              )}
              {seatLive.status === "Reserved" && !seatLive.claimed && (
                <div className="space-y-2">
                  <Button className="w-full bg-accent text-accent-foreground hover:opacity-90" onClick={() => claim(seatLive)}>
                    I'm Here / Claim Seat
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => cancel(seatLive)}>
                    Cancel Reservation
                  </Button>
                </div>
              )}
              {seatLive.status === "Occupied" && (
                <p className="text-sm text-muted-foreground">This seat is currently occupied.</p>
              )}
              {seatLive.status === "Out of Order" && (
                <p className="text-sm text-muted-foreground">This seat is temporarily out of service.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
