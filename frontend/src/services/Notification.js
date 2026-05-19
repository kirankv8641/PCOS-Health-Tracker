// ─────────────────────────────────────────────────────────────
//  notifications.js  —  src/services/notifications.js
// ─────────────────────────────────────────────────────────────

const AFFIRMATIONS = [
  "💜 You are doing better than you think.",
  "🌸 Your body is healing, one day at a time.",
  "✨ Small steps are still progress.",
  "🌿 Rest is part of the journey, not a setback.",
  "💪 You are stronger than your hardest day.",
  "🌞 Today is a fresh start — embrace it.",
  "🦋 Healing is not linear, and that's okay.",
  "💐 You deserve kindness, especially from yourself.",
  "🌱 Progress, not perfection.",
  "❤️ Your feelings are valid. You are valid.",
];

// ── Register service worker ───────────────────────────────────
async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service workers not supported.");
    return null;
  }
  try {
    const reg = await navigator.serviceWorker.register("/service-worker.js");
    console.log("✅ Service worker registered:", reg.scope);
    // Wait for it to be active
    await navigator.serviceWorker.ready;
    return reg;
  } catch (err) {
    console.error("❌ Service worker registration failed:", err);
    return null;
  }
}

// ── Send message to service worker ───────────────────────────
async function messageServiceWorker(data) {
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    if (reg.active) reg.active.postMessage(data);
  } catch (err) {
    console.error("❌ Failed to message service worker:", err);
  }
}

// ── Get reminders from localStorage (set by ReminderTimings) ─
function getStoredReminders() {
  try {
    const stored = localStorage.getItem("reminders");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    // Convert ReminderTimings format → service worker format
    return parsed
      .filter((r) => r.enabled)
      .map((r) => {
        const [hour, minute] = r.time.split(":").map(Number);
        return {
          id:     r.key,
          title:  `${r.icon} ${r.label}`,
          body:   r.sub,
          hour,
          minute,
        };
      });
  } catch {
    return null;
  }
}

// ── Request permission ────────────────────────────────────────
export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied")  return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

// ── Init — call this from App.js on every page load/login ────
// FIX: This must be called on EVERY app load, not just on button click.
// The service worker loses its in-memory state on every page refresh,
// so we must re-send INIT_REMINDERS each time the app loads.
export async function initNotifications() {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  await registerServiceWorker();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Use reminders saved by ReminderTimings, or fall back to defaults
  const reminders = getStoredReminders() || getDefaultReminders();

  await messageServiceWorker({
    type:                "INIT_REMINDERS",
    reminders,
    affirmations:        AFFIRMATIONS,
    affirmationsEnabled: user.affirmationsEnabled || false,
  });

  console.log("✅ Notifications initialised via service worker");
}

// ── Default reminders (used if ReminderTimings hasn't saved yet) ─
function getDefaultReminders() {
  return [
    { id: "morningWalk",  hour: 7,  minute: 0,  title: "🚶 Morning Walk Reminder",   body: "Get your body moving" },
    { id: "teaTime",      hour: 9,  minute: 30, title: "🍵 Tea / herbal drink",       body: "Hormone-friendly brew" },
    { id: "waterIntake",  hour: 10, minute: 0,  title: "💧 Water intake",             body: "Stay hydrated" },
    { id: "mealReminder", hour: 13, minute: 0,  title: "🍽️ Meal reminder",            body: "Don't skip meals" },
    { id: "affirmation",  hour: 8,  minute: 0,  title: "✨ Daily affirmation",        body: "Your positive boost" },
    { id: "log_symptoms", hour: 21, minute: 0,  title: "📋 Log Today's Symptoms",    body: "Take 2 minutes to track how you felt today." },
    { id: "sleep_reminder", hour: 22, minute: 30, title: "🌙 Wind Down Time",        body: "Good sleep regulates cortisol and hormones." },
  ];
}

// ── Update affirmation pref without full reinit ───────────────
export async function updateAffirmationSetting(enabled) {
  await messageServiceWorker({
    type:                "UPDATE_AFFIRMATIONS",
    affirmationsEnabled: enabled,
  });
}

// ── Test notification ─────────────────────────────────────────
export async function sendTestNotification() {
  const granted = await requestNotificationPermission();
  if (!granted) { alert("Please allow notifications first."); return; }

  // Re-init first to make sure SW has the latest reminders
  await initNotifications();

  await messageServiceWorker({ type: "TEST_NOTIFICATION" });
}