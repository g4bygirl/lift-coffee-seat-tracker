import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Line, LineChart, CartesianGrid, Legend } from "recharts";
import { formatHour, useCafe } from "@/lib/cafe-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/forecast")({
  component: Forecast,
  head: () => ({ meta: [{ title: "Predictive Forecasting · Lift Coffee Roasters" }] }),
});

// Predicted probability of finding an available seat (0-100), 7am–4pm
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const PROBS = [95, 80, 65, 45, 30, 15, 22, 55, 78, 90];

function trafficLabel(prob: number) {
  if (prob >= 75) return { label: "Very Quiet", tone: "text-accent" };
  if (prob >= 50) return { label: "Steady", tone: "text-copper" };
  if (prob >= 30) return { label: "Busy", tone: "text-copper" };
  return { label: "Peak Traffic", tone: "text-destructive" };
}

function Forecast() {
  const { state } = useCafe();
  const [selected, setSelected] = useState<number>(9);
  const inHours = selected >= 7 && selected <= 16;

  const chartData = HOURS.map((h, i) => ({ hour: formatHour(h), h, prob: PROBS[i] }));

  const overlay = useMemo(() => {
    return HOURS.map((h, i) => {
      const log = state.logs.find((l) => l.hour === formatHour(h));
      return {
        hour: formatHour(h),
        historical: log ? Math.round((log.occupied / 20) * 100) : 0,
        forecast: 100 - PROBS[i],
      };
    });
  }, [state.logs]);

  const selectedProb = PROBS[HOURS.indexOf(selected)];
  const t = inHours ? trafficLabel(selectedProb) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">Predictive Forecasting</h1>
        <p className="text-muted-foreground">Popular times at Lift — plan around the crowd.</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Search a time</label>
          <Select value={String(selected)} onValueChange={(v) => setSelected(Number(v))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => (
                <SelectItem key={i} value={String(i)}>{formatHour(i)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {inHours && t ? (
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Predicted at {formatHour(selected)}</div>
              <div className={`mt-1 font-display text-2xl font-semibold ${t.tone}`}>{t.label}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {selectedProb}% chance of finding an available seat.
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
              Lift Coffee Roasters is closed at this time. Predictive data is only available during operating hours (7 AM – 5 PM).
            </div>
          )}
        </div>
        <div className="h-[300px]">
          <div className="mb-2 text-sm font-medium text-espresso">Predicted Probability of Finding Available Seat by Hour</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Bar dataKey="prob" radius={[8, 8, 0, 0]}>
                {chartData.map((d) => (
                  <Cell key={d.h} fill={d.h === selected ? "var(--copper)" : "var(--sage)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-3">
          <h2 className="font-display text-xl font-semibold text-espresso">Data Integration View</h2>
          <p className="text-sm text-muted-foreground">Historical occupancy vs. predictive forecast trend.</p>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overlay}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Legend />
              <Line type="monotone" dataKey="historical" stroke="var(--espresso)" strokeWidth={2} dot={{ r: 3 }} name="Historical" />
              <Line type="monotone" dataKey="forecast" stroke="var(--copper)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
