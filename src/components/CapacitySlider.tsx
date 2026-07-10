import { useCafe } from "@/lib/cafe-store";
import { Slider } from "@/components/ui/slider";
import { Settings2 } from "lucide-react";

export function CapacitySlider() {
  const { state, dispatch } = useCafe();
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-3 flex items-center gap-2">
        <Settings2 className="h-5 w-5 text-copper" />
        <h2 className="font-display text-xl font-semibold text-espresso">Floor Infrastructure Scale</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Scale max manageable capacity based on staffing and resource deployment.
      </p>
      <div className="mt-5 flex items-center gap-6">
        <div className="text-center">
          <div className="font-display text-4xl font-semibold text-espresso">{state.capacity}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Max Seats</div>
        </div>
        <div className="flex-1">
          <Slider
            min={1}
            max={40}
            step={1}
            value={[state.capacity]}
            onValueChange={(v) => dispatch({ type: "SET_CAPACITY", capacity: v[0] })}
          />
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>1</span>
            <span>40</span>
          </div>
        </div>
      </div>
    </section>
  );
}
