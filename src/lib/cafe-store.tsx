import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";

export type SeatStatus = "Available" | "Occupied" | "Reserved" | "Out of Order";
export type FeatureTag = "Reliable Wi-Fi" | "Large Table Size" | "Nearby Outlets";

export interface Seat {
  id: string;
  tableNumber: number;
  status: SeatStatus;
  reservationTimestamp?: number; // ms since epoch when hold started
  claimed?: boolean; // permanently occupied after "I'm here"
  features: FeatureTag[];
}

export interface OccupancyLog {
  timestamp: string;
  hour: string;
  occupied: number;
  customers: number;
}

export interface Feedback {
  id: string;
  date: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  text: string;
}

// 5 tables, 4 seats each = 20 seats
const TABLES = [
  { n: 1, features: ["Reliable Wi-Fi", "Nearby Outlets"] as FeatureTag[] },
  { n: 2, features: ["Large Table Size", "Reliable Wi-Fi"] as FeatureTag[] },
  { n: 3, features: ["Nearby Outlets"] as FeatureTag[] },
  { n: 4, features: ["Large Table Size", "Nearby Outlets", "Reliable Wi-Fi"] as FeatureTag[] },
  { n: 5, features: ["Reliable Wi-Fi"] as FeatureTag[] },
];

function seedSeats(): Seat[] {
  const seats: Seat[] = [];
  TABLES.forEach((t) => {
    for (let s = 1; s <= 4; s++) {
      seats.push({
        id: `T${t.n}-S${s}`,
        tableNumber: t.n,
        status: "Available",
        features: t.features,
      });
    }
  });
  // Exactly 2 occupied: T2-S1 and T4-S3
  const idsOccupied = ["T2-S1", "T4-S3"];
  return seats.map((s) => (idsOccupied.includes(s.id) ? { ...s, status: "Occupied", claimed: true } : s));
}

function seedLogs(): OccupancyLog[] {
  const hours = ["7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"];
  const counts = [3, 8, 12, 15, 18, 20, 19, 14, 10, 7];
  const today = new Date().toLocaleDateString();
  return hours.map((h, i) => ({
    timestamp: `${today} ${h}`,
    hour: h,
    occupied: counts[i],
    customers: counts[i] + (i % 3),
  }));
}

const SEED_FEEDBACK: Feedback[] = [
  { id: "f1", date: "2025-06-12", sentiment: "Positive", text: "Love the atmosphere and fast Wi-Fi. Best study spot near campus!" },
  { id: "f2", date: "2025-06-14", sentiment: "Positive", text: "Plenty of outlets and the baristas are so friendly." },
  { id: "f3", date: "2025-06-18", sentiment: "Neutral", text: "Coffee is great, seating is a bit tight during lunch." },
  { id: "f4", date: "2025-06-22", sentiment: "Negative", text: "Way too crowded around noon, couldn't find a table." },
  { id: "f5", date: "2025-06-30", sentiment: "Positive", text: "The reservation feature is a game changer for finals week." },
  { id: "f6", date: "2025-07-02", sentiment: "Positive", text: "Cozy vibes, warm lighting, perfect for long study sessions." },
  { id: "f7", date: "2025-07-05", sentiment: "Neutral", text: "Good espresso but the big table was already claimed." },
  { id: "f8", date: "2025-07-06", sentiment: "Positive", text: "Fast checkout and easy to find a quiet corner." },
];

export type ViewMode = "student" | "employee";

interface CafeState {
  seats: Seat[];
  logs: OccupancyLog[];
  feedback: Feedback[];
}

type Action =
  | { type: "HOLD"; id: string }
  | { type: "CLAIM"; id: string }
  | { type: "CANCEL"; id: string }
  | { type: "SET_STATUS"; id: string; status: SeatStatus }
  | { type: "EXPIRE_HOLDS" }
  | { type: "ADD_LOG"; log: OccupancyLog }
  | { type: "ADD_FEEDBACK"; fb: Feedback };

function reducer(state: CafeState, a: Action): CafeState {
  switch (a.type) {
    case "HOLD":
      return {
        ...state,
        seats: state.seats.map((s) =>
          s.id === a.id && s.status === "Available"
            ? { ...s, status: "Reserved", reservationTimestamp: Date.now(), claimed: false }
            : s,
        ),
      };
    case "CLAIM":
      return {
        ...state,
        seats: state.seats.map((s) =>
          s.id === a.id ? { ...s, status: "Occupied", claimed: true, reservationTimestamp: undefined } : s,
        ),
      };
    case "CANCEL":
      return {
        ...state,
        seats: state.seats.map((s) =>
          s.id === a.id ? { ...s, status: "Available", reservationTimestamp: undefined, claimed: false } : s,
        ),
      };
    case "SET_STATUS":
      return {
        ...state,
        seats: state.seats.map((s) =>
          s.id === a.id
            ? {
                ...s,
                status: a.status,
                reservationTimestamp: a.status === "Reserved" ? Date.now() : undefined,
                claimed: a.status === "Occupied",
              }
            : s,
        ),
      };
    case "EXPIRE_HOLDS": {
      const now = Date.now();
      return {
        ...state,
        seats: state.seats.map((s) =>
          s.status === "Reserved" && !s.claimed && s.reservationTimestamp && now - s.reservationTimestamp > 10 * 60 * 1000
            ? { ...s, status: "Available", reservationTimestamp: undefined }
            : s,
        ),
      };
    }
    case "ADD_LOG":
      return { ...state, logs: [...state.logs, a.log] };
    case "ADD_FEEDBACK":
      return { ...state, feedback: [a.fb, ...state.feedback] };
    default:
      return state;
  }
}

interface Ctx {
  state: CafeState;
  dispatch: React.Dispatch<Action>;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  mockHour: number; // 0-23, current simulated hour
  setMockHour: (h: number) => void;
  useRealClock: boolean;
  setUseRealClock: (b: boolean) => void;
  currentHour: number;
  isOpen: boolean;
  now: Date;
}

const CafeContext = createContext<Ctx | null>(null);

export function CafeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    seats: seedSeats(),
    logs: seedLogs(),
    feedback: SEED_FEEDBACK,
  }));
  const [view, setView] = useState<ViewMode>("student");
  const [mockHour, setMockHour] = useState(9); // demo default 9 AM
  const [useRealClock, setUseRealClock] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
      dispatch({ type: "EXPIRE_HOLDS" });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const currentHour = useRealClock ? now.getHours() : mockHour;
  const isOpen = currentHour >= 7 && currentHour < 17;

  const value = useMemo<Ctx>(
    () => ({ state, dispatch, view, setView, mockHour, setMockHour, useRealClock, setUseRealClock, currentHour, isOpen, now }),
    [state, view, mockHour, useRealClock, currentHour, isOpen, now],
  );

  return <CafeContext.Provider value={value}>{children}</CafeContext.Provider>;
}

export function useCafe() {
  const ctx = useContext(CafeContext);
  if (!ctx) throw new Error("useCafe must be inside CafeProvider");
  return ctx;
}

export function formatHour(h: number) {
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hr} ${suffix}`;
}
