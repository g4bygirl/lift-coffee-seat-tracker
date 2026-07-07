import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useCafe, formatHour } from "@/lib/cafe-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, RefreshCw, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/employee/verify")({
  component: Verify,
  head: () => ({ meta: [{ title: "Verify / Cleanse · Lift Coffee Roasters" }] }),
});

type Step = "enter" | "confirm" | "done";

function Verify() {
  const { dispatch, currentHour } = useCafe();
  const [step, setStep] = useState<Step>("enter");
  const [value, setValue] = useState("");

  const next = () => {
    const n = parseInt(value, 10);
    if (isNaN(n) || n < 0) return toast.error("Enter a valid non-negative number");
    setStep("confirm");
  };
  const confirm = () => {
    const n = parseInt(value, 10);
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
    setStep("done");
    toast.success("Verified entry submitted");
  };
  const reset = () => {
    setStep("enter");
    setValue("");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">Verification & Cleansing</h1>
        <p className="text-muted-foreground">Two-step confirmation before logging into the data feed.</p>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <Stepper active={step === "enter"} done={step !== "enter"} n={1} label="Enter" />
        <div className="h-px flex-1 bg-border" />
        <Stepper active={step === "confirm"} done={step === "done"} n={2} label="Confirm" />
        <div className="h-px flex-1 bg-border" />
        <Stepper active={step === "done"} done={false} n={3} label="Submitted" />
      </div>

      <div className="rounded-3xl border border-border bg-card p-8">
        {step === "enter" && (
          <div className="space-y-4">
            <label className="text-sm font-medium text-espresso">Customer headcount at {formatHour(currentHour)}</label>
            <Input type="number" min="0" placeholder="Enter number" value={value} onChange={(e) => setValue(e.target.value)} />
            <Button className="w-full" onClick={next} disabled={!value}>Continue</Button>
          </div>
        )}
        {step === "confirm" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-latte/60 text-espresso">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">You entered:</p>
            <div className="font-display text-5xl font-semibold text-espresso">{value}</div>
            <p className="text-sm text-muted-foreground">customers at {formatHour(currentHour)}. Is that correct?</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" onClick={reset}>
                <RefreshCw className="mr-2 h-4 w-4" /> Re-enter Number
              </Button>
              <Button onClick={confirm}>
                <Check className="mr-2 h-4 w-4" /> Confirm Number
              </Button>
            </div>
          </div>
        )}
        {step === "done" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground">
              <Check className="h-6 w-6" />
            </div>
            <div className="font-display text-xl font-semibold text-espresso">Submitted to the data feed</div>
            <p className="text-sm text-muted-foreground">Your verified count is now in the raw data log.</p>
            <Button variant="outline" onClick={reset}>Log another</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`grid h-8 w-8 place-items-center rounded-full border-2 text-sm font-semibold ${
          done ? "border-accent bg-accent text-accent-foreground" : active ? "border-espresso bg-espresso text-cream" : "border-border bg-background text-muted-foreground"
        }`}
      >
        {done ? <Check className="h-4 w-4" /> : n}
      </div>
      <span className={active || done ? "text-espresso" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}
