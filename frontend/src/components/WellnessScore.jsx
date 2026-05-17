import { useState, useEffect, useRef } from "react";
import "./WellnessScore.css";

// ─── SCORING FORMULA ────────────────────────────────────────────────────────
// Each sub-score converts raw user input → 0–100.
// The final score is a weighted average of all five.

const WEIGHTS = {
  sleep:    0.25,   // 25% — biggest hormonal impact
  hydration: 0.20,  // 20%
  exercise:  0.25,  // 25%
  cycle:     0.15,  // 15% — regularity/tracking
  stress:    0.15,  // 15% (inverted: low stress = high score)
};

function calcSleep(hrs) {
  // 7–9 hrs = 100; <5 or >10 = 0; scales linearly
  if (hrs >= 7 && hrs <= 9) return 100;
  if (hrs < 5) return Math.round((hrs / 5) * 50);
  if (hrs > 9) return Math.round(100 - (hrs - 9) * 20);
  if (hrs < 7) return Math.round(50 + ((hrs - 5) / 2) * 50);
  return 0;
}

function calcHydration(glasses) {
  // Goal = 8 glasses. Linear 0–8, capped at 100.
  return Math.min(100, Math.round((glasses / 8) * 100));
}

function calcExercise(mins) {
  // WHO goal = 150 min/week → 21 min/day average. Score out of 45 min target.
  return Math.min(100, Math.round((mins / 45) * 100));
}

function calcCycle(tracked) {
  // Did the user log their cycle today? Simple yes/no. Yes = 100, no = 30.
  return tracked ? 100 : 30;
}

function calcStress(level) {
  // level 1–5 from user (1=calm, 5=very stressed). Inverted.
  return Math.round(((5 - level) / 4) * 100);
}

export function computeWellnessScore(inputs) {
  const sub = {
    sleep:    calcSleep(inputs.sleepHrs),
    hydration: calcHydration(inputs.waterGlasses),
    exercise:  calcExercise(inputs.exerciseMins),
    cycle:     calcCycle(inputs.cycleTracked),
    stress:    calcStress(inputs.stressLevel),
  };
  const total = Math.round(
    Object.entries(sub).reduce((acc, [key, val]) => acc + val * WEIGHTS[key], 0)
  );
  return { total, sub };
}

// ─── RING COMPONENT ─────────────────────────────────────────────────────────

function ScoreRing({ score, size = 160 }) {
  const radius = (size - 20) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (circ * score) / 100;
  const cx = size / 2;

  const color =
    score >= 75 ? "#22c55e" :
    score >= 50 ? "#7c76f4" :
    score >= 30 ? "#f59e0b" : "#ef4444";

  const label =
    score >= 75 ? "Great" :
    score >= 50 ? "Good" :
    score >= 30 ? "Fair" : "Low";

  return (
    <div className="ws-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={radius} fill="none" stroke="#ede8ff" strokeWidth="10" />
        <circle
          cx={cx} cy={cx} r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cx})`}
          style={{ transition: "stroke-dashoffset 1s ease, stroke 0.4s ease" }}
        />
      </svg>
      <div className="ws-ring-center">
        <div className="ws-ring-num" style={{ color }}>{score}</div>
        <div className="ws-ring-sub">/ 100</div>
        <div className="ws-ring-label" style={{ color }}>{label}</div>
      </div>
    </div>
  );
}

// ─── SUB-SCORE BAR ──────────────────────────────────────────────────────────

const BAR_COLORS = {
  sleep:    "#7c76f4",
  hydration: "#06b6d4",
  exercise:  "#22c55e",
  cycle:     "#f472b6",
  stress:    "#f59e0b",
};

const SUB_LABELS = {
  sleep:    "Sleep quality",
  hydration: "Hydration",
  exercise:  "Exercise",
  cycle:     "Cycle tracking",
  stress:    "Stress (low = better)",
};

function SubBar({ name, value }) {
  return (
    <div className="ws-sub-row">
      <div className="ws-sub-label">{SUB_LABELS[name]}</div>
      <div className="ws-sub-bar-bg">
        <div
          className="ws-sub-bar-fill"
          style={{
            width: `${value}%`,
            background: BAR_COLORS[name],
            transition: "width 0.8s ease",
          }}
        />
      </div>
      <div className="ws-sub-val" style={{ color: BAR_COLORS[name] }}>{value}</div>
    </div>
  );
}

// ─── INPUT CONTROLS ─────────────────────────────────────────────────────────

function SliderField({ label, id, min, max, step = 1, value, unit, onChange }) {
  return (
    <div className="ws-field">
      <div className="ws-field-header">
        <label className="ws-field-label" htmlFor={id}>{label}</label>
        <span className="ws-field-val">{value}{unit}</span>
      </div>
      <input
        id={id} type="range" min={min} max={max} step={step}
        value={value} onChange={e => onChange(Number(e.target.value))}
        className="ws-slider"
      />
      <div className="ws-slider-ends">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ─── AI SUGGESTION ──────────────────────────────────────────────────────────

function getSuggestion(inputs, sub) {
  // Rule-based: find the weakest sub-score and give targeted advice
  const entries = Object.entries(sub);
  const [weakest] = entries.sort((a, b) => a[1] - b[1]);
  const rules = {
    sleep: `You're getting ${inputs.sleepHrs} hrs of sleep. For PCOS, 7–9 hrs is optimal — poor sleep raises cortisol and worsens insulin resistance.`,
    hydration: `Only ${inputs.waterGlasses} glasses today. Aim for 8 — dehydration worsens bloating, fatigue, and brain fog common in PCOS.`,
    exercise: `${inputs.exerciseMins} mins of movement today. A 10-min walk after meals significantly reduces blood sugar spikes for PCOS.`,
    cycle: `Logging your cycle daily helps identify patterns. Even a quick symptom note counts — tap "Yes" to mark today tracked.`,
    stress: `Stress level at ${inputs.stressLevel}/5. High cortisol directly disrupts ovulation and insulin sensitivity. Try 5 mins of box breathing.`,
  };
  return rules[weakest[0]];
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function WellnessScore() {
  const [inputs, setInputs] = useState({
    sleepHrs: 7,
    waterGlasses: 6,
    exerciseMins: 30,
    cycleTracked: true,
    stressLevel: 2,
  });

  const [displayScore, setDisplayScore] = useState(0);
  const animRef = useRef(null);

  const { total, sub } = computeWellnessScore(inputs);

  // Animate the number counter whenever total changes
  useEffect(() => {
    if (animRef.current) clearInterval(animRef.current);
    const start = displayScore;
    const diff = total - start;
    const steps = 30;
    let i = 0;
    animRef.current = setInterval(() => {
      i++;
      setDisplayScore(Math.round(start + (diff * i) / steps));
      if (i >= steps) clearInterval(animRef.current);
    }, 20);
    return () => clearInterval(animRef.current);
  }, [total]);

  const set = (key) => (val) => setInputs((prev) => ({ ...prev, [key]: val }));

  const suggestion = getSuggestion(inputs, { ...sub });

  return (
    <div className="ws-page">

      <div className="ws-header">
        <div className="ws-eyebrow">Wellness Score</div>
        <h1 className="ws-title">Today's health score</h1>
        <p className="ws-sub">Adjust your daily inputs — your score updates instantly.</p>
      </div>

      <div className="ws-grid">

        {/* ── Score card ── */}
        <div className="ws-card ws-score-card">
          <ScoreRing score={displayScore} size={160} />
          <div className="ws-sub-scores">
            <div className="ws-sub-heading">Score breakdown</div>
            {Object.entries(sub).map(([key, val]) => (
              <SubBar key={key} name={key} value={val} />
            ))}
            <div className="ws-weights-note">
              Weights: sleep 25% · hydration 20% · exercise 25% · cycle 15% · stress 15%
            </div>
          </div>
        </div>

        {/* ── Input form ── */}
        <div className="ws-card">
          <div className="ws-card-label">Log today's data</div>

          <SliderField label="Sleep last night" id="sleep" min={3} max={12} step={0.5}
            value={inputs.sleepHrs} unit=" hrs" onChange={set("sleepHrs")} />

          <SliderField label="Water intake" id="water" min={0} max={12}
            value={inputs.waterGlasses} unit=" glasses" onChange={set("waterGlasses")} />

          <SliderField label="Exercise today" id="exercise" min={0} max={90}
            value={inputs.exerciseMins} unit=" mins" onChange={set("exerciseMins")} />

          <SliderField label="Stress level" id="stress" min={1} max={5}
            value={inputs.stressLevel} unit="/5" onChange={set("stressLevel")} />

          <div className="ws-field">
            <div className="ws-field-header">
              <label className="ws-field-label">Cycle tracked today?</label>
              <span className="ws-field-val">{inputs.cycleTracked ? "Yes" : "No"}</span>
            </div>
            <div className="ws-toggle-row">
              <button
                className={`ws-toggle-btn ${inputs.cycleTracked ? "active" : ""}`}
                onClick={() => set("cycleTracked")(true)}>Yes</button>
              <button
                className={`ws-toggle-btn ${!inputs.cycleTracked ? "active" : ""}`}
                onClick={() => set("cycleTracked")(false)}>No</button>
            </div>
          </div>
        </div>

        {/* ── AI suggestion ── */}
        <div className="ws-card ws-full ws-suggestion">
          <div className="ws-sug-dot" />
          <div>
            <div className="ws-sug-label">AI insight · weakest area today</div>
            <div className="ws-sug-text">{suggestion}</div>
          </div>
        </div>

        {/* ── Score history (static demo) ── */}
        <div className="ws-card ws-full">
          <div className="ws-card-label">7-day history</div>
          <div className="ws-history-row">
            {[62, 65, 58, 71, 74, 70, total].map((s, i) => {
              const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
              const isToday = i === 6;
              const color = s >= 75 ? "#22c55e" : s >= 50 ? "#7c76f4" : "#f59e0b";
              return (
                <div className="ws-hist-col" key={i}>
                  <div className="ws-hist-val" style={{ color }}>{s}</div>
                  <div
                    className={`ws-hist-bar ${isToday ? "today" : ""}`}
                    style={{ height: `${Math.round((s / 100) * 60)}px`, background: color, opacity: isToday ? 1 : 0.45 }}
                  />
                  <div className="ws-hist-day">{days[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}