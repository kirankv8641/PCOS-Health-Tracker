import { useState, useEffect } from "react";
import api from "../services/api";
import "./Dashboard.css";
import WellnessScore from "../components/WellnessScore";

// ── helpers ───────────────────────────────────────────────────────────────────
function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

function shortDay(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
}

const SEVERITY_LABEL = ["None", "Mild", "Moderate", "Severe"];
const SEVERITY_COLOR = { 1: "#22c55e", 2: "#f59e0b", 3: "#ef4444" };

// ── component ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("calories");

  const [symptomLogs,  setSymptomLogs]  = useState([]);
  const [dietLogs,     setDietLogs]     = useState([]);
  const [exerciseLogs, setExerciseLogs] = useState([]);

  // ── Fetch all 3 endpoints in parallel ─────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [symRes, dietRes, exRes] = await Promise.all([
          api.get("/symptom-logs"),
          api.get("/diet-logs"),
          api.get("/exercise-logs"),
        ]);

        if (symRes.data.success)  setSymptomLogs(symRes.data.data   || []);
        if (dietRes.data.success) setDietLogs(dietRes.data.data     || []);
        if (exRes.data.success)   setExerciseLogs(exRes.data.data   || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Today's stats ──────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);

  const todayDiet = dietLogs.find((d) => (d.date || "").slice(0, 10) === today) || {};

  const todayExercise    = exerciseLogs.filter((e) => (e.date || "").slice(0, 10) === today);
  const todayMins        = todayExercise.reduce((s, e) => s + (Number(e.duration) || 0), 0);
  const todayCalBurned   = todayExercise.reduce((s, e) => s + (Number(e.calories) || 0), 0);

  const todaySymptoms = (() => {
    const log = symptomLogs.find((l) => (l.date || "").slice(0, 10) === today);
    return log ? log.symptoms || [] : [];
  })();
  const topSymptom = [...todaySymptoms].sort((a, b) => b.severity - a.severity)[0] || null;

  const todayCalories  = Number(todayDiet.calories)     || 0;
  const todayWater     = Number(todayDiet.waterGlasses) || 0;

  const calGoal   = 1800;
  const waterGoal = 8;
  const minsGoal  = 60;

  // ── 7-day chart data ───────────────────────────────────────────────────────
  const last7 = getLast7Days();

  const caloriesChart = last7.map((date) => {
    const entry = dietLogs.find((d) => (d.date || "").slice(0, 10) === date);
    return { date, day: shortDay(date), value: Number(entry?.calories) || 0 };
  });

  const exerciseChart = last7.map((date) => {
    const entries = exerciseLogs.filter((e) => (e.date || "").slice(0, 10) === date);
    const mins    = entries.reduce((s, e) => s + (Number(e.duration) || 0), 0);
    return { date, day: shortDay(date), value: mins };
  });

  const symptomChart = last7.map((date) => {
    const log  = symptomLogs.find((l) => (l.date || "").slice(0, 10) === date);
    const syms = log?.symptoms || [];
    const avg  = syms.length
      ? syms.reduce((s, x) => s + (Number(x.severity) || 0), 0) / syms.length
      : 0;
    return { date, day: shortDay(date), value: parseFloat(avg.toFixed(1)), count: syms.length };
  });

  const chartData  = { calories: caloriesChart, exercise: exerciseChart, symptoms: symptomChart };
  const tabConfig  = {
    calories: { label: "Calories", unit: "kcal", color: "#f472b6", max: calGoal  },
    exercise: { label: "Exercise", unit: "mins", color: "#7c76f4", max: minsGoal },
    symptoms: { label: "Symptoms", unit: "avg severity", color: "#f59e0b", max: 3 },
  };

  const activeData   = chartData[activeTab];
  const activeConfig = tabConfig[activeTab];
  const maxVal       = Math.max(...activeData.map((d) => d.value), activeConfig.max * 0.5, 1);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="db-root">
        <main className="db-main">
          <div className="db-loading">
            <div className="db-loading-spinner" />
            <p>Loading your data…</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="db-root">
      <main className="db-main">
        <div className="db-content">

          {/* ── Welcome ── */}
          <div className="db-welcome-row">
            <div className="db-welcome-text">
              <h2>Hello 👋</h2>
              <p>Here's your health summary for today.</p>
            </div>
            <div className="db-quote-card">
              <span className="db-quote-heart">❤️</span>
              <p>"Small steps every day lead to big changes."</p>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="db-stats-grid">

            {/* Calories */}
            <div className="db-stat-card">
              <div className="db-stat-header">
                <span className="db-stat-label">Calories Today</span>
                <span className="db-stat-icon cal">🔥</span>
              </div>
              <div className="db-stat-value">
                {todayCalories.toLocaleString()}
                <span className="db-stat-unit"> kcal</span>
              </div>
              <div className="db-stat-sub">/ {calGoal} kcal goal</div>
              <div className="db-progress-bar">
                <div
                  className="db-progress-fill cal"
                  style={{ width: `${Math.min((todayCalories / calGoal) * 100, 100)}%` }}
                />
              </div>
              <div className="db-stat-pct">
                {todayCalories === 0
                  ? "No data logged yet"
                  : `${Math.round((todayCalories / calGoal) * 100)}% of goal`}
              </div>
            </div>

            {/* Water */}
            <div className="db-stat-card">
              <div className="db-stat-header">
                <span className="db-stat-label">Water Intake</span>
                <span className="db-stat-icon water">💧</span>
              </div>
              <div className="db-stat-value">
                {todayWater}
                <span className="db-stat-unit"> glasses</span>
              </div>
              <div className="db-stat-sub">/ {waterGoal} glasses goal</div>
              <div className="db-progress-bar">
                <div
                  className="db-progress-fill water"
                  style={{ width: `${Math.min((todayWater / waterGoal) * 100, 100)}%` }}
                />
              </div>
              <div className="db-stat-pct">
                {todayWater === 0
                  ? "No data logged yet"
                  : `${Math.round((todayWater / waterGoal) * 100)}% of goal`}
              </div>
            </div>

            {/* Exercise */}
            <div className="db-stat-card">
              <div className="db-stat-header">
                <span className="db-stat-label">Active Minutes</span>
                <span className="db-stat-icon act">🏃</span>
              </div>
              <div className="db-stat-value">
                {todayMins}
                <span className="db-stat-unit"> min</span>
              </div>
              <div className="db-stat-sub">/ {minsGoal} min goal · {todayCalBurned} kcal burned</div>
              <div className="db-progress-bar">
                <div
                  className="db-progress-fill act"
                  style={{ width: `${Math.min((todayMins / minsGoal) * 100, 100)}%` }}
                />
              </div>
              <div className="db-stat-pct">
                {todayMins === 0
                  ? "No activity logged yet"
                  : `${Math.round((todayMins / minsGoal) * 100)}% of goal`}
              </div>
            </div>

            {/* Top Symptom */}
            <div className="db-stat-card">
              <div className="db-stat-header">
                <span className="db-stat-label">Top Symptom Today</span>
                <span className="db-stat-icon weight">🩺</span>
              </div>
              {topSymptom ? (
                <>
                  <div className="db-stat-value" style={{ fontSize: "20px", marginTop: "4px" }}>
                    {topSymptom.name}
                  </div>
                  <div className="db-stat-sub">{todaySymptoms.length} symptom{todaySymptoms.length !== 1 ? "s" : ""} tracked</div>
                  <div
                    className="db-symptom-badge"
                    style={{
                      background: (SEVERITY_COLOR[topSymptom.severity] || "#ccc") + "22",
                      color:       SEVERITY_COLOR[topSymptom.severity] || "#666",
                    }}
                  >
                    {SEVERITY_LABEL[topSymptom.severity]}
                  </div>
                </>
              ) : (
                <>
                  <div className="db-stat-value" style={{ fontSize: "16px", color: "#9b89cc", marginTop: "8px" }}>
                    No symptoms logged
                  </div>
                  <div className="db-stat-sub">Go to Symptoms page to log</div>
                </>
              )}
            </div>

          </div>

          {/* ── Weekly Graph ── */}
          <div className="db-card db-graph-card">
            <div className="db-card-header">
              <span className="db-card-title">Weekly Overview</span>
              <span className="db-graph-sub">Last 7 days</span>
            </div>

            {/* Tabs */}
            <div className="db-tabs">
              {Object.entries(tabConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  className={`db-tab ${activeTab === key ? "active" : ""}`}
                  onClick={() => setActiveTab(key)}
                  style={activeTab === key ? { borderBottomColor: cfg.color, color: cfg.color } : {}}
                >
                  {cfg.label}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="db-graph-wrap">
              {activeData.every((d) => d.value === 0) ? (
                <div className="db-graph-empty">
                  No {activeConfig.label.toLowerCase()} data logged in the last 7 days.
                  <br />
                  <span>Start logging on the {activeConfig.label} page to see your trends here.</span>
                </div>
              ) : (
                <>
                  <div className="db-y-axis">
                    {[maxVal, maxVal * 0.5, 0].map((v, i) => (
                      <span key={i}>{Math.round(v)}</span>
                    ))}
                  </div>
                  <div className="db-bars-wrap">
                    <div className="db-grid-lines">
                      <div /><div /><div />
                    </div>
                    {activeData.map((d, i) => {
                      const pct     = (d.value / maxVal) * 100;
                      const isToday = d.date === today;
                      return (
                        <div className="db-bar-col" key={i}>
                          <div className="db-bar-tooltip">
                            <strong>{d.day}</strong><br />
                            {d.value} {activeConfig.unit}
                            {activeTab === "symptoms" && d.count > 0 && (
                              <><br />{d.count} symptom{d.count !== 1 ? "s" : ""}</>
                            )}
                          </div>
                          <div className="db-bar-track">
                            <div
                              className="db-bar-fill"
                              style={{
                                height:     `${pct}%`,
                                background: activeConfig.color,
                                opacity:    isToday ? 1 : 0.6,
                                border:     isToday ? `2px solid ${activeConfig.color}` : "none",
                              }}
                            />
                          </div>
                          <div className={`db-bar-day ${isToday ? "today" : ""}`}>
                            {d.day}
                            {isToday && <span className="db-today-dot" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="db-graph-legend">
              <span className="db-legend-dot" style={{ background: activeConfig.color }} />
              {activeConfig.label} ({activeConfig.unit})
              <span className="db-legend-today">■ Today</span>
            </div>
          </div>

          {/* ── Wellness Score (full embed) ── */}
          <div className="db-card db-wellness-embed">
            <WellnessScore />
          </div>

          <footer className="db-footer">© 2025 PCOS Care. All rights reserved.</footer>
        </div>
      </main>
    </div>
  );
}