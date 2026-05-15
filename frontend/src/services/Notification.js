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

const REMINDERS = [
  { id: "morning_walk",   hour: 7,  minute: 30, title: "🚶 Morning Walk Reminder",  body: "Start your day with a 10-minute walk — great for insulin resistance!" },
  { id: "water_1",        hour: 10,  minute: 33,  title: "💧 Hydration Check",         body: "Have you had your first 2 glasses of water today?" },
  { id: "water_2",        hour: 13, minute: 0,  title: "💧 Midday Hydration",        body: "Time to drink 2 more glasses of water. Stay hydrated!" },
  { id: "water_3",        hour: 17, minute: 0,  title: "💧 Afternoon Water Break",   body: "Keep sipping! Aim for 8 glasses total today." },
  { id: "lunch_calories", hour: 13, minute: 30, title: "🍽️ Calorie Check-in",        body: "Remember to log your lunch! Your daily goal is 1800 kcal." },
  { id: "exercise",       hour: 17, minute: 30, title: "🏃 Movement Time!",          body: "30 minutes of movement today keeps hormones in balance. You've got this!" },
  { id: "seed_cycling",   hour: 8,  minute: 30, title: "🌿 Seed Cycling Reminder",   body: "Don't forget your daily seeds! Check the Diet page for today's phase." },
  { id: "spearmint_tea",  hour: 10, minute: 0,  title: "🍵 Spearmint Tea Time",      body: "Time for your anti-androgen spearmint tea! 2 cups recommended daily." },
  { id: "log_symptoms",   hour: 21, minute: 0,  title: "📋 Log Today's Symptoms",    body: "Take 2 minutes to track how you felt today. Patterns help your progress!" },
  { id: "sleep_reminder", hour: 22, minute: 30, title: "🌙 Wind Down Time",          body: "Good sleep regulates cortisol and hormones. Start winding down now." },
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
    return reg;
  } catch (err) {
    console.error("Service worker registration failed:", err);
    return null;
  }
}

// ── Send message to service worker ───────────────────────────
async function messageServiceWorker(data) {
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  if (reg.active) reg.active.postMessage(data);
}

// ── Request permission ────────────────────────────────────────
export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied")  return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

// ── Init — called from App.js on login ───────────────────────
export async function initNotifications() {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  await registerServiceWorker();
  await navigator.serviceWorker.ready;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  await messageServiceWorker({
    type:                "INIT_REMINDERS",
    reminders:           REMINDERS,
    affirmations:        AFFIRMATIONS,
    affirmationsEnabled: user.affirmationsEnabled || false,
  });

  console.log("✅ Notifications initialised via service worker");
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
  await messageServiceWorker({ type: "TEST_NOTIFICATION" });
}