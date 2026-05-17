import { useState, useEffect } from "react";
import api from "../services/api";
import "./Diet.css";

const RECOMMENDED_MEALS = [
  { icon: "🥣", name: "Oats with Chia Seeds", cal: 280, tag: "Breakfast", benefit: "Low GI, hormone balance" },
  { icon: "🥗", name: "Spinach & Lentil Salad", cal: 320, tag: "Lunch", benefit: "Iron-rich, anti-inflammatory" },
  { icon: "🍳", name: "Egg White Omelette", cal: 180, tag: "Breakfast", benefit: "High protein, low carb" },
  { icon: "🥦", name: "Steamed Broccoli & Tofu", cal: 210, tag: "Dinner", benefit: "Estrogen balance" },
  { icon: "🫐", name: "Berry Smoothie", cal: 150, tag: "Snack", benefit: "Antioxidant-rich" },
  { icon: "🍠", name: "Sweet Potato Bowl", cal: 340, tag: "Lunch", benefit: "Complex carbs, fiber" },
];

const PCOS_SEEDS = [
  { icon: "🌿", name: "Flax Seeds", dose: "1 tbsp/day", benefit: "Balances estrogen, omega-3 rich", phase: "Days 1–14" },
  { icon: "🌻", name: "Pumpkin Seeds", dose: "1 tbsp/day", benefit: "Zinc-rich, boosts progesterone", phase: "Days 1–14" },
  { icon: "🌾", name: "Sesame Seeds", dose: "1 tbsp/day", benefit: "Lignans support hormone balance", phase: "Days 15–28" },
  { icon: "🌼", name: "Sunflower Seeds", dose: "1 tbsp/day", benefit: "Vitamin E, supports luteal phase", phase: "Days 15–28" },
];

const PCOS_TEAS = [
  { icon: "🍵", name: "Spearmint Tea", benefit: "Reduces androgens (anti-androgen effect)", cups: "2 cups/day" },
  { icon: "🌸", name: "Cinnamon Tea", benefit: "Improves insulin sensitivity", cups: "1 cup/day" },
  { icon: "🍃", name: "Green Tea", benefit: "Antioxidants, boosts metabolism", cups: "2 cups/day" },
  { icon: "🌼", name: "Chamomile Tea", benefit: "Reduces stress & cortisol levels", cups: "1 cup/day" },
  { icon: "🌿", name: "Licorice Root Tea", benefit: "Balances cortisol, supports adrenals", cups: "1 cup/day" },
];

const DAILY_CALORIE_GOAL = 1800;
const DAILY_WATER_GOAL   = 8;
const TODAY = new Date().toISOString().slice(0, 10);

export default function Diet() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [mealsEaten,   setMealsEaten]   = useState([]);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [waterLogs,    setWaterLogs]    = useState([]);
  const [seedLogs,     setSeedLogs]     = useState([]);
  const [teaLogs,      setTeaLogs]      = useState([]);
  const [addedMeals,   setAddedMeals]   = useState([]);
  // const [_docId,        setDocId]        = useState(null); // today's DietLog _id

  const [mealInput,  setMealInput]  = useState({ name: "", cal: "", time: "" });
  const [waterInput, setWaterInput] = useState({ amount: "", time: "" });
  const [seedInput,  setSeedInput]  = useState({ name: "", dose: "", time: "" });
  const [teaInput,   setTeaInput]   = useState({ name: "", cups: "", time: "" });

  const [showMealForm,  setShowMealForm]  = useState(false);
  const [showWaterForm, setShowWaterForm] = useState(false);
  const [showSeedForm,  setShowSeedForm]  = useState(false);
  const [showTeaForm,   setShowTeaForm]   = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  // ── Load today's log on mount ──────────────────────────────────────────────
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/diet-logs");
        if (res.data.success) {
          const todayLog = res.data.data.find(d => d.date === TODAY);
          if (todayLog) {
            setDocId(todayLog._id);
            setMealsEaten(todayLog.meals       || []);
            setWaterLogs(todayLog.waterLogs    || []);
            setSeedLogs(todayLog.seedLogs      || []);
            setTeaLogs(todayLog.teaLogs        || []);
            setWaterGlasses(todayLog.waterGlasses || 0);
            setAddedMeals((todayLog.meals || []).map(m => m.name));
          }
        }
      } catch (err) {
        console.error("Failed to load diet logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // ── Helper: save full day to backend ──────────────────────────────────────
  const saveToBackend = async (updatedMeals, updatedWaterLogs, updatedSeedLogs, updatedTeaLogs) => {
    setSaving(true);
    try {
      const res = await api.post("/diet-logs", {
        date:      TODAY,
        meals:     updatedMeals,
        waterLogs: updatedWaterLogs,
        seedLogs:  updatedSeedLogs,
        teaLogs:   updatedTeaLogs,
      });
      if (res.data.success) {
        setDocId(res.data.data._id);
      }
    } catch (err) {
      console.error("Failed to save diet log:", err);
    } finally {
      setSaving(false);
    }
  };

  // ── Derived values ─────────────────────────────────────────────────────────
  const totalCal  = mealsEaten.reduce((sum, m) => sum + Number(m.cal), 0);
  const remaining = DAILY_CALORIE_GOAL - totalCal;
  const calPct    = Math.min((totalCal / DAILY_CALORIE_GOAL) * 100, 100);
  const waterPct  = Math.min((waterGlasses / DAILY_WATER_GOAL) * 100, 100);

  // ── Meals ──────────────────────────────────────────────────────────────────
  const addMeal = async () => {
    if (!mealInput.name || !mealInput.cal) return;
    const newMeal = { ...mealInput, cal: Number(mealInput.cal) };
    const updated = [...mealsEaten, newMeal];
    setMealsEaten(updated);
    setMealInput({ name: "", cal: "", time: "" });
    setShowMealForm(false);
    await saveToBackend(updated, waterLogs, seedLogs, teaLogs);
  };

  const removeMeal = async (index) => {
    const updated = mealsEaten.filter((_, i) => i !== index);
    setMealsEaten(updated);
    setAddedMeals(updated.map(m => m.name));
    await saveToBackend(updated, waterLogs, seedLogs, teaLogs);
  };

  const addRecommendedMeal = async (meal) => {
    if (addedMeals.includes(meal.name)) return;
    const newMeal = {
      name: meal.name,
      cal:  meal.cal,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [...mealsEaten, newMeal];
    setMealsEaten(updated);
    setAddedMeals(p => [...p, meal.name]);
    await saveToBackend(updated, waterLogs, seedLogs, teaLogs);
  };

  // ── Water ──────────────────────────────────────────────────────────────────
  const addWater = async () => {
    const glasses = Number(waterInput.amount) || 1;
    const newLog  = {
      amount:  `${glasses} glass${glasses > 1 ? "es" : ""}`,
      glasses,
      time:    waterInput.time || "Now",
    };
    const updatedLogs    = [...waterLogs, newLog];
    const updatedGlasses = Math.min(waterGlasses + glasses, DAILY_WATER_GOAL);
    setWaterLogs(updatedLogs);
    setWaterGlasses(updatedGlasses);
    setWaterInput({ amount: "", time: "" });
    setShowWaterForm(false);
    await saveToBackend(mealsEaten, updatedLogs, seedLogs, teaLogs);
  };

  const removeWaterLog = async (index) => {
    const removed        = waterLogs[index];
    const updatedLogs    = waterLogs.filter((_, i) => i !== index);
    const updatedGlasses = Math.max(0, waterGlasses - (removed.glasses || 1));
    setWaterLogs(updatedLogs);
    setWaterGlasses(updatedGlasses);
    await saveToBackend(mealsEaten, updatedLogs, seedLogs, teaLogs);
  };

  const handleGlassClick = async (i) => {
    const newGlasses = i + 1;
    setWaterGlasses(newGlasses);
    // Update waterLogs to reflect the new glass count
    const updatedLogs = waterLogs.length > 0 ? waterLogs : [{ amount: `${newGlasses} glasses`, glasses: newGlasses, time: "Now" }];
    await saveToBackend(mealsEaten, updatedLogs, seedLogs, teaLogs);
  };

  // ── Seeds ──────────────────────────────────────────────────────────────────
  const addSeed = async () => {
    if (!seedInput.name) return;
    const newSeed  = { ...seedInput, time: seedInput.time || "Now" };
    const updated  = [...seedLogs, newSeed];
    setSeedLogs(updated);
    setSeedInput({ name: "", dose: "", time: "" });
    setShowSeedForm(false);
    await saveToBackend(mealsEaten, waterLogs, updated, teaLogs);
  };

  const removeSeedLog = async (index) => {
    const updated = seedLogs.filter((_, i) => i !== index);
    setSeedLogs(updated);
    await saveToBackend(mealsEaten, waterLogs, updated, teaLogs);
  };

  const addSeedFromCard = async (seed) => {
    const newSeed = {
      name: seed.name,
      dose: seed.dose,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [...seedLogs, newSeed];
    setSeedLogs(updated);
    await saveToBackend(mealsEaten, waterLogs, updated, teaLogs);
  };

  // ── Teas ───────────────────────────────────────────────────────────────────
  const addTea = async () => {
    if (!teaInput.name) return;
    const newTea  = { ...teaInput, time: teaInput.time || "Now" };
    const updated = [...teaLogs, newTea];
    setTeaLogs(updated);
    setTeaInput({ name: "", cups: "", time: "" });
    setShowTeaForm(false);
    await saveToBackend(mealsEaten, waterLogs, seedLogs, updated);
  };

  const removeTeaLog = async (index) => {
    const updated = teaLogs.filter((_, i) => i !== index);
    setTeaLogs(updated);
    await saveToBackend(mealsEaten, waterLogs, seedLogs, updated);
  };

  const addTeaFromCard = async (tea) => {
    const newTea = {
      name: tea.name,
      cups: tea.cups,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [...teaLogs, newTea];
    setTeaLogs(updated);
    await saveToBackend(mealsEaten, waterLogs, seedLogs, updated);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="diet-page">
        <div style={{ textAlign: "center", padding: "4rem", color: "#9b89cc" }}>
          Loading your diet data...
        </div>
      </div>
    );
  }

  return (
    <div className="diet-page">

      <div className="diet-header">
        <div className="diet-eyebrow">Diet Tracker</div>
        <h1 className="diet-title">Your <em>daily</em> nutrition</h1>
        <p className="diet-sub">Track what you eat, stay hydrated, and follow PCOS-friendly habits</p>
        {saving && <p style={{ color: "#9b89cc", fontSize: "13px", marginTop: "4px" }}>Saving...</p>}
      </div>

      <div className="diet-grid">

        {/* Calorie Overview */}
        <div className="diet-card diet-full">
          <div className="diet-card-header">
            <div>
              <div className="diet-label">Calories Overview</div>
              <div className="diet-cal-nums">
                <span className="diet-cal-eaten">{totalCal}</span>
                <span className="diet-cal-sep"> / </span>
                <span className="diet-cal-goal">{DAILY_CALORIE_GOAL} kcal</span>
              </div>
            </div>
            <div className="diet-cal-badges">
              <div className="diet-badge green">✅ Eaten: {totalCal} kcal</div>
              <div className={`diet-badge ${remaining >= 0 ? "purple" : "red"}`}>
                {remaining >= 0 ? `🔥 Remaining: ${remaining} kcal` : `⚠️ Over by ${Math.abs(remaining)} kcal`}
              </div>
            </div>
          </div>
          <div className="diet-progress-wrap">
            <div className="diet-progress-bar">
              <div className={`diet-progress-fill ${remaining < 0 ? "over" : ""}`} style={{ width: `${calPct}%` }} />
            </div>
            <span className="diet-progress-pct">{Math.round(calPct)}%</span>
          </div>
          <div className="diet-macro-row">
            {[
              { label: "Carbs",    pct: "45%", color: "#f9a8d4" },
              { label: "Proteins", pct: "25%", color: "#93c5fd" },
              { label: "Fats",     pct: "20%", color: "#86efac" },
              { label: "Fiber",    pct: "10%", color: "#fde68a" },
            ].map((m) => (
              <div className="diet-macro-item" key={m.label}>
                <div className="diet-macro-dot" style={{ background: m.color }} />
                <span>{m.label}</span>
                <strong>{m.pct}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Meals Eaten */}
        <div className="diet-card">
          <div className="diet-card-header">
            <div className="diet-label">What I Ate Today 🍽️</div>
            <button className="diet-add-btn" onClick={() => setShowMealForm(!showMealForm)}>
              {showMealForm ? "✕ Cancel" : "+ Add Meal"}
            </button>
          </div>
          {showMealForm && (
            <div className="diet-form">
              <input className="diet-input" placeholder="Meal name" value={mealInput.name}
                onChange={(e) => setMealInput((p) => ({ ...p, name: e.target.value }))} />
              <input className="diet-input" type="number" placeholder="Calories (kcal)" value={mealInput.cal}
                onChange={(e) => setMealInput((p) => ({ ...p, cal: e.target.value }))} />
              <input className="diet-input" type="time" value={mealInput.time}
                onChange={(e) => setMealInput((p) => ({ ...p, time: e.target.value }))} />
              <button className="diet-save-btn" onClick={addMeal}>Save Meal</button>
            </div>
          )}
          <div className="diet-list">
            {mealsEaten.map((m, i) => (
              <div className="diet-list-row" key={i}>
                <div className="diet-list-icon">🍴</div>
                <div className="diet-list-info">
                  <div className="diet-list-name">{m.name}</div>
                  <div className="diet-list-meta">{m.time}</div>
                </div>
                <div className="diet-list-cal">{m.cal} kcal</div>
                <button className="diet-remove-btn" onClick={() => removeMeal(i)} title="Remove meal">✕</button>
              </div>
            ))}
            {mealsEaten.length === 0 && <p className="diet-empty">No meals logged yet</p>}
          </div>
        </div>

        {/* Recommended Meals */}
        <div className="diet-card">
          <div className="diet-card-header">
            <div className="diet-label">Recommended for PCOS 💜</div>
          </div>
          <div className="diet-rec-list">
            {RECOMMENDED_MEALS.map((m, i) => (
              <div className="diet-rec-row" key={i}>
                <div className="diet-rec-icon">{m.icon}</div>
                <div className="diet-rec-info">
                  <div className="diet-rec-name">{m.name}</div>
                  <div className="diet-rec-benefit">{m.benefit}</div>
                  <div className="diet-rec-meta">
                    <span className="diet-rec-tag">{m.tag}</span>
                    <span className="diet-rec-cal">{m.cal} kcal</span>
                  </div>
                </div>
                <button
                  className={`diet-rec-add ${addedMeals.includes(m.name) ? "added" : ""}`}
                  onClick={() => addRecommendedMeal(m)}
                >
                  {addedMeals.includes(m.name) ? "✓" : "+"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Water Intake */}
        <div className="diet-card">
          <div className="diet-card-header">
            <div className="diet-label">Water Intake 💧</div>
            <button className="diet-add-btn" onClick={() => setShowWaterForm(!showWaterForm)}>
              {showWaterForm ? "✕ Cancel" : "+ Add"}
            </button>
          </div>
          {showWaterForm && (
            <div className="diet-form">
              <input className="diet-input" type="number" placeholder="No. of glasses" value={waterInput.amount}
                onChange={(e) => setWaterInput((p) => ({ ...p, amount: e.target.value }))} />
              <input className="diet-input" type="time" value={waterInput.time}
                onChange={(e) => setWaterInput((p) => ({ ...p, time: e.target.value }))} />
              <button className="diet-save-btn" onClick={addWater}>Log Water</button>
            </div>
          )}
          <div className="diet-water-glasses">
            {Array.from({ length: DAILY_WATER_GOAL }).map((_, i) => (
              <div key={i}
                className={`diet-glass ${i < waterGlasses ? "filled" : ""}`}
                onClick={() => handleGlassClick(i)}
                title={`${i + 1} glass${i > 0 ? "es" : ""}`}
              >
                💧
              </div>
            ))}
          </div>
          <div className="diet-water-progress">
            <div className="diet-progress-bar">
              <div className="diet-progress-fill water" style={{ width: `${waterPct}%` }} />
            </div>
            <span className="diet-water-count">{waterGlasses} / {DAILY_WATER_GOAL} glasses</span>
          </div>
          <div className="diet-list" style={{ marginTop: "1rem" }}>
            {waterLogs.map((w, i) => (
              <div className="diet-list-row" key={i}>
                <div className="diet-list-icon">💧</div>
                <div className="diet-list-info">
                  <div className="diet-list-name">{w.amount}</div>
                </div>
                <div className="diet-list-meta">{w.time}</div>
                <button className="diet-remove-btn" onClick={() => removeWaterLog(i)} title="Remove log">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* PCOS Seeds */}
        <div className="diet-card">
          <div className="diet-card-header">
            <div className="diet-label">PCOS Seed Cycling 🌿</div>
            <button className="diet-add-btn" onClick={() => setShowSeedForm(!showSeedForm)}>
              {showSeedForm ? "✕ Cancel" : "+ Log Seed"}
            </button>
          </div>
          {showSeedForm && (
            <div className="diet-form">
              <select className="diet-input" value={seedInput.name}
                onChange={(e) => setSeedInput((p) => ({ ...p, name: e.target.value }))}>
                <option value="">Select seed</option>
                {PCOS_SEEDS.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
              <input className="diet-input" placeholder="Dose (e.g. 1 tbsp)" value={seedInput.dose}
                onChange={(e) => setSeedInput((p) => ({ ...p, dose: e.target.value }))} />
              <input className="diet-input" type="time" value={seedInput.time}
                onChange={(e) => setSeedInput((p) => ({ ...p, time: e.target.value }))} />
              <button className="diet-save-btn" onClick={addSeed}>Log Seed</button>
            </div>
          )}
          <div className="diet-seed-cards">
            {PCOS_SEEDS.map((s, i) => (
              <div className="diet-seed-card" key={i}>
                <div className="diet-seed-top">
                  <span className="diet-seed-icon">{s.icon}</span>
                  <div>
                    <div className="diet-seed-name">{s.name}</div>
                    <div className="diet-seed-dose">{s.dose}</div>
                  </div>
                  <button className="diet-rec-add" onClick={() => addSeedFromCard(s)}>+</button>
                </div>
                <div className="diet-seed-benefit">{s.benefit}</div>
                <div className="diet-seed-phase">📅 {s.phase}</div>
              </div>
            ))}
          </div>
          {seedLogs.length > 0 && (
            <div className="diet-list" style={{ marginTop: "1rem" }}>
              <div className="diet-list-subhead">Today's seed log</div>
              {seedLogs.map((s, i) => (
                <div className="diet-list-row" key={i}>
                  <div className="diet-list-icon">🌿</div>
                  <div className="diet-list-info">
                    <div className="diet-list-name">{s.name}</div>
                    <div className="diet-list-meta">{s.dose}</div>
                  </div>
                  <div className="diet-list-meta">{s.time}</div>
                  <button className="diet-remove-btn" onClick={() => removeSeedLog(i)} title="Remove log">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PCOS Teas */}
        <div className="diet-card diet-full">
          <div className="diet-card-header">
            <div className="diet-label">PCOS-Friendly Teas 🍵</div>
            <button className="diet-add-btn" onClick={() => setShowTeaForm(!showTeaForm)}>
              {showTeaForm ? "✕ Cancel" : "+ Log Tea"}
            </button>
          </div>
          {showTeaForm && (
            <div className="diet-form diet-form-inline">
              <select className="diet-input" value={teaInput.name}
                onChange={(e) => setTeaInput((p) => ({ ...p, name: e.target.value }))}>
                <option value="">Select tea</option>
                {PCOS_TEAS.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
              </select>
              <input className="diet-input" placeholder="Cups" value={teaInput.cups}
                onChange={(e) => setTeaInput((p) => ({ ...p, cups: e.target.value }))} />
              <input className="diet-input" type="time" value={teaInput.time}
                onChange={(e) => setTeaInput((p) => ({ ...p, time: e.target.value }))} />
              <button className="diet-save-btn" onClick={addTea}>Log Tea</button>
            </div>
          )}
          <div className="diet-tea-grid">
            {PCOS_TEAS.map((t, i) => (
              <div className="diet-tea-card" key={i}>
                <div className="diet-tea-top">
                  <span className="diet-tea-icon">{t.icon}</span>
                  <button className="diet-rec-add" onClick={() => addTeaFromCard(t)}>+</button>
                </div>
                <div className="diet-tea-name">{t.name}</div>
                <div className="diet-tea-benefit">{t.benefit}</div>
                <div className="diet-tea-cups">☕ {t.cups}</div>
              </div>
            ))}
          </div>
          {teaLogs.length > 0 && (
            <div className="diet-list" style={{ marginTop: "1.25rem" }}>
              <div className="diet-list-subhead">Today's tea log</div>
              {teaLogs.map((t, i) => (
                <div className="diet-list-row" key={i}>
                  <div className="diet-list-icon">🍵</div>
                  <div className="diet-list-info">
                    <div className="diet-list-name">{t.name}</div>
                    <div className="diet-list-meta">{t.cups} cup{t.cups > 1 ? "s" : ""}</div>
                  </div>
                  <div className="diet-list-meta">{t.time}</div>
                  <button className="diet-remove-btn" onClick={() => removeTeaLog(i)} title="Remove log">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}