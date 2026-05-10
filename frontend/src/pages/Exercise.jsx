import { useState } from "react";
import "./Exercise.css";

const EXERCISES = [
  { icon: "🚶", title: "Walking", tag: "Cardio", duration: "30–45 mins daily", benefit: "↓ Insulin resistance", desc: "Easy on joints, great for insulin resistance and mood.", steps: ["Start with a 5-min warm-up stroll", "Maintain a brisk but comfortable pace", "Swing arms naturally for balance", "Cool down with slow walking for 5 mins", "Aim for 7,000–10,000 steps/day"] },
  { icon: "🧘", title: "Yoga", tag: "Mind-body", duration: "20–40 mins daily", benefit: "↓ Cortisol & stress", desc: "Reduces cortisol, relieves stress and anxiety, improves flexibility.", steps: ["Begin in child's pose for 2 mins", "Flow through cat-cow stretches", "Hold warrior poses for 30 secs each", "Do legs-up-the-wall for 5 mins", "End with 5-min savasana"] },
  { icon: "🏋️", title: "Strength Training", tag: "Strength", duration: "2–3 times/week", benefit: "↑ Metabolism", desc: "Builds muscle, boosts metabolism and hormone regulation.", steps: ["Warm up with 5 mins light cardio", "Start with bodyweight squats & lunges", "Add resistance bands or light dumbbells", "3 sets of 10–12 reps per exercise", "Rest 60 secs between sets"] },
  { icon: "🚴", title: "Cycling", tag: "Cardio", duration: "20–30 mins/session", benefit: "♥ Heart health", desc: "Low-impact cardio that improves heart health without overexertion.", steps: ["Adjust seat to hip height", "Start at a comfortable resistance level", "Maintain 60–80 RPM cadence", "Increase resistance gradually", "Cool down at low resistance for 5 mins"] },
  { icon: "🏊", title: "Swimming", tag: "Low-impact", duration: "30 mins, 3×/week", benefit: "↓ Inflammation", desc: "Full-body workout gentle on joints that reduces inflammation.", steps: ["Start with 2 easy warm-up laps", "Alternate between freestyle and breaststroke", "Rest 30 secs between laps if needed", "Focus on steady breathing rhythm", "End with gentle poolside stretching"] },
  { icon: "💃", title: "Dance / Zumba", tag: "Fun cardio", duration: "30–45 mins, 3×/week", benefit: "↑ Mood & energy", desc: "Boosts mood, burns calories and keeps exercise fun and sustainable.", steps: ["Start with a slow warm-up song", "Follow the beat — no perfection needed", "Focus on full-body movement", "Take water breaks every 10 mins", "End with stretching to cool down"] },
];

const NOT_TO_DO = [
  { icon: "⚡", title: "Over-exercising", desc: "Training too hard every day spikes cortisol, worsening hormone imbalances" },
  { icon: "🏃", title: "Daily HIIT without rest", desc: "High-intensity intervals are fine occasionally but not on consecutive days" },
  { icon: "😴", title: "Skipping rest days", desc: "Rest days are when your body repairs and regulates hormones" },
  { icon: "🥵", title: "Exercising while exhausted", desc: "Pushing through fatigue worsens adrenal stress and inflammation" },
  { icon: "⏭️", title: "Skipping warm-up/cool-down", desc: "Always spend 5 mins warming up and cooling down" },
  { icon: "📉", title: "Irregular routine", desc: "Consistency matters far more than intensity for PCOS" },
];

const DEFAULT_ACTIVITIES = ["Walking", "Yoga", "Cycling", "Swimming", "Strength", "Zumba", "Running", "Skipping"];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Return the Monday of the current week
function getWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function toDateStr(date) {
  return date.toISOString().slice(0, 10);
}

export default function Exercise() {
  const [expandedEx, setExpandedEx] = useState(null);
  const [activityOptions, setActivityOptions] = useState(DEFAULT_ACTIVITIES);
  const [selectedActivity, setSelectedActivity] = useState("Walking");
  const [customActivity, setCustomActivity] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [form, setForm] = useState({ duration: "", intensity: "Moderate", date: "", calories: "", notes: "" });
  const [logs, setLogs] = useState([
    { activity: "Walking", duration: "30", intensity: "Moderate", date: "2026-05-09", calories: "120", notes: "Morning walk, felt great" },
    { activity: "Yoga", duration: "25", intensity: "Low", date: "2026-05-08", calories: "80", notes: "Evening session" },
  ]);
  const [saved, setSaved] = useState(false);

  // Build week bar data from logs
  const weekStart = getWeekStart();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return { day: DAYS[(d.getDay())], date: toDateStr(d), mins: 0 };
  });
  logs.forEach((l) => {
    const entry = weekDays.find((w) => w.date === l.date);
    if (entry) entry.mins += Number(l.duration) || 0;
  });

  const totalMins = weekDays.reduce((s, d) => s + d.mins, 0);
  const maxMins = Math.max(...weekDays.map((d) => d.mins), 1);

  // Streak: consecutive days with activity ending today/yesterday
  const streak = (() => {
    let count = 0;
    const today = toDateStr(new Date());
    for (let i = weekDays.length - 1; i >= 0; i--) {
      if (weekDays[i].date > today) continue;
      if (weekDays[i].mins > 0) count++;
      else break;
    }
    return count;
  })();

  const handleSave = () => {
    if (!form.duration) return;
    setLogs((prev) => [{ activity: selectedActivity, ...form }, ...prev]);
    setForm({ duration: "", intensity: "Moderate", date: "", calories: "", notes: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const removeLog = (index) => setLogs((prev) => prev.filter((_, i) => i !== index));

  const addCustomActivity = () => {
    const trimmed = customActivity.trim();
    if (!trimmed || activityOptions.includes(trimmed)) return;
    setActivityOptions((prev) => [...prev, trimmed]);
    setSelectedActivity(trimmed);
    setCustomActivity("");
    setShowCustomInput(false);
  };

  const removeActivity = (name) => {
    setActivityOptions((prev) => prev.filter((a) => a !== name));
    if (selectedActivity === name) setSelectedActivity(activityOptions[0]);
  };

  return (
    <div className="ex-page">

      {/* ── Header ── */}
      <div className="ex-header">
        <div className="ex-eyebrow">Exercise Tracker</div>
        <h1 className="ex-title">Move your body, <em>balance your hormones</em></h1>
        <p className="ex-sub">Regular physical activity helps improve metabolism, reduce insulin resistance, and restore hormonal balance.</p>
      </div>

      <div className="ex-grid">

        {/* ── Weekly overview ── */}
        <div className="ex-card ex-full">
          <div className="ex-card-header">
            <div className="ex-label">Weekly overview</div>
          </div>
          <div className="ex-stats-row">
            {[
              { n: `${totalMins}`, l: "mins this week", sub: "Goal: 150 min" },
              { n: streak > 0 ? `${streak}` : "0", l: `day streak ${streak > 0 ? "🔥" : ""}`, sub: streak > 0 ? "Keep going!" : "Log today to start!" },
              { n: `${Math.min(Math.round((totalMins / 150) * 100), 100)}%`, l: "of weekly goal", sub: totalMins >= 150 ? "Goal reached! 🎉" : `${150 - totalMins} mins to go` },
              { n: logs.length.toString(), l: "activities logged", sub: "this week" },
            ].map((s, i) => (
              <div className="ex-stat" key={i}>
                <div className="ex-stat-num">{s.n}</div>
                <div className="ex-stat-label">{s.l}</div>
                <div className="ex-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="ex-bars">
            {weekDays.map((d) => (
              <div className="ex-bar-col" key={d.day}>
                <div className={`ex-bar ${d.mins === 0 ? "empty" : d.mins < 30 ? "partial" : ""}`}
                  style={{ height: d.mins > 0 ? `${(d.mins / maxMins) * 64}px` : "4px" }} />
                <div className="ex-bar-day">{d.day}</div>
                <div className={`ex-bar-mins ${d.mins === 0 ? "zero" : ""}`}>{d.mins > 0 ? `${d.mins}m` : "–"}</div>
              </div>
            ))}
          </div>
          {totalMins >= 150 && <div className="ex-goal-badge">🎉 Weekly goal reached! Keep it up.</div>}
        </div>

        {/* ── Recommended exercises ── */}
        <div className="ex-card ex-full">
          <div className="ex-card-header">
            <div className="ex-label">Recommended exercises 💜</div>
          </div>
          <div className="ex-rec-list">
            {EXERCISES.map((ex, i) => (
              <div key={ex.title} className={`ex-rec-row ${expandedEx === i ? "active" : ""}`}>
                <div className="ex-rec-top" onClick={() => setExpandedEx(expandedEx === i ? null : i)}>
                  <div className="ex-rec-icon">{ex.icon}</div>
                  <div className="ex-rec-info">
                    <div className="ex-rec-name">{ex.title}</div>
                    <div className="ex-rec-meta">
                      <span className="ex-rec-tag">{ex.tag}</span>
                      <span className="ex-rec-dur">⏱ {ex.duration}</span>
                      <span className="ex-rec-benefit">{ex.benefit}</span>
                    </div>
                  </div>
                  <div className="ex-rec-chevron">{expandedEx === i ? "▲" : "▼"}</div>
                </div>
                {expandedEx === i && (
                  <div className="ex-rec-expanded">
                    <p className="ex-rec-desc">{ex.desc}</p>
                    <div className="ex-steps">
                      {ex.steps.map((s, j) => (
                        <div className="ex-step-row" key={j}>
                          <div className="ex-step-num">{j + 1}</div>
                          <div className="ex-step-text">{s}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Log form (always visible) ── */}
        <div className="ex-card">
          <div className="ex-card-header">
            <div className="ex-label">Log today's activity 📝</div>
          </div>

          <div className="ex-label-sm">Select activity</div>
          <div className="ex-act-tags">
            {activityOptions.map((a) => (
              <span key={a} className={`ex-act-tag ${selectedActivity === a ? "selected" : ""}`}
                onClick={() => setSelectedActivity(a)}>
                {a}
                <button
                  className="ex-act-tag-remove"
                  onClick={(e) => { e.stopPropagation(); removeActivity(a); }}
                  title="Remove activity"
                >✕</button>
              </span>
            ))}
            <span className="ex-act-tag ex-act-tag-add" onClick={() => setShowCustomInput((p) => !p)}>
              {showCustomInput ? "✕ Cancel" : "+ Add"}
            </span>
          </div>

          {showCustomInput && (
            <div className="ex-custom-activity">
              <input
                className="ex-custom-input"
                placeholder="Type activity name..."
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomActivity()}
                autoFocus
              />
              <button className="ex-custom-add-btn" onClick={addCustomActivity}>Add</button>
            </div>
          )}

          <div className="ex-form-grid">
            <div className="ex-field">
              <label>Duration (mins)</label>
              <input placeholder="e.g. 30" value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div className="ex-field">
              <label>Intensity</label>
              <select value={form.intensity} onChange={(e) => setForm({ ...form, intensity: e.target.value })}>
                <option>Low</option><option>Moderate</option><option>High</option>
              </select>
            </div>
            <div className="ex-field">
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="ex-field">
              <label>Calories burned (est.)</label>
              <input placeholder="e.g. 180" value={form.calories}
                onChange={(e) => setForm({ ...form, calories: e.target.value })} />
            </div>
          </div>

          <div className="ex-field">
            <label>Notes</label>
            <input placeholder="How did you feel? Any observations..." value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="ex-save-row">
            {saved && <span className="ex-saved-msg">✓ Activity logged!</span>}
            <button className="ex-save-btn" onClick={handleSave}>Save activity</button>
          </div>
        </div>

        {/* ── Activity log ── */}
        <div className="ex-card">
          <div className="ex-card-header">
            <div className="ex-label">Activity log 📋</div>
          </div>
          {logs.length === 0 && <p className="ex-empty">No activities logged yet.</p>}
          <div className="ex-log-list">
            {logs.map((l, i) => (
              <div className="ex-log-row" key={i}>
                <div className="ex-log-top">
                  <div className="ex-log-activity">{l.activity}</div>
                  <div className="ex-log-actions">
                    <span className={`ex-log-intensity ex-intensity-${l.intensity.toLowerCase()}`}>{l.intensity}</span>
                    <button className="ex-remove-btn" onClick={() => removeLog(i)} title="Remove">✕</button>
                  </div>
                </div>
                <div className="ex-log-details">
                  <span>⏱ {l.duration} mins</span>
                  {l.calories && <span>🔥 {l.calories} kcal</span>}
                  {l.date && <span>📅 {l.date}</span>}
                </div>
                {l.notes && <div className="ex-log-notes">{l.notes}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── What to avoid ── */}
        <div className="ex-card ex-full">
          <div className="ex-card-header">
            <div className="ex-label">What to avoid ⚠️</div>
          </div>
          <div className="ex-avoid-list">
            {NOT_TO_DO.map((w, i) => (
              <div className="ex-avoid-row" key={i}>
                <div className="ex-avoid-icon">{w.icon}</div>
                <div className="ex-avoid-info">
                  <div className="ex-avoid-title">{w.title}</div>
                  <div className="ex-avoid-desc">{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="ex-pro-tip">
            <strong>Pro tip:</strong> For PCOS, consistency matters far more than intensity. Start slow, build gradually, and treat rest days as part of your programme.
          </div>
        </div>

      </div>
    </div>
  );
}