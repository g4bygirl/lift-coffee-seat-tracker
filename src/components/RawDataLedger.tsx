import { useCafe } from "@/lib/cafe-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database } from "lucide-react";

export function RawDataLedger() {
  const { state } = useCafe();
  const rows = [...state.logs].reverse();
  const total = state.capacity;
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-4">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-espresso">
          <Database className="h-5 w-5 text-copper" /> Raw Systems Ledger &amp; Logging Feed
        </h2>
        <p className="text-sm text-muted-foreground">
          Immutable transaction logs of every staff-updated headcount.
        </p>
      </div>
      <div className="max-h-[380px] overflow-auto rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Hour</TableHead>
              <TableHead className="text-right">Customers</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead className="text-right">% Full</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                  No entries yet — log an hourly count to populate the feed.
                </TableCell>
              </TableRow>
            )}
            {rows.map((l, i) => {
              const avail = Math.max(0, total - l.occupied);
              const pct = total > 0 ? Math.round((l.occupied / total) * 100) : 0;
              return (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs">{l.timestamp}</TableCell>
                  <TableCell>{l.hour}</TableCell>
                  <TableCell className="text-right">{l.customers}</TableCell>
                  <TableCell className="text-right">
                    {avail} / {total}
                  </TableCell>
                  <TableCell className="text-right font-medium">{pct}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
