import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatHour, useCafe } from "@/lib/cafe-store";
import { ClipboardList, ShieldCheck, RotateCcw, Check } from "lucide-react";

export function HeadcountRegistry() {
  const { state, dispatch, currentHour } = useCafe();
  const [count, setCount] = useState("");
  const [pending, setPending] = useState<number | null>(null);

  const stage = () => {
    const n = parseInt(count, 10);
    if (isNaN(n) || n < 0) return toast.error("Enter a valid non-negative number");
    setPending(n);
  };

  const confirm = () => {
    if (pending === null) return;
    const hour = formatHour(currentHour);
    dispatch({
      type: "ADD_LOG",
      log: {
        timestamp: `${new Date().toLocaleDateString()} ${hour}`,
        hour,
        occupied: Math.min(pending, state.capacity),
        customers: pending,
      },
    });
    toast.success(`Logged ${pending} customers at ${hour}`);
    setPending(null);
    setCount("");
  };

  const reenter = () => {
    setPending(null);
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-copper" />
        <h2 className="font-display text-xl font-semibold text-espresso">Hourly Headcount Registry</h2>
      </div>

      <div className="space-y-3">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">
          Observed customer count at {formatHour(currentHour)}
        </label>
        <div className="flex gap-2">
          <Input
            type="number"
            min="0"
            placeholder="e.g. 14"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            disabled={pending !== null}
          />
          <Button onClick={stage} disabled={pending !== null}>
            Log Hourly Metric
          </Button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className={pending === null && !count ? "text-espresso" : ""}>Enter</span>
          <span>→</span>
          <span className={pending !== null ? "text-espresso" : ""}>Confirm</span>
          <span>→</span>
          <span>Submitted</span>
        </div>

        {pending !== null && (
          <div className="rounded-2xl border border-copper/40 bg-copper/5 p-4">
            <div className="flex items-center gap-2 text-copper">
              <ShieldCheck className="h-4 w-4" />
              <div className="text-sm font-semibold uppercase tracking-widest">Pending Entry Verification</div>
            </div>
            <p className="mt-2 text-sm text-espresso">
              Ready to commit <span className="font-display text-lg font-semibold">{pending}</span> occupants to
              the historical data log at {formatHour(currentHour)}?
            </p>
            <div className="mt-3 flex gap-2">
              <Button onClick={confirm} className="flex-1">
                <Check className="mr-1.5 h-4 w-4" /> Confirm and Save
              </Button>
              <Button onClick={reenter} variant="outline" className="flex-1">
                <RotateCcw className="mr-1.5 h-4 w-4" /> Re-enter
              </Button>
            </div>
          </div>
        )}

        {state.logs.length > 0 && (
          <div className="border-t border-border pt-3 text-xs text-muted-foreground">
            Recent:{" "}
            {state.logs
              .slice(-3)
              .reverse()
              .map((l) => `${l.hour}: ${l.customers}`)
              .join(" · ")}
          </div>
        )}
      </div>
    </section>
  );
}
