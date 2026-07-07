import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SeatMap } from "@/components/SeatMap";
import { useCafe, type Seat, type SeatStatus, formatHour } from "@/lib/cafe-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Circle, X, Clock, Wrench, Database, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/employee")({
  component: Employee,
  head: () => ({ meta: [{ title: "Employee Dashboard · Lift Coffee Roasters" }] }),
});

const STATUS_OPTS: { s: SeatStatus; icon: any; tone: string }[] = [
  { s: "Available", icon: Circle, tone: "text-accent" },
  { s: "Occupied", icon: X, tone: "text-destructive" },
  { s: "Reserved", icon: Clock, tone: "text-yellow-600" },
  { s: "Out of Order", icon: Wrench, tone: "text-muted-foreground" },
];

function Employee() {
  const { state, dispatch, currentHour } = useCafe();
  const [selected, setSelected] = useState<Seat | null>(null);
  const [count, setCount] = useState<string>("");

  const submitCount = () => {
    const n = parseInt(count, 10);
    if (isNaN(n) || n < 0) return toast.error("Enter a valid number");
    const hour = formatHour(currentHour);
    dispatch({
      type: "ADD_LOG",
      log: {
        timestamp: `${new Date().toLocaleDateString()} ${hour}`,
        hour,
        occupied: n,
        customers: n,
      },
    });
    toast.success(`Logged ${n} customers at ${hour}`);
    setCount("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">Employee Dashboard</h1>
        <p className="text-muted-foreground">Manage seats and log hourly headcounts.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <SeatMap onSeatClick={setSelected} />

        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="mb-2 font-display text-lg font-semibold text-espresso">Hourly Headcount</div>
            <p className="text-xs text-muted-foreground">How many customers at {formatHour(currentHour)}?</p>
            <div className="mt-3 flex gap-2">
              <Input type="number" min="0" placeholder="e.g. 14" value={count} onChange={(e) => setCount(e.target.value)} />
              <Button onClick={submitCount}>Log</Button>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Recent: {state.logs.slice(-3).reverse().map((l) => `${l.hour}: ${l.customers}`).join(" · ")}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-espresso p-6 text-cream">
            <div className="text-xs uppercase tracking-widest text-cream/70">Tip</div>
            <p className="mt-2 text-sm">Click any seat on the map to open its status override menu.</p>
          </div>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Override seat {selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTS.map((o) => (
                <Button
                  key={o.s}
                  variant="outline"
                  className="h-auto flex-col gap-1 py-4"
                  onClick={() => {
                    dispatch({ type: "SET_STATUS", id: selected.id, status: o.s });
                    toast.success(`${selected.id} → ${o.s}`);
                    setSelected(null);
                  }}
                >
                  <o.icon className={`h-5 w-5 ${o.tone}`} />
                  <span className="text-sm">{o.s}</span>
                </Button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
