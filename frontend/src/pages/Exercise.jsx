import { useState, useEffect } from "react";
import api from "../services/api";
import "./Exercise.css";

const EXERCISES = [
  { icon: "ti-walk", title: "Walking", tag: "Cardio", duration: "30–45 mins daily", benefit: "↓ Insulin resistance", desc: "Easy on joints, great for insulin resistance and mood.", steps: ["Start with a 5-min warm-up stroll", "Maintain a brisk but comfortable pace", "Swing arms naturally for balance", "Cool down with slow walking for 5 mins", "Aim for 7,000–10,000 steps/day"] },
  { icon: "ti-yoga", title: "Yoga", tag: "Mind-body", duration: "20–40 mins daily", benefit: "↓ Cortisol & stress", desc: "Reduces cortisol, relieves stress and anxiety, improves flexibility.", steps: ["Begin in child's pose for 2 mins", "Flow through cat-cow stretches", "Hold warrior poses for 30 secs each", "Do legs-up-the-wall for 5 mins", "End with 5-min savasana"] },
  { icon: "ti-barbell", title: "Strength Training", tag: "Strength", duration: "2–3 times/week", benefit: "↑ Metabolism", desc: "Builds muscle, boosts metabolism and hormone regulation.", steps: ["Warm up with 5 mins light cardio", "Start with bodyweight squats & lunges", "Add resistance bands or light dumbbells", "3 sets of 10–12 reps per exercise", "Rest 60 secs between sets"] },
  { icon: "ti-bike", title: "Cycling", tag: "Cardio", duration: "20–30 mins/session", benefit: "♥ Heart health", desc: "Low-impact cardio that improves heart health without overexertion.", steps: ["Adjust seat to hip height", "Start at a comfortable resistance level", "Maintain 60–80 RPM cadence", "Increase resistance gradually", "Cool down at low resistance for 5 mins"] },
  { icon: "ti-swim", title: "Swimming", tag: "Low-impact", duration: "30 mins, 3×/week", benefit: "↓ Inflammation", desc: "Full-body workout gentle on joints that reduces inflammation.", steps: ["Start with 2 easy warm-up laps", "Alternate between freestyle and breaststroke", "Rest 30 secs between laps if needed", "Focus on steady breathing rhythm", "End with gentle poolside stretching"] },
  { icon: "ti-music", title: "Dance / Zumba", tag: "Fun cardio", duration: "30–45 mins, 3×/week", benefit: "↑ Mood & energy", desc: "Boosts mood, burns calories and keeps exercise fun and sustainable.", steps: ["Start with a slow warm-up song", "Follow the beat — no perfection needed", "Focus on full-body movement", "Take water breaks every 10 mins", "End with stretching to cool down"] },
  { icon: "ti-stretching", title: "Pilates", tag: "PCOS-specific", duration: "30–45 mins, 3×/week", benefit: "↑ Insulin sensitivity", desc: "Pilates targets deep core muscles, improves insulin sensitivity and reduces pelvic pain common in PCOS.", steps: ["Begin with diaphragmatic breathing for 3 mins", "Do pelvic floor activation (Kegels) 10 reps", "Perform the hundred breathing exercise", "Move into single-leg stretches & scissors", "Finish with spinal articulation and hip circles"] },
  { icon: "ti-brand-elastic", title: "Resistance Band Training", tag: "PCOS-specific", duration: "20–30 mins, 3×/week", benefit: "↓ Androgen levels", desc: "Light resistance training helps lower androgens (testosterone), reduce facial hair, and regulate cycles without spiking cortisol.", steps: ["Choose a light-to-medium resistance band", "Perform banded squats — 3 sets × 12 reps", "Banded lateral walks — 3 × 15 each side", "Standing rows and shoulder press — 3 × 10", "Cool down with hip flexor and glute stretches"] },
  { icon: "ti-tree", title: "Mindful Walking in Nature", tag: "PCOS-specific", duration: "20–30 mins daily", benefit: "↓ Cortisol & anxiety", desc: "Green-space walking uniquely lowers cortisol and reduces anxiety — both key drivers of PCOS flare-ups. More effective than indoor walking.", steps: ["Find a park, garden, or tree-lined path", "Leave headphones behind — focus on sounds", "Walk at a gentle, relaxed pace", "Pause and observe your surroundings every 5 mins", "Practice slow nasal breathing throughout"] },
  { icon: "ti-heart-rate-monitor", title: "PCOS Stretching Routine", tag: "PCOS-specific", duration: "15–20 mins daily", benefit: "↓ Pelvic pain", desc: "Targeted stretching reduces pelvic tension, bloating and cramping — common PCOS symptoms.", steps: ["Butterfly stretch: 60 secs", "Supine spinal twist: 30 secs each side", "Supported bridge pose: 45 secs × 3", "Happy baby pose: 60 secs", "Child's pose with side reach: 45 secs each"] },
  { icon: "ti-run", title: "Low-Intensity Jogging", tag: "PCOS-specific", duration: "20–25 mins, 2–3×/week", benefit: "↓ Blood sugar spikes", desc: "Steady-state low-intensity jogging (not sprinting) helps flatten post-meal glucose spikes without over-stressing adrenals.", steps: ["Start with 5-min brisk walk to warm up", "Jog at a pace where you can hold a conversation", "Maintain steady pace — no bursts or sprints", "Alternate 2 min jog / 1 min walk if needed", "End with 5-min cool-down walk and stretching"] },
  { icon: "ti-circles-relation", title: "Bodyweight Circuit (PCOS-safe)", tag: "PCOS-specific", duration: "25–35 mins, 2×/week", benefit: "↑ SHBG levels", desc: "A PCOS-safe circuit boosts SHBG (sex hormone-binding globulin), which helps reduce free testosterone and improve cycle regularity.", steps: ["Warm up: arm circles, leg swings, 2 mins", "Squats × 15, modified push-ups × 10, glute bridges × 15", "Rest 90 secs between rounds (important!)", "Complete 3 rounds at moderate pace", "Cool down with full-body stretch, 5 mins"] },
  { icon: "ti-yoga", title: "Malasana (Garland Pose)", tag: "Yoga-PCOS", duration: "1–2 mins hold, daily", benefit: "↑ Pelvic blood flow", desc: "Opens the hips and groin, improves blood circulation to the pelvic region, and helps relieve PCOS-related pelvic congestion and bloating.", steps: ["Stand with feet wider than hip-width", "Lower into a deep squat, heels flat or on a folded mat", "Bring palms together at chest in Namaste", "Use elbows to gently press knees outward", "Hold 60–90 secs, breathing deeply through the nose"] },
  { icon: "ti-butterfly", title: "Baddha Konasana (Butterfly Pose)", tag: "Yoga-PCOS", duration: "3–5 mins, daily", benefit: "↓ Ovarian cysts", desc: "Stimulates the ovaries and uterus, reduces ovarian cyst size over time, and improves reproductive organ circulation.", steps: ["Sit with spine tall, bring soles of feet together", "Hold feet with both hands, knees falling outward", "Gently flap knees up and down like butterfly wings", "Fold forward slowly, maintaining a long spine", "Hold still for final 2 mins, breathing into the belly"] },
  { icon: "ti-arrow-curve-right", title: "Dhanurasana (Bow Pose)", tag: "Yoga-PCOS", duration: "20–30 secs × 3, daily", benefit: "↑ Hormone regulation", desc: "Stimulates the adrenal glands and reproductive organs, helps regulate estrogen and progesterone, and reduces menstrual irregularity.", steps: ["Lie face-down on the mat", "Bend knees and reach back to hold ankles", "Inhale and lift chest and thighs off the mat simultaneously", "Hold the pose, breathing steadily for 20–30 secs", "Release slowly and rest in child's pose between sets"] },
  { icon: "ti-yoga", title: "Matsyasana (Fish Pose)", tag: "Yoga-PCOS", duration: "1–2 mins, daily", benefit: "↓ Thyroid dysfunction", desc: "Stretches the throat and thyroid gland, which is commonly dysregulated in PCOS, and stimulates the pineal and pituitary glands to support hormonal balance.", steps: ["Lie on your back, legs extended", "Slide hands under buttocks, palms facing down", "Inhale and lift chest, dropping the crown of the head back", "Keep weight on elbows and forearms, not the head", "Hold 60–90 secs and release slowly with a supported neck"] },
  { icon: "ti-sun", title: "Surya Namaskar (Sun Salutation)", tag: "Yoga-PCOS", duration: "6–12 rounds, daily", benefit: "↓ Insulin resistance", desc: "A complete sequence that activates every muscle group, boosts metabolism, reduces insulin resistance, and helps with weight management — a core challenge in PCOS.", steps: ["Begin in Pranamasana (prayer pose) at the mat's edge", "Flow through: raise arms → forward fold → plank → cobra → downward dog", "Step forward and rise back to standing in one fluid breath", "Each movement linked to an inhale or exhale", "Start with 6 rounds in the morning on an empty stomach"] },
  { icon: "ti-wind", title: "Anulom-Vilom (Alternate Nostril Breathing)", tag: "Yoga-PCOS", duration: "10–15 mins, daily", benefit: "↓ Cortisol & stress", desc: "Balances the nervous system, reduces cortisol levels, and calms adrenal overactivity — all critical for managing PCOS-driven hormonal chaos.", steps: ["Sit comfortably with spine upright", "Close right nostril with right thumb, inhale through left for 4 counts", "Close both nostrils, hold for 4 counts", "Release right nostril, exhale for 4 counts", "Repeat on opposite side; build to 15 mins over weeks"] },
  { icon: "ti-ear", title: "Bhramari Pranayama (Bee Breath)", tag: "Yoga-PCOS", duration: "5–10 mins, daily", benefit: "↓ Anxiety & mood swings", desc: "The humming vibration activates the vagus nerve, reducing anxiety, mood swings and emotional dysregulation commonly experienced in PCOS.", steps: ["Sit in a comfortable cross-legged position", "Close eyes and place index fingers gently on the tragus (ear flap)", "Inhale deeply through the nose", "Exhale slowly while making a continuous 'hmm' sound like a bee", "Repeat 8–12 rounds; feel the vibration in the skull and chest"] },
];

const NOT_TO_DO = [
  { icon: "ti-alert-triangle", title: "Over-exercising", desc: "Training too hard every day spikes cortisol, worsening hormone imbalances" },
  { icon: "ti-flame-off", title: "Daily HIIT without rest", desc: "High-intensity intervals are fine occasionally but not on consecutive days" },
  { icon: "ti-calendar-off", title: "Skipping rest days", desc: "Rest days are when your body repairs and regulates hormones" },
  { icon: "ti-battery-off", title: "Exercising while exhausted", desc: "Pushing through fatigue worsens adrenal stress and inflammation" },
  { icon: "ti-clock-off", title: "Skipping warm-up/cool-down", desc: "Always spend 5 mins warming up and cooling down" },
  { icon: "ti-repeat-off", title: "Irregular routine", desc: "Consistency matters far more than intensity for PCOS" },
  { icon: "ti-cut", title: "Crash-dieting + exercise", desc: "Combining very low calories with exercise spikes cortisol and worsens insulin resistance in PCOS" },
  { icon: "ti-moon-off", title: "Exercising late at night", desc: "Evening workouts after 8 PM can disrupt melatonin and cortisol cycles, worsening hormonal imbalance" },
];

// Map activity names to Tabler icons for the activity log
const ACTIVITY_ICONS = {
  "Walking":        "ti-walk",
  "Yoga":           "ti-yoga",
  "Cycling":        "ti-bike",
  "Swimming":       "ti-music",
  "Strength":       "ti-barbell",
  "Zumba":          "ti-music",
  "Pilates":        "ti-stretching",
  "Resistance Band":"ti-brand-elastic",
  "Running":        "ti-run",
  "Skipping":       "ti-jump-rope",
};

const DEFAULT_ACTIVITIES = ["Walking", "Yoga", "Cycling", "Swimming", "Strength", "Zumba", "Pilates", "Resistance Band", "Running", "Skipping"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeekStart() {
  const now  = new Date();
  const day  = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function toDateStr(date) {
  return date.toISOString().slice(0, 10);
}

export default function Exercise() {
  const [expandedEx,      setExpandedEx]      = useState(null);
  const [activeFilter,    setActiveFilter]    = useState("All");
  const [activityOptions, setActivityOptions] = useState(DEFAULT_ACTIVITIES);
  const [selectedActivity,setSelectedActivity]= useState("Walking");
  const [customActivity,  setCustomActivity]  = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [form, setForm] = useState({ duration: "", intensity: "Moderate", date: "", calories: "", notes: "" });
  const [logs,    setLogs]    = useState([]);
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Load logs from backend on mount ───────────────────────────────────────
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/exercise-logs");
        if (res.data.success) {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load exercise logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // ── Weekly bar chart data ──────────────────────────────────────────────────
  const weekStart = getWeekStart();
  const weekDays  = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return { day: DAYS[d.getDay()], date: toDateStr(d), mins: 0 };
  });
  logs.forEach((l) => {
    const entry = weekDays.find((w) => w.date === l.date);
    if (entry) entry.mins += Number(l.duration) || 0;
  });

  const totalMins = weekDays.reduce((s, d) => s + d.mins, 0);
  const maxMins   = Math.max(...weekDays.map((d) => d.mins), 1);

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

  // ── Save log to backend ────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.duration) return;
    try {
      const payload = {
        activity:  selectedActivity,
        duration:  Number(form.duration),
        intensity: form.intensity,
        date:      form.date || toDateStr(new Date()),
        calories:  Number(form.calories) || 0,
        notes:     form.notes,
      };
      const res = await api.post("/exercise-logs", payload);
      if (res.data.success) {
        setLogs((prev) => [res.data.data, ...prev]);
        setForm({ duration: "", intensity: "Moderate", date: "", calories: "", notes: "" });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save exercise log:", err);
    }
  };

  // ── Delete log from backend ────────────────────────────────────────────────
  const removeLog = async (index) => {
    const log = logs[index];
    try {
      await api.delete(`/exercise-logs/${log._id}`);
      setLogs((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete exercise log:", err);
    }
  };

  // ── Custom activity management (local only) ────────────────────────────────
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

  const filters = ["All", "PCOS-specific", "Yoga-PCOS", "Cardio", "Strength", "Mind-body", "Low-impact", "Fun cardio"];
  const filteredExercises = activeFilter === "All"
    ? EXERCISES
    : EXERCISES.filter((ex) => ex.tag === activeFilter);

  if (loading) {
    return (
      <div className="ex-page">
        <div style={{ textAlign: "center", padding: "4rem", color: "#9b89cc" }}>
          Loading your exercise data...
        </div>
      </div>
    );
  }

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
              { n: `${totalMins}`,   l: "mins this week",      sub: "Goal: 150 min",          icon: "ti-clock" },
              { n: streak > 0 ? `${streak}` : "0", l: `day streak`, sub: streak > 0 ? "Keep going!" : "Log today to start!", icon: "ti-flame" },
              { n: `${Math.min(Math.round((totalMins / 150) * 100), 100)}%`, l: "of weekly goal", sub: totalMins >= 150 ? "Goal reached!" : `${150 - totalMins} mins to go`, icon: "ti-target" },
              { n: logs.length.toString(), l: "activities logged", sub: "total",               icon: "ti-clipboard-list" },
            ].map((s, i) => (
              <div className="ex-stat" key={i}>
                <div className="ex-stat-icon-wrap">
                  <i className={`ti ${s.icon}`} aria-hidden="true" />
                </div>
                <div className="ex-stat-num">{s.n}</div>
                <div className="ex-stat-label">{s.l}</div>
                <div className="ex-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="ex-bars">
            {weekDays.map((d) => (
              <div className="ex-bar-col" key={d.day}>
                <div
                  className={`ex-bar ${d.mins === 0 ? "empty" : d.mins < 30 ? "partial" : ""}`}
                  style={{ height: d.mins > 0 ? `${(d.mins / maxMins) * 64}px` : "4px" }}
                />
                <div className="ex-bar-day">{d.day}</div>
                <div className={`ex-bar-mins ${d.mins === 0 ? "zero" : ""}`}>{d.mins > 0 ? `${d.mins}m` : "–"}</div>
              </div>
            ))}
          </div>
          {totalMins >= 150 && <div className="ex-goal-badge"><i className="ti ti-trophy" /> Weekly goal reached! Keep it up.</div>}
        </div>

        {/* ── Recommended exercises ── */}
        <div className="ex-card ex-full">
          <div className="ex-card-header">
            <div className="ex-label">Recommended exercises</div>
          </div>
          <div className="ex-filter-bar">
            {filters.map((f) => (
              <button
                key={f}
                className={`ex-filter-pill ${activeFilter === f ? "active" : ""} ${f === "PCOS-specific" ? "pcos" : ""} ${f === "Yoga-PCOS" ? "yoga-pcos" : ""}`}
                onClick={() => { setActiveFilter(f); setExpandedEx(null); }}
              >
                {f === "PCOS-specific" ? "PCOS-specific" : f === "Yoga-PCOS" ? "Yoga for PCOS" : f}
              </button>
            ))}
          </div>

          {activeFilter === "PCOS-specific" && (
            <div className="ex-pcos-banner">
              <i className="ti ti-dna-2 ex-pcos-banner-icon" aria-hidden="true" />
              <div>
                <div className="ex-pcos-banner-title">PCOS-targeted exercises</div>
                <div className="ex-pcos-banner-desc">These workouts are specifically chosen to lower androgens, improve insulin sensitivity, reduce cortisol, and support cycle regularity.</div>
              </div>
            </div>
          )}

          {activeFilter === "Yoga-PCOS" && (
            <div className="ex-pcos-banner" style={{ background: "linear-gradient(135deg, #f0fdf7 0%, #dcfce7 100%)", borderColor: "#86efac" }}>
              <i className="ti ti-leaf ex-pcos-banner-icon" aria-hidden="true" style={{ color: "#0f7a50" }} />
              <div>
                <div className="ex-pcos-banner-title" style={{ color: "#065f35" }}>Yoga & Pranayama for PCOS</div>
                <div className="ex-pcos-banner-desc" style={{ color: "#0f7a50" }}>
                  Yoga asanas (Malasana, Baddha Konasana, Dhanurasana, Matsyasana, Surya Namaskar) and pranayama (Anulom-Vilom, Bhramari) can regulate menstrual cycles, reduce cortisol, and restore hormonal balance naturally.
                </div>
              </div>
            </div>
          )}

          <div className="ex-rec-list">
            {filteredExercises.map((ex, i) => (
              <div key={ex.title} className={`ex-rec-row ${expandedEx === i ? "active" : ""} ${ex.tag === "PCOS-specific" ? "pcos-row" : ""} ${ex.tag === "Yoga-PCOS" ? "yoga-pcos-row" : ""}`}>
                <div className="ex-rec-top" onClick={() => setExpandedEx(expandedEx === i ? null : i)}>
                  <div className="ex-rec-icon">
                    <i className={`ti ${ex.icon}`} aria-hidden="true" />
                  </div>
                  <div className="ex-rec-info">
                    <div className="ex-rec-name">
                      {ex.title}
                      {ex.tag === "PCOS-specific" && <span className="ex-pcos-badge">PCOS</span>}
                      {ex.tag === "Yoga-PCOS" && <span className="ex-yoga-badge">YOGA · PCOS</span>}
                    </div>
                    <div className="ex-rec-meta">
                      <span className={`ex-rec-tag ${ex.tag === "PCOS-specific" ? "pcos-tag" : ""} ${ex.tag === "Yoga-PCOS" ? "yoga-tag" : ""}`}>{ex.tag}</span>
                      <span className="ex-rec-dur"><i className="ti ti-clock" style={{ fontSize: "10px", marginRight: "3px" }} />{ex.duration}</span>
                      <span className="ex-rec-benefit">{ex.benefit}</span>
                    </div>
                  </div>
                  <div className="ex-rec-chevron">
                    <i className={`ti ${expandedEx === i ? "ti-chevron-up" : "ti-chevron-down"}`} aria-hidden="true" />
                  </div>
                </div>
                {expandedEx === i && (
                  <div className="ex-rec-expanded">
                    <p className="ex-rec-desc">{ex.desc}</p>
                    <div className="ex-steps">
                      {ex.steps.map((s, j) => (
                        <div className="ex-step-row" key={j}>
                          <div className={`ex-step-num ${ex.tag === "PCOS-specific" ? "pcos-step" : ""} ${ex.tag === "Yoga-PCOS" ? "yoga-step" : ""}`}>{j + 1}</div>
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

        {/* ── Log form ── */}
        <div className="ex-card">
          <div className="ex-card-header">
            <div className="ex-label">Log today's activity</div>
          </div>

          <div className="ex-label-sm">Select activity</div>
          <div className="ex-act-tags">
            {activityOptions.map((a) => (
              <span key={a} className={`ex-act-tag ${selectedActivity === a ? "selected" : ""}`}
                onClick={() => setSelectedActivity(a)}>
                <i className={`ti ${ACTIVITY_ICONS[a] || "ti-activity"}`} aria-hidden="true" style={{ fontSize: "12px", marginRight: "4px" }} />
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
              <label><i className="ti ti-clock" style={{ fontSize: "11px", marginRight: "4px" }} />Duration (mins)</label>
              <input placeholder="e.g. 30" value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div className="ex-field">
              <label><i className="ti ti-bolt" style={{ fontSize: "11px", marginRight: "4px" }} />Intensity</label>
              <select value={form.intensity} onChange={(e) => setForm({ ...form, intensity: e.target.value })}>
                <option>Low</option><option>Moderate</option><option>High</option>
              </select>
            </div>
            <div className="ex-field">
              <label><i className="ti ti-calendar" style={{ fontSize: "11px", marginRight: "4px" }} />Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="ex-field">
              <label><i className="ti ti-flame" style={{ fontSize: "11px", marginRight: "4px" }} />Calories burned (est.)</label>
              <input placeholder="e.g. 180" value={form.calories}
                onChange={(e) => setForm({ ...form, calories: e.target.value })} />
            </div>
          </div>

          <div className="ex-field">
            <label><i className="ti ti-note" style={{ fontSize: "11px", marginRight: "4px" }} />Notes</label>
            <input placeholder="How did you feel? Any observations..." value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="ex-save-row">
            {saved && <span className="ex-saved-msg"><i className="ti ti-circle-check" style={{ marginRight: "4px" }} />Activity logged!</span>}
            <button className="ex-save-btn" onClick={handleSave}>
              <i className="ti ti-device-floppy" style={{ marginRight: "6px" }} />Save activity
            </button>
          </div>
        </div>

        {/* ── Activity log ── */}
        <div className="ex-card">
          <div className="ex-card-header">
            <div className="ex-label">Activity log</div>
          </div>
          {logs.length === 0 && <p className="ex-empty">No activities logged yet.</p>}
          <div className="ex-log-list">
            {logs.map((l, i) => (
              <div className="ex-log-row" key={l._id || i}>
                <div className="ex-log-top">
                  <div className="ex-log-left">
                    <div className="ex-log-icon-wrap">
                      <i className={`ti ${ACTIVITY_ICONS[l.activity] || "ti-activity"}`} aria-hidden="true" />
                    </div>
                    <div className="ex-log-activity">{l.activity}</div>
                  </div>
                  <div className="ex-log-actions">
                    <span className={`ex-log-intensity ex-intensity-${l.intensity.toLowerCase()}`}>{l.intensity}</span>
                    <button className="ex-remove-btn" onClick={() => removeLog(i)} title="Remove">✕</button>
                  </div>
                </div>
                <div className="ex-log-details">
                  <span><i className="ti ti-clock" style={{ fontSize: "10px", marginRight: "3px" }} />{l.duration} mins</span>
                  {l.calories > 0 && <span><i className="ti ti-flame" style={{ fontSize: "10px", marginRight: "3px" }} />{l.calories} kcal</span>}
                  {l.date && <span><i className="ti ti-calendar" style={{ fontSize: "10px", marginRight: "3px" }} />{l.date}</span>}
                </div>
                {l.notes && <div className="ex-log-notes"><i className="ti ti-note" style={{ fontSize: "10px", marginRight: "3px" }} />{l.notes}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── What to avoid ── */}
        <div className="ex-card ex-full">
          <div className="ex-card-header">
            <div className="ex-label">What to avoid</div>
          </div>
          <div className="ex-avoid-list">
            {NOT_TO_DO.map((w, i) => (
              <div className="ex-avoid-row" key={i}>
                <div className="ex-avoid-icon">
                  <i className={`ti ${w.icon}`} aria-hidden="true" />
                </div>
                <div className="ex-avoid-info">
                  <div className="ex-avoid-title">{w.title}</div>
                  <div className="ex-avoid-desc">{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="ex-pro-tip">
            <i className="ti ti-bulb" style={{ marginRight: "6px", color: "#7c76f4" }} />
            <strong>Pro tip:</strong> For PCOS, consistency matters far more than intensity. Start slow, build gradually, and treat rest days as part of your programme.
          </div>
        </div>

      </div>
    </div>
  );
}