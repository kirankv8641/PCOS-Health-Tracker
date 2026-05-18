import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import "./Symptoms.css";

const SYMPTOM_LIBRARY = [
  { icon: "ti-droplet",          name: "Acne",             cat: "Skin"      },
  { icon: "ti-minimize",         name: "Hair loss",         cat: "Hair"      },
  { icon: "ti-minimize",         name: "Hair thinning",     cat: "Hair"      },
  { icon: "ti-scale",            name: "Weight gain",       cat: "Body"      },
  { icon: "ti-zzz",              name: "Fatigue",           cat: "Energy"    },
  { icon: "ti-mood-sad",         name: "Mood swings",       cat: "Mental"    },
  { icon: "ti-brain",            name: "Anxiety",           cat: "Mental"    },
  { icon: "ti-cloud",            name: "Bloating",          cat: "Digestive" },
  { icon: "ti-wave-sine",        name: "Cramps",            cat: "Pain"      },
  { icon: "ti-headset",          name: "Headache",          cat: "Pain"      },
  { icon: "ti-moon",             name: "Insomnia",          cat: "Sleep"     },
  { icon: "ti-droplet",             name: "Oily skin",         cat: "Skin"      },
  { icon: "ti-candy",            name: "Sugar cravings",    cat: "Digestive" },
  { icon: "ti-calendar-off",     name: "Irregular periods", cat: "Cycle"     },
  { icon: "ti-snowflake",        name: "Cold hands/feet",   cat: "Body"      },
  { icon: "ti-bone",             name: "Joint pain",        cat: "Pain"      },
];

const CATS = ["All", ...Array.from(new Set(SYMPTOM_LIBRARY.map((s) => s.cat)))];

// Summary card icons per category
const SUMMARY_ICONS = {
  tracking: "ti-chart-line",
  mild:     "ti-circle-check",
  mod:      "ti-alert-circle",
  sev:      "ti-alert-triangle",
};

const getLabel      = (v) => ["None", "Mild", "Moderate", "Severe"][v];
const getBadgeClass = (v) => ["badge-none", "badge-mild", "badge-mod", "badge-sev"][v];
const getTrackColor = (v) => ["#EDE8FF", "#C9BCFF", "#E09ED6", "#993356"][v];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d))
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

export default function Symptoms() {
  const [activeSymptoms, setActiveSymptoms] = useState(["Acne", "Fatigue", "Cramps"]);
  const [values,         setValues]         = useState({});
  const [notes,          setNotes]          = useState("");
  const [history,        setHistory]        = useState([]);
  const [saved,          setSaved]          = useState(false);
  const [filterCat,      setFilterCat]      = useState("All");
  const [search,         setSearch]         = useState("");
  const [showLibrary,    setShowLibrary]    = useState(false);
  const [loading,        setLoading]        = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await api.get("/symptom-logs");
      if (res.data.success) {
        const logs = res.data.data || [];
        setHistory(logs);
        const today = new Date().toLocaleDateString("en-CA");
        const todayLog = logs.find((l) => l.date === today);
        if (todayLog && todayLog.symptoms.length > 0) {
          setActiveSymptoms(todayLog.symptoms.map((s) => s.name));
          const vals = {};
          todayLog.symptoms.forEach((s) => { vals[s.name] = s.severity; });
          setValues(vals);
          setNotes(todayLog.notes || "");
        }
      }
    } catch (err) {
      console.error("Failed to load symptom logs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const toggleSymptom = (name) => {
    setActiveSymptoms((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
    if (activeSymptoms.includes(name)) {
      setValues((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const updateVal = (name, v) => setValues((prev) => ({ ...prev, [name]: parseInt(v) }));
  const getVal    = (name)    => values[name] ?? 0;

  const mildCount = activeSymptoms.filter((n) => getVal(n) === 1).length;
  const modCount  = activeSymptoms.filter((n) => getVal(n) === 2).length;
  const sevCount  = activeSymptoms.filter((n) => getVal(n) === 3).length;

  const filteredLibrary = SYMPTOM_LIBRARY.filter((s) => {
    const matchCat    = filterCat === "All" || s.cat === filterCat;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const saveLog = async () => {
    const active = activeSymptoms
      .filter((n) => getVal(n) > 0)
      .map((n) => ({ name: n, severity: getVal(n) }));
    if (!active.length) return;
    try {
      const res = await api.post("/symptom-logs", { symptoms: active, notes });
      if (res.data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        setValues({});
        setNotes("");
        const updated = await api.get("/symptom-logs");
        if (updated.data.success) setHistory(updated.data.data || []);
      }
    } catch (err) {
      console.error("Failed to save symptom log:", err);
    }
  };

  const deleteLog = async (logId) => {
    try {
      await api.delete(`/symptom-logs/${logId}`);
      const updated = await api.get("/symptom-logs");
      if (updated.data.success) setHistory(updated.data.data || []);
    } catch (err) {
      console.error("Failed to delete symptom log:", err);
    }
  };

  if (loading) return (
    <div className="sym-page">
      <div style={{ textAlign: "center", padding: "4rem", color: "#9b89cc" }}>
        Loading your symptom data...
      </div>
    </div>
  );

  return (
    <div className="sym-page">
      <div className="sym-header">
        <div className="sym-eyebrow">Symptom Tracker</div>
        <h1 className="sym-title">Track your <em>daily</em> symptoms</h1>
        <p className="sym-sub">Add the symptoms you experience, rate their severity, and spot patterns over time</p>
      </div>

      <div className="sym-grid">

        {/* ── Summary ── */}
        <div className="sym-card sym-full">
          <div className="sym-card-header"><div className="sym-label">Today's summary</div></div>
          <div className="sym-summary">
            {[
              { key: "tracking", num: activeSymptoms.length, lbl: "Tracking" },
              { key: "mild",     num: mildCount,             lbl: "Mild"     },
              { key: "mod",      num: modCount,              lbl: "Moderate" },
              { key: "sev",      num: sevCount,              lbl: "Severe"   },
            ].map((s) => (
              <div className={`sym-sum-card ${s.key}`} key={s.key}>
                <div className="sym-sum-icon-wrap">
                  <i className={`ti ${SUMMARY_ICONS[s.key]}`} aria-hidden="true" />
                </div>
                <div className="sym-sum-num">{s.num}</div>
                <div className="sym-sum-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── My Symptoms ── */}
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
            const sym = SYMPTOM_LIBRARY.find((s) => s.name === name) || { icon: "ti-circle", name, cat: "" };
            const v   = getVal(name);
            const pct = (v / 3) * 100;
            return (
              <div className="sym-row" key={name}>
                <div className="sym-row-top">
                  <div className="sym-row-left">
                    <div className="sym-icon">
                      <i className={`ti ${sym.icon}`} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="sym-name">{sym.name}</div>
                      <div className="sym-cat">{sym.cat}</div>
                    </div>
                  </div>
                  <div className="sym-row-right">
                    <span className={`sym-badge ${getBadgeClass(v)}`}>{getLabel(v)}</span>
                    <button className="sym-remove-btn" onClick={() => toggleSymptom(name)} title="Remove">✕</button>
                  </div>
                </div>
                <div className="sym-slider-wrap">
                  <input type="range" className="sym-slider" min="0" max="3" step="1" value={v}
                    onChange={(e) => updateVal(name, e.target.value)}
                    style={{ background: `linear-gradient(to right, ${getTrackColor(v)} ${pct}%, #EDE8FF ${pct}%)` }}
                  />
                </div>
                <div className="sym-slider-labels">
                  <span>None</span><span>Mild</span><span>Moderate</span><span>Severe</span>
                </div>
              </div>
            );
          })}

          {activeSymptoms.length > 0 && (
            <div className="sym-notes-section">
              <div className="sym-label" style={{ marginBottom: "8px" }}>
                <i className="ti ti-note" style={{ marginRight: "6px", color: "#7c76f4" }} />
                Notes
              </div>
              <textarea className="sym-notes"
                placeholder="Any other things you noticed — energy, stress, sleep quality..."
                value={notes} onChange={(e) => setNotes(e.target.value)} />
              <div className="sym-save-row">
                {saved && (
                  <span className="sym-saved-msg">
                    <i className="ti ti-circle-check" style={{ marginRight: "4px" }} />Saved!
                  </span>
                )}
                <button className="sym-save-btn" onClick={saveLog}>
                  <i className="ti ti-device-floppy" style={{ marginRight: "6px" }} />
                  Save today's log
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Symptom Library ── */}
        <div className="sym-card sym-one-third">
          <div className="sym-card-header">
            <div className="sym-label">Symptom library</div>
          </div>
          <div className="sym-search-wrap">
            <i className="ti ti-search sym-search-icon" aria-hidden="true" />
            <input className="sym-search" placeholder="Search symptoms..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="sym-cat-filters">
            {CATS.map((c) => (
              <button key={c} className={`sym-cat-btn ${filterCat === c ? "active" : ""}`}
                onClick={() => setFilterCat(c)}>{c}</button>
            ))}
          </div>
          <div className="sym-library-list">
            {filteredLibrary.map((s) => {
              const added = activeSymptoms.includes(s.name);
              return (
                <div className={`sym-lib-row ${added ? "added" : ""}`} key={s.name}>
                  <div className="sym-lib-icon">
                    <i className={`ti ${s.icon}`} aria-hidden="true" />
                  </div>
                  <div className="sym-lib-info">
                    <div className="sym-lib-name">{s.name}</div>
                    <div className="sym-lib-cat">{s.cat}</div>
                  </div>
                  <button className={`sym-lib-btn ${added ? "remove" : "add"}`}
                    onClick={() => toggleSymptom(s.name)}>
                    {added ? "✕" : "+"}
                  </button>
                </div>
              );
            })}
            {filteredLibrary.length === 0 && <p className="sym-empty">No symptoms match your search.</p>}
          </div>
        </div>

        {/* ── Recent Logs ── */}
        <div className="sym-card sym-full">
          <div className="sym-card-header">
            <div className="sym-label">Recent logs</div>
          </div>
          {history.length === 0 && <p className="sym-empty">No logs yet. Start tracking today!</p>}
          {history.map((h, i) => (
            <div className="sym-hist-row" key={h._id || i}>
              <div className="sym-hist-header">
                <div className="sym-hist-date">
                  <i className="ti ti-calendar-event" style={{ marginRight: "6px", color: "#7c76f4" }} />
                  {formatDate(h.date)}
                </div>
                {h._id && (
                  <button className="sym-remove-btn" onClick={() => deleteLog(h._id)} title="Delete log">✕</button>
                )}
              </div>
              <div className="sym-hist-pills">
                {h.symptoms.map((s, j) => {
                  const libSym = SYMPTOM_LIBRARY.find((ls) => ls.name === s.name);
                  return (
                    <span className={`sym-hist-pill ${getBadgeClass(s.severity)}`} key={j}>
                      {libSym && <i className={`ti ${libSym.icon}`} style={{ marginRight: "4px", fontSize: "10px" }} />}
                      {s.name} · {getLabel(s.severity)}
                    </span>
                  );
                })}
              </div>
              {h.notes && (
                <div className="sym-hist-notes">
                  <i className="ti ti-note" style={{ marginRight: "4px", fontSize: "11px", color: "#9b89cc" }} />
                  {h.notes}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}