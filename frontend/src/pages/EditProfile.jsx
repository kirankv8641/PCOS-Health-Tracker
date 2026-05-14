import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfile.css";

const SYMPTOMS = [
  "cramps", "bloating", "mood swings", "headache", "fatigue",
  "back pain", "acne", "hair loss", "irregular periods", "weight gain",
  "weight loss", "insulin resistance", "excess hair growth", "sleep problems",
  "anxiety", "depression", "low libido", "pelvic pain",
];

const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={onChange}
      className={`prof-toggle ${checked ? "on" : ""}`}
    >
      <div className="prof-toggle-knob" />
    </div>
  );
}

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [form, setForm] = useState({
    name: "", email: "",
    age: "", gender: "Female", weight: "", height: "",
    lastPeriodDate: "", cycleLength: "", periodDuration: "",
    commonSymptoms: [], medicalConditions: "",
    diagnosedWithPCOS: false, affirmationsEnabled: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setForm(f => ({ ...f, ...JSON.parse(stored) }));

    axios.get("/api/v1/user/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => {
        if (res.data.success) {
          setForm(f => ({ ...f, ...res.data.data }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const toggleSymptom = (s) => {
    setForm(f => ({
      ...f,
      commonSymptoms: f.commonSymptoms.includes(s)
        ? f.commonSymptoms.filter(x => x !== s)
        : [...f.commonSymptoms, s],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put("/api/v1/user/profile", {
        name:               form.name,
        age:                form.age,
        gender:             form.gender,
        weight:             form.weight,
        height:             form.height,
        lastPeriodDate:     form.lastPeriodDate,
        cycleLength:        form.cycleLength,
        periodDuration:     form.periodDuration,
        commonSymptoms:     form.commonSymptoms,
        medicalConditions:  form.medicalConditions,
        diagnosedWithPCOS:  form.diagnosedWithPCOS,
        affirmationsEnabled: form.affirmationsEnabled,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user") || "{}"), ...form }));
      setSaved(true);
      setTimeout(() => { setSaved(false); navigate("/profile"); }, 1800);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "personal", label: "👤 Personal" },
    { key: "cycle",    label: "🩸 Cycle" },
    { key: "health",   label: "💊 Health" },
    { key: "settings", label: "⚙️ Settings" },
  ];

  const initials = form.name
    ? form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (loading) return (
    <div className="prof-page">
      <div className="prof-loading">
        <div className="prof-spinner" />
        <p>Loading…</p>
      </div>
    </div>
  );

  return (
    <div className="prof-page">
      <div className="prof-inner">

        {/* ── Header ── */}
        <div className="prof-header">
          <button className="prof-back-btn" onClick={() => navigate("/profile")}>← Back</button>
          <div className="prof-eyebrow">My Account</div>
          <h1 className="prof-title">Edit <em>profile</em></h1>
        </div>

        {/* ── Avatar ── */}
        <div className="prof-edit-avatar-row">
          <div className="prof-avatar large">{initials}</div>
          <div>
            <div className="prof-name">{form.name || "Your name"}</div>
            <div className="prof-email">{form.email}</div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="prof-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`prof-tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="prof-card prof-card-full">

          {/* Personal */}
          {activeTab === "personal" && (
            <div className="prof-form">
              <div className="prof-field">
                <label>Full name</label>
                <input
                  className="prof-input"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                />
              </div>
              <div className="prof-field">
                <label>Email</label>
                <input
                  className="prof-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  disabled
                />
                <span className="prof-field-hint">Email cannot be changed</span>
              </div>
              <div className="prof-form-grid">
                <div className="prof-field">
                  <label>Age</label>
                  <input className="prof-input" type="number" placeholder="25"
                    value={form.age} onChange={e => update("age", e.target.value)} />
                </div>
                <div className="prof-field">
                  <label>Weight (kg)</label>
                  <input className="prof-input" type="number" placeholder="60"
                    value={form.weight} onChange={e => update("weight", e.target.value)} />
                </div>
                <div className="prof-field">
                  <label>Height (cm)</label>
                  <input className="prof-input" type="number" placeholder="165"
                    value={form.height} onChange={e => update("height", e.target.value)} />
                </div>
              </div>
              <div className="prof-field">
                <label>Gender</label>
                <div className="prof-gender-grid">
                  {GENDERS.map(g => (
                    <button
                      key={g}
                      className={`prof-gender-btn ${form.gender === g ? "active" : ""}`}
                      onClick={() => update("gender", g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cycle */}
          {activeTab === "cycle" && (
            <div className="prof-form">
              <div className="prof-field">
                <label>Last period date</label>
                <input className="prof-input" type="date"
                  value={form.lastPeriodDate?.slice(0, 10) || ""}
                  onChange={e => update("lastPeriodDate", e.target.value)} />
              </div>
              <div className="prof-form-grid">
                <div className="prof-field">
                  <label>Cycle length (days)</label>
                  <input className="prof-input" type="number" min="20" max="45" placeholder="28"
                    value={form.cycleLength} onChange={e => update("cycleLength", e.target.value)} />
                </div>
                <div className="prof-field">
                  <label>Period duration (days)</label>
                  <input className="prof-input" type="number" min="1" max="10" placeholder="5"
                    value={form.periodDuration} onChange={e => update("periodDuration", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Health */}
          {activeTab === "health" && (
            <div className="prof-form">
              <div className="prof-field">
                <label>Common symptoms</label>
                <div className="prof-symptoms-grid">
                  {SYMPTOMS.map(s => {
                    const on = form.commonSymptoms?.includes(s);
                    return (
                      <button
                        key={s}
                        className={`prof-symptom-btn ${on ? "active" : ""}`}
                        onClick={() => toggleSymptom(s)}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="prof-field">
                <label>Medical conditions (optional)</label>
                <textarea
                  className="prof-textarea"
                  placeholder="e.g. PCOS, endometriosis, thyroid..."
                  value={form.medicalConditions}
                  onChange={e => update("medicalConditions", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="prof-form">
              <div className="prof-setting-row">
                <div>
                  <div className="prof-setting-label">Diagnosed with PCOS?</div>
                  <div className="prof-setting-sub">Enables PCOS-specific tracking and recommendations</div>
                </div>
                <Toggle
                  checked={form.diagnosedWithPCOS}
                  onChange={() => update("diagnosedWithPCOS", !form.diagnosedWithPCOS)}
                />
              </div>
              <div className="prof-setting-row">
                <div>
                  <div className="prof-setting-label">Daily affirmations</div>
                  <div className="prof-setting-sub">Receive positive daily reminders</div>
                </div>
                <Toggle
                  checked={form.affirmationsEnabled}
                  onChange={() => update("affirmationsEnabled", !form.affirmationsEnabled)}
                />
              </div>
            </div>
          )}

        </div>

        {/* ── Save button ── */}
        <div className="prof-save-row">
          {saved && <span className="prof-saved-msg">✓ Profile saved!</span>}
          <button
            className="prof-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>

      </div>
    </div>
  );
}