import { useState, useEffect } from "react";
import "./Symptoms.css";

const SYMPTOM_LIBRARY = [
  { icon: "🧴", name: "Acne", cat: "Skin" },
  { icon: "💇", name: "Hair loss", cat: "Hair" },
  { icon: "🌱", name: "Hair thinning", cat: "Hair" },
  { icon: "⚖️", name: "Weight gain", cat: "Body" },
  { icon: "😴", name: "Fatigue", cat: "Energy" },
  { icon: "😟", name: "Mood swings", cat: "Mental" },
  { icon: "😰", name: "Anxiety", cat: "Mental" },
  { icon: "🍽️", name: "Bloating", cat: "Digestive" },
  { icon: "🌡️", name: "Cramps", cat: "Pain" },
  { icon: "🤕", name: "Headache", cat: "Pain" },
  { icon: "🌙", name: "Insomnia", cat: "Sleep" },
  { icon: "💧", name: "Oily skin", cat: "Skin" },
  { icon: "🍬", name: "Sugar cravings", cat: "Digestive" },
  { icon: "🩸", name: "Irregular periods", cat: "Cycle" },
  { icon: "❄️", name: "Cold hands/feet", cat: "Body" },
  { icon: "💪", name: "Joint pain", cat: "Pain" },
];

const CATS = ["All", ...Array.from(new Set(SYMPTOM_LIBRARY.map((s) => s.cat)))];

const getLabel = (v) => ["None", "Mild", "Moderate", "Severe"][v];
const getBadgeClass = (v) => ["badge-none", "badge-mild", "badge-mod", "badge-sev"][v];
const getTrackColor = (v) => ["#EDE8FF", "#C9BCFF", "#E09ED6", "#993356"][v];

export default function Symptoms() {
  const [activeSymptoms, setActiveSymptoms] = useState(["Acne", "Fatigue", "Cramps"]);
  const [values, setValues] = useState({});
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState([]);
  const [saved, setSaved] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    fetch("/api/v1/symptom-logs", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => { if (data.success) setHistory(data.data); })
      .catch(() => {});
  }, []);

  const toggleSymptom = (name) => {
    setActiveSymptoms((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
    if (activeSymptoms.includes(name)) {
      setValues((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const updateVal = (name, v) =>
    setValues((prev) => ({ ...prev, [name]: parseInt(v) }));

  const getVal = (name) => values[name] ?? 0;

  const mildCount = activeSymptoms.filter((n) => getVal(n) === 1).length;
  const modCount  = activeSymptoms.filter((n) => getVal(n) === 2).length;
  const sevCount  = activeSymptoms.filter((n) => getVal(n) === 3).length;

  const filteredLibrary = SYMPTOM_LIBRARY.filter((s) => {
    const matchCat = filterCat === "All" || s.cat === filterCat;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const saveLog = async () => {
    const active = activeSymptoms
      .filter((n) => getVal(n) > 0)
      .map((n) => ({ name: n, severity: getVal(n) }));
    if (!active.length) return;

    try {
      const res = await fetch("/api/v1/symptom-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ symptoms: active, notes }),
      });
      if (!res.ok) throw new Error("Failed");

      const today = new Date().toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      });
      setHistory((prev) => [{ date: today, symptoms: active }, ...prev]);
      setValues({});
      setNotes("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="sym-page">

      {/* Header */}
      <div className="sym-header">
        <div className="sym-eyebrow">Symptom Tracker</div>
        <h1 className="sym-title">Track your <em>daily</em> symptoms</h1>
        <p className="sym-sub">Add the symptoms you experience, rate their severity, and spot patterns over time</p>
      </div>

      <div className="sym-grid">

        {/* ── Summary cards ── */}
        <div className="sym-card sym-full">
          <div className="sym-card-header">
            <div className="sym-label">Today's summary</div>
          </div>
          <div className="sym-summary">
            <div className="sym-sum-card tracking">
              <div className="sym-sum-num">{activeSymptoms.length}</div>
              <div className="sym-sum-lbl">Tracking</div>
            </div>
            <div className="sym-sum-card mild">
              <div className="sym-sum-num">{mildCount}</div>
              <div className="sym-sum-lbl">Mild</div>
            </div>
            <div className="sym-sum-card mod">
              <div className="sym-sum-num">{modCount}</div>
              <div className="sym-sum-lbl">Moderate</div>
            </div>
            <div className="sym-sum-card sev">
              <div className="sym-sum-num">{sevCount}</div>
              <div className="sym-sum-lbl">Severe</div>
            </div>
          </div>
        </div>

        {/* ── My symptoms + log ── */}
        <div className="sym-card sym-two-thirds">
          <div className="sym-card-header">
            <div className="sym-label">My symptoms</div>
            <button className="sym-add-btn" onClick={() => setShowLibrary((p) => !p)}>
              {showLibrary ? "✕ Close" : "+ Add / Remove"}
            </button>
          </div>

          {activeSymptoms.length === 0 && (
            <p className="sym-empty">No symptoms added yet. Click "+ Add / Remove" to get started.</p>
          )}

          {activeSymptoms.map((name) => {
            const sym = SYMPTOM_LIBRARY.find((s) => s.name === name) || { icon: "🔵", name, cat: "" };
            const v = getVal(name);
            const pct = (v / 3) * 100;
            return (
              <div className="sym-row" key={name}>
                <div className="sym-row-top">
                  <div className="sym-row-left">
                    <div className="sym-icon">{sym.icon}</div>
                    <div>
                      <div className="sym-name">{sym.name}</div>
                      <div className="sym-cat">{sym.cat}</div>
                    </div>
                  </div>
                  <div className="sym-row-right">
                    <span className={`sym-badge ${getBadgeClass(v)}`}>{getLabel(v)}</span>
                    <button className="sym-remove-btn" onClick={() => toggleSymptom(name)} title="Remove symptom">✕</button>
                  </div>
                </div>
                <div className="sym-slider-wrap">
                  <input
                    type="range"
                    className="sym-slider"
                    min="0" max="3" step="1"
                    value={v}
                    onChange={(e) => updateVal(name, e.target.value)}
                    style={{
                      background: `linear-gradient(to right, ${getTrackColor(v)} ${pct}%, #EDE8FF ${pct}%)`,
                    }}
                  />
                </div>
                <div className="sym-slider-labels">
                  <span>None</span><span>Mild</span><span>Moderate</span><span>Severe</span>
                </div>
              </div>
            );
          })}

          {/* Notes + Save */}
          {activeSymptoms.length > 0 && (
            <div className="sym-notes-section">
              <div className="sym-label" style={{ marginBottom: "8px" }}>Notes</div>
              <textarea
                className="sym-notes"
                placeholder="Any other things you noticed — energy, stress, sleep quality..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="sym-save-row">
                {saved && <span className="sym-saved-msg">✓ Saved!</span>}
                <button className="sym-save-btn" onClick={saveLog}>Save today's log →</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Symptom Library ── */}
        <div className="sym-card sym-one-third">
          <div className="sym-card-header">
            <div className="sym-label">Symptom library</div>
          </div>

          <input
            className="sym-search"
            placeholder="Search symptoms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="sym-cat-filters">
            {CATS.map((c) => (
              <button
                key={c}
                className={`sym-cat-btn ${filterCat === c ? "active" : ""}`}
                onClick={() => setFilterCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="sym-library-list">
            {filteredLibrary.map((s) => {
              const added = activeSymptoms.includes(s.name);
              return (
                <div className={`sym-lib-row ${added ? "added" : ""}`} key={s.name}>
                  <span className="sym-lib-icon">{s.icon}</span>
                  <div className="sym-lib-info">
                    <div className="sym-lib-name">{s.name}</div>
                    <div className="sym-lib-cat">{s.cat}</div>
                  </div>
                  <button
                    className={`sym-lib-btn ${added ? "remove" : "add"}`}
                    onClick={() => toggleSymptom(s.name)}
                  >
                    {added ? "✕" : "+"}
                  </button>
                </div>
              );
            })}
            {filteredLibrary.length === 0 && (
              <p className="sym-empty">No symptoms match your search.</p>
            )}
          </div>
        </div>

        {/* ── History ── */}
        <div className="sym-card sym-full">
          <div className="sym-card-header">
            <div className="sym-label">Recent logs</div>
          </div>
          {history.length === 0 && (
            <p className="sym-empty">No logs yet. Start tracking today!</p>
          )}
          {history.map((h, i) => (
            <div className="sym-hist-row" key={i}>
              <div className="sym-hist-date">{h.date}</div>
              <div className="sym-hist-pills">
                {h.symptoms.map((s, j) => (
                  <span className={`sym-hist-pill ${getBadgeClass(s.severity)}`} key={j}>
                    {s.name} · {getLabel(s.severity)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}