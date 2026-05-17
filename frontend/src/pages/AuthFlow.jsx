import { useState } from "react";
import api from "../services/api";

// ─── Constants ───────────────────────────────────────────────────────────────

const SYMPTOMS = [
  "cramps", "bloating", "mood swings", "headache", "fatigue",
  "back pain", "acne", "hair loss", "irregular periods", "weight gain",
  "weight loss", "insulin resistance", "excess hair growth", "sleep problems",
  "anxiety", "depression", "low libido", "pelvic pain",
];

const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];

// ─── Shared UI Components ────────────────────────────────────────────────────

function StepBar({ total, current }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem" }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i <= current ? "#1D9E75" : "#e5e7eb",
            transition: "background 0.2s",
          }}
        />
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      style={{
        width: "100%", padding: "9px 12px",
        border: "0.5px solid #d1d5db", borderRadius: 8,
        fontSize: 14, outline: "none", background: "#fff", color: "#111",
        boxSizing: "border-box", ...props.style,
      }}
      onFocus={e => (e.target.style.borderColor = "#1D9E75")}
      onBlur={e => (e.target.style.borderColor = "#d1d5db")}
    />
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 38, height: 22,
        background: checked ? "#1D9E75" : "#d1d5db",
        borderRadius: 99, cursor: "pointer",
        position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", width: 16, height: 16,
        background: "#fff", borderRadius: "50%",
        top: 3, left: checked ? 19 : 3, transition: "left 0.2s",
      }} />
    </div>
  );
}

function Btn({ children, primary, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1, padding: "10px 0",
        border: `0.5px solid ${primary ? "#1D9E75" : "#d1d5db"}`,
        borderRadius: 8, fontSize: 14, fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        background: primary ? "#1D9E75" : "transparent",
        color: primary ? "#fff" : "#374151",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

// ─── Register Steps ───────────────────────────────────────────────────────────

function Step1Account({ data, onChange }) {
  return (
    <>
      <Field label="Full name">
        <Input type="text" placeholder="Jane Doe" value={data.name}
          onChange={e => onChange("name", e.target.value)} />
      </Field>
      <Field label="Email">
        <Input type="email" placeholder="you@example.com" value={data.email}
          onChange={e => onChange("email", e.target.value)} />
      </Field>
      <Field label="Password">
        <Input type="password" placeholder="Min 6 characters" value={data.password}
          onChange={e => onChange("password", e.target.value)} />
      </Field>
    </>
  );
}

function Step2Personal({ data, onChange }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Age">
          <Input type="number" placeholder="25" min="10" max="80" value={data.age}
            onChange={e => onChange("age", e.target.value)} />
        </Field>
        <Field label="Weight (kg)">
          <Input type="number" placeholder="60" value={data.weight}
            onChange={e => onChange("weight", e.target.value)} />
        </Field>
      </div>
      <Field label="Height (cm)">
        <Input type="number" placeholder="165" value={data.height}
          onChange={e => onChange("height", e.target.value)} />
      </Field>
      <Field label="Gender">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {GENDERS.map(g => (
            <button key={g} onClick={() => onChange("gender", g)} style={{
              flex: 1, minWidth: 100, padding: "8px 10px", fontSize: 13,
              border: "0.5px solid",
              borderColor: data.gender === g ? "#5DCAA5" : "#d1d5db",
              borderRadius: 8, cursor: "pointer",
              background: data.gender === g ? "#E1F5EE" : "#f9fafb",
              color: data.gender === g ? "#0F6E56" : "#6b7280",
              fontWeight: data.gender === g ? 500 : 400, transition: "all 0.15s",
            }}>
              {g}
            </button>
          ))}
        </div>
      </Field>
    </>
  );
}

function Step3Cycle({ data, onChange }) {
  return (
    <>
      <Field label="Last period date">
        <Input type="date" value={data.lastPeriodDate}
          onChange={e => onChange("lastPeriodDate", e.target.value)} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Cycle length (days)">
          <Input type="number" min="20" max="45" value={data.cycleLength}
            onChange={e => onChange("cycleLength", e.target.value)} />
        </Field>
        <Field label="Period duration (days)">
          <Input type="number" min="1" max="10" value={data.periodDuration}
            onChange={e => onChange("periodDuration", e.target.value)} />
        </Field>
      </div>
    </>
  );
}

function Step4Health({ data, onChange }) {
  const toggle = (s) => {
    const curr = data.commonSymptoms;
    onChange("commonSymptoms",
      curr.includes(s) ? curr.filter(x => x !== s) : [...curr, s]
    );
  };
  return (
    <>
      <Field label="Common symptoms — select all that apply">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 6 }}>
          {SYMPTOMS.map(s => {
            const on = data.commonSymptoms.includes(s);
            return (
              <button key={s} onClick={() => toggle(s)} style={{
                padding: "7px 10px", fontSize: 12, textAlign: "left",
                border: `0.5px solid ${on ? "#5DCAA5" : "#e5e7eb"}`,
                borderRadius: 8, cursor: "pointer",
                background: on ? "#E1F5EE" : "#f9fafb",
                color: on ? "#0F6E56" : "#6b7280",
                fontWeight: on ? 500 : 400, transition: "all 0.15s",
              }}>
                {s}
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="Medical conditions (optional)">
        <textarea
          placeholder="e.g. PCOS, endometriosis, thyroid..."
          value={data.medicalConditions}
          onChange={e => onChange("medicalConditions", e.target.value)}
          style={{
            width: "100%", height: 72, resize: "none",
            padding: "9px 12px", border: "0.5px solid #d1d5db",
            borderRadius: 8, fontSize: 14, boxSizing: "border-box",
            fontFamily: "inherit", color: "#111",
          }}
        />
      </Field>
    </>
  );
}

function Step5Settings({ data, onChange }) {
  const row = (label, sub, field) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 0", borderBottom: "0.5px solid #f3f4f6",
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>{label}</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{sub}</div>
      </div>
      <Toggle checked={data[field]} onChange={() => onChange(field, !data[field])} />
    </div>
  );
  return (
    <>
      {row("Diagnosed with PCOS?", "Enables PCOS-specific tracking", "diagnosedWithPCOS")}
      {row("Daily affirmations", "Receive positive daily reminders", "affirmationsEnabled")}
    </>
  );
}

// ─── Register Flow ────────────────────────────────────────────────────────────

const REG_STEPS = [
  { label: "Step 1 of 5", title: "Account info" },
  { label: "Step 2 of 5", title: "Personal info" },
  { label: "Step 3 of 5", title: "Cycle info" },
  { label: "Step 4 of 5", title: "Health info" },
  { label: "Step 5 of 5", title: "Final settings" },
];

function RegisterFlow({ onSwitchToLogin }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    age: "", gender: "Female", weight: "", height: "",
    lastPeriodDate: "", cycleLength: 28, periodDuration: 5,
    commonSymptoms: [], medicalConditions: "",
    diagnosedWithPCOS: false, affirmationsEnabled: false,
  });

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleNext = async () => {
    if (step < REG_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      try {
        setLoading(true);

        // 1 — Register
        await api.post("/auth/register", {
          name:     formData.name,
          email:    formData.email,
          password: formData.password,
        });

        // 2 — Login to get token
        const loginRes = await api.post("/auth/login", {
          email:    formData.email,
          password: formData.password,
        });

        const token = loginRes.data.token;
        const baseUser = loginRes.data.user; // { _id, name, email } from backend

        // 3 — Update profile with all form fields
        const profilePayload = {
          age:                formData.age,
          gender:             formData.gender,
          weight:             formData.weight,
          height:             formData.height,
          lastPeriodDate:     formData.lastPeriodDate,
          cycleLength:        formData.cycleLength,
          periodDuration:     formData.periodDuration,
          commonSymptoms:     formData.commonSymptoms,
          medicalConditions:  formData.medicalConditions,
          diagnosedWithPCOS:  formData.diagnosedWithPCOS,
          affirmationsEnabled: formData.affirmationsEnabled,
        };

        await api.put("/user/profile", profilePayload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ── FIX: merge baseUser + all profile fields into localStorage ──
        // Without this, Profile.jsx only gets { _id, name, email } on first load.
        // The GET /api/v1/user/profile call in Profile.jsx will eventually fix it,
        // but this prevents a flash of missing data.
        const fullUser = {
          ...baseUser,         // _id, name, email from login response
          ...profilePayload,   // age, weight, symptoms, etc. from the form
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(fullUser));

        window.location.href = "/";

      } catch (err) {
        console.error("Registration error:", err.response?.data);
        alert(err.response?.data?.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const stepComponents = [
    <Step1Account  data={formData} onChange={update} />,
    <Step2Personal data={formData} onChange={update} />,
    <Step3Cycle    data={formData} onChange={update} />,
    <Step4Health   data={formData} onChange={update} />,
    <Step5Settings data={formData} onChange={update} />,
  ];

  return (
    <>
      <StepBar total={REG_STEPS.length} current={step} />
      <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>{REG_STEPS[step].label}</p>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: "#111" }}>
        {REG_STEPS[step].title}
      </h2>
      {stepComponents[step]}
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        {step > 0 && <Btn onClick={() => setStep(s => s - 1)}>Back</Btn>}
        <Btn primary onClick={handleNext} disabled={loading}>
          {loading ? "Please wait…" : step === REG_STEPS.length - 1 ? "Create account" : "Next"}
        </Btn>
      </div>
      <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 16 }}>
        Already have an account?{" "}
        <span onClick={onSwitchToLogin}
          style={{ color: "#1D9E75", cursor: "pointer", fontWeight: 500 }}>
          Sign in
        </span>
      </p>
    </>
  );
}

// ─── Login Flow ───────────────────────────────────────────────────────────────

const LOG_STEPS = [
  { label: "Step 1 of 2", title: "Your email" },
  { label: "Step 2 of 2", title: "Your password" },
];

function LoginFlow({ onSwitchToRegister }) {
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleNext = async () => {
    if (step < LOG_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      try {
        setLoading(true);
        setError("");

        const res = await api.post("/auth/login", {
          email:    formData.email,
          password: formData.password,
        });

        const token    = res.data.token;
        const baseUser = res.data.user; // { _id, name, email }

        // ── FIX: fetch full profile so localStorage has all fields ──
        // After login, immediately fetch the full profile so Profile.jsx
        // renders completely even before its own useEffect fires.
        let fullUser = baseUser;
        try {
          const profileRes = await api.get("/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (profileRes.data.success) {
            fullUser = { ...baseUser, ...profileRes.data.data };
          }
        } catch {
          // Non-fatal: Profile.jsx will fetch it on mount anyway
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(fullUser));

        window.location.href = "/";

      } catch (err) {
        setError(err.response?.data?.message || "Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <StepBar total={LOG_STEPS.length} current={step} />
      <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>{LOG_STEPS[step].label}</p>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: "#111" }}>
        {LOG_STEPS[step].title}
      </h2>

      {error && (
        <div style={{
          background: "#fef2f2", border: "0.5px solid #fecaca",
          borderRadius: 8, padding: "10px 12px",
          fontSize: 13, color: "#dc2626", marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      {step === 0 && (
        <Field label="Email address">
          <Input type="email" placeholder="you@example.com"
            value={formData.email} onChange={e => update("email", e.target.value)} />
        </Field>
      )}

      {step === 1 && (
        <>
          <Field label="Password">
            <Input type="password" placeholder="Enter your password"
              value={formData.password} onChange={e => update("password", e.target.value)} />
          </Field>
          <p style={{ fontSize: 12, color: "#1D9E75", cursor: "pointer", marginBottom: 8 }}>
            Forgot password?
          </p>
        </>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        {step > 0 && <Btn onClick={() => setStep(s => s - 1)}>Back</Btn>}
        <Btn primary onClick={handleNext} disabled={loading}>
          {loading ? "Please wait…" : step === LOG_STEPS.length - 1 ? "Sign in" : "Next"}
        </Btn>
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 16 }}>
        Don't have an account?{" "}
        <span onClick={onSwitchToRegister}
          style={{ color: "#1D9E75", cursor: "pointer", fontWeight: 500 }}>
          Register
        </span>
      </p>
    </>
  );
}

// ─── Main Auth Component ──────────────────────────────────────────────────────

export default function AuthFlow() {
  const [tab, setTab] = useState("register");

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#f9fafb", padding: 16,
    }}>
      <div style={{
        width: "100%", maxWidth: 460,
        background: "#fff", borderRadius: 16,
        border: "0.5px solid #e5e7eb",
        padding: "2rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          display: "flex", border: "0.5px solid #e5e7eb",
          borderRadius: 10, overflow: "hidden", marginBottom: "1.5rem",
        }}>
          {["register", "login"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "10px 0",
              fontSize: 14, fontWeight: 500,
              border: "none", cursor: "pointer",
              background: tab === t ? "#fff" : "#f9fafb",
              color: tab === t ? "#111" : "#9ca3af",
              textTransform: "capitalize", transition: "all 0.15s",
            }}>
              {t === "register" ? "Register" : "Sign In"}
            </button>
          ))}
        </div>

        {tab === "register"
          ? <RegisterFlow onSwitchToLogin={() => setTab("login")} />
          : <LoginFlow onSwitchToRegister={() => setTab("register")} />
        }
      </div>
    </div>
  );
}