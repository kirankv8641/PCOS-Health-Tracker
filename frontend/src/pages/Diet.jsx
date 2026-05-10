import { useState } from "react";
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
const DAILY_WATER_GOAL = 8;

export default function Diet() {
  const [mealsEaten, setMealsEaten] = useState([
    { name: "Oats with Milk", cal: 280, time: "08:00 AM" },
    { name: "Dal & Rice", cal: 420, time: "01:00 PM" },
  ]);
  const [mealInput, setMealInput] = useState({ name: "", cal: "", time: "" });
  const [showMealForm, setShowMealForm] = useState(false);

  const [waterGlasses, setWaterGlasses] = useState(3);
  const [waterLogs, setWaterLogs] = useState([
    { amount: "1 glass", glasses: 1, time: "07:30 AM" },
    { amount: "2 glasses", glasses: 2, time: "10:00 AM" },
  ]);
  const [waterInput, setWaterInput] = useState({ amount: "", time: "" });
  const [showWaterForm, setShowWaterForm] = useState(false);

  const [seedLogs, setSeedLogs] = useState([]);
  const [seedInput, setSeedInput] = useState({ name: "", dose: "", time: "" });
  const [showSeedForm, setShowSeedForm] = useState(false);

  const [teaLogs, setTeaLogs] = useState([]);
  const [teaInput, setTeaInput] = useState({ name: "", cups: "", time: "" });
  const [showTeaForm, setShowTeaForm] = useState(false);

  const [addedMeals, setAddedMeals] = useState([]);

  const totalCal = mealsEaten.reduce((sum, m) => sum + Number(m.cal), 0);
  const remaining = DAILY_CALORIE_GOAL - totalCal;
  const calPct = Math.min((totalCal / DAILY_CALORIE_GOAL) * 100, 100);
  const waterPct = Math.min((waterGlasses / DAILY_WATER_GOAL) * 100, 100);

  const addMeal = () => {
    if (!mealInput.name || !mealInput.cal) return;
    setMealsEaten((p) => [...p, { ...mealInput, cal: Number(mealInput.cal) }]);
    setMealInput({ name: "", cal: "", time: "" });
    setShowMealForm(false);
  };

  const removeMeal = (index) => {
    setMealsEaten((p) => p.filter((_, i) => i !== index));
  };

  const addRecommendedMeal = (meal) => {
    setMealsEaten((p) => [...p, { name: meal.name, cal: meal.cal, time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }]);
    setAddedMeals((p) => [...p, meal.name]);
  };

  const addWater = () => {
    const glasses = Number(waterInput.amount) || 1;
    setWaterGlasses((p) => Math.min(p + glasses, DAILY_WATER_GOAL));
    setWaterLogs((p) => [...p, { amount: `${glasses} glass${glasses > 1 ? "es" : ""}`, glasses, time: waterInput.time || "Now" }]);
    setWaterInput({ amount: "", time: "" });
    setShowWaterForm(false);
  };

  const removeWaterLog = (index) => {
    const removed = waterLogs[index];
    setWaterGlasses((p) => Math.max(0, p - (removed.glasses || 1)));
    setWaterLogs((p) => p.filter((_, i) => i !== index));
  };

  const addSeed = () => {
    if (!seedInput.name) return;
    setSeedLogs((p) => [...p, { ...seedInput, time: seedInput.time || "Now" }]);
    setSeedInput({ name: "", dose: "", time: "" });
    setShowSeedForm(false);
  };

  const removeSeedLog = (index) => {
    setSeedLogs((p) => p.filter((_, i) => i !== index));
  };

  const addTea = () => {
    if (!teaInput.name) return;
    setTeaLogs((p) => [...p, { ...teaInput, time: teaInput.time || "Now" }]);
    setTeaInput({ name: "", cups: "", time: "" });
    setShowTeaForm(false);
  };

  const removeTeaLog = (index) => {
    setTeaLogs((p) => p.filter((_, i) => i !== index));
  };

  const addSeedFromCard = (seed) => {
    setSeedLogs((p) => [...p, { name: seed.name, dose: seed.dose, time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }]);
  };

  const addTeaFromCard = (tea) => {
    setTeaLogs((p) => [...p, { name: tea.name, cups: tea.cups, time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }]);
  };

  return (
    <div className="diet-page">

      <div className="diet-header">
        <div className="diet-eyebrow">Diet Tracker</div>
        <h1 className="diet-title">Your <em>daily</em> nutrition</h1>
        <p className="diet-sub">Track what you eat, stay hydrated, and follow PCOS-friendly habits</p>
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
              { label: "Carbs", pct: "45%", color: "#f9a8d4" },
              { label: "Proteins", pct: "25%", color: "#93c5fd" },
              { label: "Fats", pct: "20%", color: "#86efac" },
              { label: "Fiber", pct: "10%", color: "#fde68a" },
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
                  onClick={() => !addedMeals.includes(m.name) && addRecommendedMeal(m)}
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
              <div key={i} className={`diet-glass ${i < waterGlasses ? "filled" : ""}`}
                onClick={() => setWaterGlasses(i + 1)} title={`${i + 1} glass${i > 0 ? "es" : ""}`}>
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