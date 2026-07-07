import { Moon } from "lucide-react";
import { formatHour, useCafe } from "@/lib/cafe-store";

export function ClosedOverlay({ children }: { children?: React.ReactNode }) {
  const { currentHour } = useCafe();
  return (
    <div className="relative">
      <div className="pointer-events-none opacity-40 blur-[1px]">{children}</div>
      <div className="absolute inset-0 grid place-items-center rounded-2xl bg-espresso/85 p-8 text-cream backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-cream/10">
            <Moon className="h-6 w-6" />
          </div>
          <h3 className="font-display text-2xl font-semibold">Cafe is Currently Closed</h3>
          <p className="mt-2 text-sm text-cream/70">
            Simulated time: {formatHour(currentHour)} · Hours 7 AM – 5 PM
          </p>
          <p className="mt-4 text-xs text-cream/60">Reservation features are locked outside operating hours.</p>
        </div>
      </div>
    </div>
  );
}
