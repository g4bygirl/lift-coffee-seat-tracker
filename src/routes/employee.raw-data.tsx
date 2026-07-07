import { createFileRoute } from "@tanstack/react-router";
import { useCafe } from "@/lib/cafe-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/employee/raw-data")({
  component: RawData,
  head: () => ({ meta: [{ title: "Raw Data Feed · Lift Coffee Roasters" }] }),
});

function RawData() {
  const { state } = useCafe();
  const total = 20;
  const rows = [...state.logs].reverse();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">Raw Data Feed</h1>
        <p className="text-muted-foreground">Timestamped log of staff-updated counts.</p>
      </div>
      <div className="rounded-3xl border border-border bg-card p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Hour</TableHead>
              <TableHead className="text-right">Customers</TableHead>
              <TableHead className="text-right">Seats Available</TableHead>
              <TableHead className="text-right">% Full</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((l, i) => {
              const avail = Math.max(0, total - l.occupied);
              const pct = Math.round((l.occupied / total) * 100);
              return (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs">{l.timestamp}</TableCell>
                  <TableCell>{l.hour}</TableCell>
                  <TableCell className="text-right">{l.customers}</TableCell>
                  <TableCell className="text-right">{avail} / {total}</TableCell>
                  <TableCell className="text-right font-medium">{pct}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
