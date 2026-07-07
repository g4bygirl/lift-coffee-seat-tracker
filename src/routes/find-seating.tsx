import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SeatMap } from "@/components/SeatMap";
import { ClosedOverlay } from "@/components/ClosedOverlay";
import { useCafe, type FeatureTag } from "@/lib/cafe-store";
import { Button } from "@/components/ui/button";
import { Wifi, Zap, Users } from "lucide-react";

export const Route = createFileRoute("/find-seating")({
  component: FindSeating,
  head: () => ({ meta: [{ title: "Find Seating by Need · Lift Coffee Roasters" }] }),
});

const FILTERS: { label: FeatureTag; icon: any }[] = [
  { label: "Reliable Wi-Fi", icon: Wifi },
  { label: "Large Table Size", icon: Users },
  { label: "Nearby Outlets", icon: Zap },
];

function FindSeating() {
  const { isOpen } = useCafe();
  const [active, setActive] = useState<FeatureTag | null>("Reliable Wi-Fi");
  const map = <SeatMap highlightFeature={active} />;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">Find Seating by Need</h1>
        <p className="text-muted-foreground">Pick what matters most — we'll highlight matching tables.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.label}
            variant={active === f.label ? "default" : "outline"}
            onClick={() => setActive(active === f.label ? null : f.label)}
            className="rounded-full"
          >
            <f.icon className="mr-2 h-4 w-4" />
            {f.label}
          </Button>
        ))}
      </div>

      {isOpen ? map : <ClosedOverlay>{map}</ClosedOverlay>}
    </div>
  );
}
