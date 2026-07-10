import { Moon } from "lucide-react";
import { formatHour, useCafe } from "@/lib/cafe-store";

export function ClosedBanner() {
  const { currentHour, isOpen } = useCafe();
  if (isOpen) return null;
  return (
    <div className="rounded-3xl border border-espresso/20 bg-espresso p-6 text-cream">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream/10">
          <Moon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-display text-xl font-semibold">The Café is Currently Closed</div>
          <p className="mt-1 text-sm text-cream/70">
            Operating hours are 7:00 AM – 5:00 PM. Systems are locked until opening. Simulated time: {formatHour(currentHour)}.
          </p>
        </div>
      </div>
    </div>
  );
}
