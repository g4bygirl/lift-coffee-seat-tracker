import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { formatHour, useCafe } from "@/lib/cafe-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart } from "lucide-react";

const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const PROBS = [95, 80, 65, 45, 30, 15, 22, 55, 78, 90];

function trafficLabel(prob: number) {
  if (prob >= 75) return { label: "Very Quiet", tone: "text-accent" };
  if (prob >= 50) return { label: "Steady", tone: "text-copper" };
  if (prob >= 30) return { label: "Busy", tone: "text-copper" };
  return { label: "Peak Traffic", tone: "text-destructive" };
}

export function ForecastPanel() {
  const { currentHour } = useCafe();
  const [selected, setSelected] = useState<number>(currentHour >= 7 && currentHour <= 16 ? currentHour : 9);
  const inHours = selected >= 7 && selected <= 16;
  const chartData = useMemo(() => HOURS.map((h, i) => ({ hour: formatHour(h), h, prob: PROBS[i] })), []);
  const selectedProb = inHours ? PROBS[HOURS.indexOf(selected)] : 0;
  const t = inHours ? trafficLabel(selectedProb) : null;

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-espresso">
            <LineChart className="h-5 w-5 text-copper" /> Predictive Demand Modeling
          </h2>
          <p className="text-sm text-muted-foreground">
            Machine-learning insights estimating peak capacity constraints across operational hours.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Select Planning Horizon</label>
          <Select value={String(selected)} onValueChange={(v) => setSelected(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((h) => (
                <SelectItem key={h} value={String(h)}>
                  {formatHour(h)}
                  {h === 12 ? " (Midday)" : h === 16 ? " (Pre-Close)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {inHours && t ? (
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-baseline justify-between">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Finding Probability</div>
                <div className="font-display text-3xl font-semibold text-espresso">{selectedProb}%</div>
              </div>
              <div className={`mt-2 font-medium ${t.tone}`}>{t.label}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                Model outputs mapping the selected hour against historical trendlines.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
              Café closed at this hour. Forecasts run 7 AM – 5 PM.
            </div>
          )}
        </div>

        <div className="h-[260px]">
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
    </section>
  );
}
