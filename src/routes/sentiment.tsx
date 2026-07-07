import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCafe, type Feedback } from "@/lib/cafe-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Sparkles, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sentiment")({
  component: Sentiment,
  head: () => ({ meta: [{ title: "AI Sentiment Analysis · Lift Coffee Roasters" }] }),
});

const NEG_WORDS = ["crowd", "noisy", "slow", "cold", "bad", "hate", "dirty", "wait", "expensive", "no tables", "loud", "rude"];
const POS_WORDS = ["love", "great", "amazing", "cozy", "friendly", "fast", "clean", "quiet", "perfect", "best", "warm"];

function classify(text: string): Feedback["sentiment"] {
  const t = text.toLowerCase();
  const neg = NEG_WORDS.some((w) => t.includes(w));
  const pos = POS_WORDS.some((w) => t.includes(w));
  if (neg && !pos) return "Negative";
  if (pos && !neg) return "Positive";
  return "Neutral";
}

const QUARTERLY = [
  { q: "Q1", score: 68 },
  { q: "Q2", score: 74 },
  { q: "Q3", score: 71 },
  { q: "Q4", score: 79 },
];

const INSIGHTS = [
  "Students mention Wi-Fi reliability as the top reason for returning.",
  "Peak lunch hours drive most negative feedback — consider extending seating.",
  "Baristas' friendliness is a repeated positive theme in Q4.",
];

function Sentiment() {
  const { state, dispatch } = useCafe();
  const [text, setText] = useState("");

  const positivePct = useMemo(() => {
    const total = state.feedback.length;
    if (!total) return 0;
    const pos = state.feedback.filter((f) => f.sentiment === "Positive").length;
    return Math.round((pos / total) * 100);
  }, [state.feedback]);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const fb: Feedback = {
      id: `f-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      sentiment: classify(trimmed),
      text: trimmed,
    };
    dispatch({ type: "ADD_FEEDBACK", fb });
    setText("");
    toast.success(`Feedback added · classified as ${fb.sentiment}`);
  };

  const sentimentIcon = (s: Feedback["sentiment"]) => {
    if (s === "Positive") return <ThumbsUp className="h-4 w-4 text-accent" />;
    if (s === "Negative") return <ThumbsDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">AI Sentiment Analysis</h1>
        <p className="text-muted-foreground">Customer Experience Intelligence · updated live.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-cream to-latte/30 p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Overall Sentiment</div>
          <div className="mt-3 font-display text-6xl font-semibold text-espresso">{positivePct}%</div>
          <div className="mt-1 text-sm text-muted-foreground">Positive across {state.feedback.length} reviews</div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
            <div className="h-full bg-accent transition-all duration-500" style={{ width: `${positivePct}%` }} />
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-2 text-sm font-medium text-espresso">Seating Availability Sentiment Over Time</div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={QUARTERLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="q" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} unit="%" domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Line type="monotone" dataKey="score" stroke="var(--copper)" strokeWidth={3} dot={{ r: 5, fill: "var(--espresso)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-espresso">Review Specific Customer Posts</h2>
            <span className="text-xs text-muted-foreground">{state.feedback.length} total</span>
          </div>
          <ul className="max-h-[380px] space-y-3 overflow-auto pr-2">
            {state.feedback.map((f) => (
              <li key={f.id} className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                  {sentimentIcon(f.sentiment)}
                  <span className="font-medium">{f.sentiment}</span>
                  <span>· {f.date}</span>
                </div>
                <p className="text-sm">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-espresso p-6 text-cream">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cream/70">
              <Sparkles className="h-3.5 w-3.5" /> AI Insights
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {INSIGHTS.map((i) => (
                <li key={i} className="rounded-lg bg-cream/10 p-3">{i}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="mb-2 font-display text-lg font-semibold text-espresso">Submit Anonymous Feedback</div>
            <Textarea
              placeholder="e.g. Way too crowded right now, no tables left!"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
            <Button className="mt-3 w-full" onClick={submit} disabled={!text.trim()}>
              Submit for analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
