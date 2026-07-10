import { StatRow } from "@/components/StatRow";
import { FloorOpsMatrix } from "@/components/FloorOpsMatrix";
import { HeadcountRegistry } from "@/components/HeadcountRegistry";
import { CapacitySlider } from "@/components/CapacitySlider";
import { ForecastPanel } from "@/components/ForecastPanel";
import { RawDataLedger } from "@/components/RawDataLedger";

export function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">Employee Dashboard</h1>
        <p className="text-muted-foreground">
          Manage the floor, log hourly counts, and keep occupancy data clean.
        </p>
      </div>

      <StatRow />

      <FloorOpsMatrix />

      <div className="grid gap-4 lg:grid-cols-2">
        <HeadcountRegistry />
        <CapacitySlider />
      </div>

      <ForecastPanel />
      <RawDataLedger />
    </div>
  );
}
