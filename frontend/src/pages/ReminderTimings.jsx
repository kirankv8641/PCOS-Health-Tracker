import { useState } from "react";
import axios from "axios";
// import "./ReminderTimings.css";

const DEFAULT_REMINDERS = [
  { key: "morningWalk",  label: "Morning walk",      sub: "Get your body moving",  icon: "🚶", time: "07:00", enabled: true  },
  { key: "teaTime",      label: "Tea / herbal drink", sub: "Hormone-friendly brew", icon: "🍵", time: "09:30", enabled: true  },
  { key: "waterIntake",  label: "Water intake",       sub: "Stay hydrated",         icon: "💧", time: "10:00", enabled: true  },
  { key: "mealReminder", label: "Meal reminder",      sub: "Don't skip meals",      icon: "🍽️", time: "13:00", enabled: true  },
  { key: "seedCycling",  label: "Seed cycling",       sub: "Daily seed tracking",   icon: "🌸", time: "08:00", enabled: false },
  { key: "affirmation",  label: "Daily affirmation",  sub: "Your positive boost",   icon: "✨", time: "08:00", enabled: true  },
  { key: "eveningWalk",  label: "Evening walk",       sub: "Wind-down stroll",      icon: "🌙", time: "18:30", enabled: false },
  { key: "supplements",  label: "Supplements",        sub: "Vitamins & minerals",   icon: "💊", time: "09:00", enabled: false },
];

// Convert our format → what your service-worker.js expects
function toSWFormat(reminders) {
  return reminders
    .filter(r => r.enabled)
    .map(r => {
      const [hour, minute] = r.time.split(":").map(Number);
      return {
        id:     r.key,
        title:  `${r.icon} ${r.label}`,
        body:   r.sub,
        hour,
        minute,
      };
    });
}

async function syncWithServiceWorker(reminders) {
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  if (!reg?.active) return;

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  // INIT_REMINDERS is what your existing service-worker.js listens for
  reg.active.postMessage({
    type:                "INIT_REMINDERS",
    reminders:           toSWFormat(reminders),
    affirmations:        storedUser.affirmations        || [],
    affirmationsEnabled: storedUser.affirmationsEnabled || false,
  });
}

export default function ReminderTimings() {
  const [reminders, setReminders] = useState(() => {
    try {
      const stored = localStorage.getItem("reminders");
      return stored ? JSON.parse(stored) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  });
  const [saveState, setSaveState] = useState("idle");

  const update = (key, field, value) =>
    setReminders(prev =>
      prev.map(r => (r.key === key ? { ...r, [field]: value } : r))
    );

  const handleSave = async () => {
    setSaveState("saving");
    try {
      localStorage.setItem("reminders", JSON.stringify(reminders));
      await syncWithServiceWorker(reminders);
      await axios.put(
        "/api/v1/user/reminders",
        { reminders },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSaveState("saved");
    } catch (err) {
      console.error("Failed to save reminders:", err);
      setSaveState("error");
    } finally {
      setTimeout(() => setSaveState("idle"), 2500);
    }
  };

  return (
    <div className="rt-wrap">
      <div className="rt-list">
        {reminders.map((r, i) => (
          <div
            className={`rt-row ${r.enabled ? "rt-row--on" : ""}`}
            key={r.key}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="rt-icon-wrap">
              <span className="rt-icon">{r.icon}</span>
            </div>

            <div className="rt-info">
              <span className="rt-label">{r.label}</span>
              <span className="rt-sub">{r.sub}</span>
            </div>

            <input
              type="time"
              className="rt-time"
              value={r.time}
              disabled={!r.enabled}
              onChange={e => update(r.key, "time", e.target.value)}
            />

            <button
              className={`rt-toggle ${r.enabled ? "rt-toggle--on" : ""}`}
              onClick={() => update(r.key, "enabled", !r.enabled)}
              aria-label={`${r.enabled ? "Disable" : "Enable"} ${r.label}`}
              aria-pressed={r.enabled}
            >
              <span className="rt-toggle-thumb" />
            </button>
          </div>
        ))}
      </div>

      <button
        className={`rt-save rt-save--${saveState}`}
        onClick={handleSave}
        disabled={saveState === "saving"}
      >
        {saveState === "saving" && <span className="rt-spinner" />}
        {saveState === "idle"   && "Save reminder timings"}
        {saveState === "saving" && "Saving…"}
        {saveState === "saved"  && "✅ Saved!"}
        {saveState === "error"  && "⚠️ Couldn't save — try again"}
      </button>
    </div>
  );
}