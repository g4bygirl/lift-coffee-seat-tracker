import { createFileRoute } from "@tanstack/react-router";
import { useCafe } from "@/lib/cafe-store";
import { ClosedBanner } from "@/components/ClosedBanner";
import { CustomerPortal } from "@/components/CustomerPortal";
import { EmployeeDashboard } from "@/components/EmployeeDashboard";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Lift Coffee Roasters — Seating Management" },
      {
        name: "description",
        content:
          "Live seating availability, forecasts and sentiment for Lift Coffee Roasters — with a full staff dashboard.",
      },
    ],
  }),
});

function Home() {
  const { view } = useCafe();
  return (
    <div className="space-y-6">
      <ClosedBanner />
      {view === "student" ? <CustomerPortal /> : <EmployeeDashboard />}
    </div>
  );
}
