import { useCafe, type SeatStatus } from "@/lib/cafe-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Wifi, Zap, Users, Circle, X, Clock, Wrench } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_OPTS: { s: SeatStatus; icon: any; tone: string }[] = [
  { s: "Available", icon: Circle, tone: "text-accent" },
  { s: "Occupied", icon: X, tone: "text-destructive" },
  { s: "Reserved", icon: Clock, tone: "text-yellow-600" },
  { s: "Out of Order", icon: Wrench, tone: "text-muted-foreground" },
];

function statusPill(s: SeatStatus) {
  const map: Record<SeatStatus, string> = {
    Available: "bg-accent/15 text-accent border-accent/30",
    Occupied: "bg-destructive/15 text-destructive border-destructive/30",
    Reserved: "bg-yellow-400/20 text-yellow-700 border-yellow-500/30",
    "Out of Order": "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium", map[s])}>
      {s}
    </span>
  );
}

export function FloorOpsMatrix() {
  const { state, dispatch } = useCafe();
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-4">
        <h2 className="font-display text-xl font-semibold text-espresso">Floor Operations Matrix</h2>
        <p className="text-sm text-muted-foreground">
          Override seat statuses instantly to maintain floor balance.
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seat ID</TableHead>
              <TableHead>Attributes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Set Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.seats.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.id}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {s.features.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {f === "Reliable Wi-Fi" && <Wifi className="h-3 w-3" />}
                        {f === "Nearby Outlets" && <Zap className="h-3 w-3" />}
                        {f === "Large Table Size" && <Users className="h-3 w-3" />}
                        {f}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{statusPill(s.status)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap justify-end gap-1">
                    {STATUS_OPTS.map((o) => (
                      <Button
                        key={o.s}
                        size="sm"
                        variant={s.status === o.s ? "default" : "outline"}
                        className="h-7 px-2 text-[11px]"
                        onClick={() => {
                          dispatch({ type: "SET_STATUS", id: s.id, status: o.s });
                          toast.success(`${s.id} → ${o.s}`);
                        }}
                      >
                        <o.icon className={cn("mr-1 h-3 w-3", s.status === o.s ? "" : o.tone)} />
                        {o.s}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
