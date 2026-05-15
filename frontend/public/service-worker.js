// ─────────────────────────────────────────────────────────────
//  service-worker.js
//  Place this file in: public/service-worker.js
// ─────────────────────────────────────────────────────────────

const CACHE_NAME = "pcos-care-v1";

// ── Install ───────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// ── Activate ──────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// ── Receive messages from the app ────────────────────────────
// The app sends { type, reminders, affirmations, affirmationsEnabled }
self.addEventListener("message", (event) => {
  const { type, reminders, affirmations, affirmationsEnabled } = event.data;

  if (type === "INIT_REMINDERS") {
    // Store config in service worker memory
    self.reminders            = reminders            || [];
    self.affirmations         = affirmations         || [];
    self.affirmationsEnabled  = affirmationsEnabled  || false;
    self.sentToday            = self.sentToday        || {};

    // Start the scheduler if not already running
    if (!self.schedulerTimer) {
      self.schedulerTimer = setInterval(() => {
        checkAndSend();
      }, 60 * 1000); // every 60 seconds

      // Also run immediately
      checkAndSend();
    }
  }

  if (type === "UPDATE_AFFIRMATIONS") {
    self.affirmationsEnabled = event.data.affirmationsEnabled;
  }

  if (type === "TEST_NOTIFICATION") {
    self.registration.showNotification("🔔 Notifications are working!", {
      body: "You'll receive daily health reminders and affirmations here.",
      icon: "/logo192.png",
      badge: "/logo192.png",
    });
  }
});

// ── Check time and send due reminders ─────────────────────────
function checkAndSend() {
  const now      = new Date();
  const todayKey = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

  // Reset sent log on new day
  if (self.lastDay !== todayKey) {
    self.sentToday = {};
    self.lastDay   = todayKey;
  }

  const currentHour   = now.getHours();
  const currentMinute = now.getMinutes();

  // Check each reminder
  (self.reminders || []).forEach((reminder) => {
    const key = `${reminder.id}_${todayKey}`;
    if (self.sentToday[key]) return; // already sent today

    if (
      currentHour   === reminder.hour &&
      currentMinute >= reminder.minute &&
      currentMinute <= reminder.minute + 1
    ) {
      self.registration.showNotification(reminder.title, {
        body:  reminder.body,
        icon:  "/logo192.png",
        badge: "/logo192.png",
        tag:   reminder.id, // prevents duplicate popups
      });
      self.sentToday[key] = true;
    }
  });

  // Daily affirmation at 8:00 AM
  if (self.affirmationsEnabled && self.affirmations?.length) {
    const affKey = `affirmation_${todayKey}`;
    if (
      !self.sentToday[affKey] &&
      currentHour   === 8 &&
      currentMinute >= 0 &&
      currentMinute <= 1
    ) {
      const aff = self.affirmations[Math.floor(Math.random() * self.affirmations.length)];
      self.registration.showNotification("Your Daily Affirmation 💜", {
        body:  aff,
        icon:  "/logo192.png",
        badge: "/logo192.png",
        tag:   "affirmation",
      });
      self.sentToday[affKey] = true;
    }
  }
}

// ── Handle notification click → open app ──────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});