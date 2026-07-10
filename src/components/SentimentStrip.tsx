import { useMemo, useState } from "react";
import { useCafe, type Feedback } from "@/lib/cafe-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { toast } from "sonner";

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

function icon(s: Feedback["sentiment"]) {
  if (s === "Positive") return <ThumbsUp className="h-3.5 w-3.5 text-accent" />;
  if (s === "Negative") return <ThumbsDown className="h-3.5 w-3.5 text-destructive" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function SentimentStrip() {
  const { state, dispatch } = useCafe();
  const [text, setText] = useState("");

  const positivePct = useMemo(() => {
    const total = state.feedback.length;
    if (!total) return 0;
    return Math.round((state.feedback.filter((f) => f.sentiment === "Positive").length / total) * 100);
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

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
      <div className="rounded-3xl border border-border bg-espresso p-6 text-cream">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cream/70">
          <Sparkles className="h-3.5 w-3.5" /> AI Sentiment Signal
        </div>
        <div className="mt-3 font-display text-6xl font-semibold">{positivePct}%</div>
        <div className="text-sm text-cream/70">Positive across {state.feedback.length} recent reviews</div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-cream/10">
          <div className="h-full bg-accent transition-all" style={{ width: `${positivePct}%` }} />
        </div>
        <div className="mt-6">
          <div className="text-xs uppercase tracking-widest text-cream/60">Submit anonymous feedback</div>
          <Textarea
            placeholder="How's the vibe today?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="mt-2 border-cream/20 bg-cream/10 text-cream placeholder:text-cream/40"
          />
          <Button
            onClick={submit}
            disabled={!text.trim()}
            className="mt-2 w-full bg-cream text-espresso hover:bg-cream/90"
          >
            Submit for analysis
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="font-display text-lg font-semibold text-espresso">Recent Customer Posts</h3>
          <span className="text-xs text-muted-foreground">{state.feedback.length} total</span>
        </div>
        <ul className="max-h-[320px] space-y-2 overflow-auto pr-1">
          {state.feedback.slice(0, 10).map((f) => (
            <li key={f.id} className="rounded-2xl border border-border bg-background/60 p-3">
              <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                {icon(f.sentiment)}
                <span className="font-medium">{f.sentiment}</span>
                <span>· {f.date}</span>
              </div>
              <p className="text-sm">{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
