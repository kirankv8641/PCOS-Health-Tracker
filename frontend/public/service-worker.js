// ─────────────────────────────────────────────────────────────
//  service-worker.js  —  public/service-worker.js
// ─────────────────────────────────────────────────────────────

// ── Install ───────────────────────────────────────────────────
self.addEventListener("install", () => {
  self.skipWaiting();
});

// ── Activate ──────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// ─────────────────────────────────────────────────────────────
//  STATE — persisted in IndexedDB so it survives SW restarts
// ─────────────────────────────────────────────────────────────

// Simple IndexedDB wrapper
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("pcos-sw-db", 1);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore("state");
    };
    req.onsuccess  = (e) => resolve(e.target.result);
    req.onerror    = (e) => reject(e.target.error);
  });
}

async function dbGet(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction("state", "readonly");
    const req = tx.objectStore("state").get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function dbSet(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction("state", "readwrite");
    const req = tx.objectStore("state").put(value, key);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

// ─────────────────────────────────────────────────────────────
//  SCHEDULER — uses setTimeout chains (more reliable than setInterval in SW)
//  and re-reads from IndexedDB so it works across SW restarts
// ─────────────────────────────────────────────────────────────

let schedulerRunning = false;

async function startScheduler() {
  if (schedulerRunning) return;
  schedulerRunning = true;
  scheduleNextCheck();
}

function scheduleNextCheck() {
  // Calculate ms until the next full minute
  const now            = new Date();
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 500;

  setTimeout(async () => {
    await checkAndSend();
    scheduleNextCheck(); // chain to next minute
  }, msToNextMinute);
}

async function checkAndSend() {
  const now      = new Date();
  const todayKey = now.toISOString().slice(0, 10);

  // Load state from IndexedDB (survives SW restarts)
  let sentToday            = (await dbGet("sentToday"))            || {};
  let lastDay              = (await dbGet("lastDay"))              || "";
  const reminders          = (await dbGet("reminders"))            || [];
  const affirmations       = (await dbGet("affirmations"))         || [];
  const affirmationsEnabled= (await dbGet("affirmationsEnabled"))  || false;

  // Reset on new day
  if (lastDay !== todayKey) {
    sentToday = {};
    lastDay   = todayKey;
    await dbSet("sentToday", sentToday);
    await dbSet("lastDay",   lastDay);
  }

  const currentHour   = now.getHours();
  const currentMinute = now.getMinutes();

  // Check each reminder
  for (const reminder of reminders) {
    const key = `${reminder.id}_${todayKey}`;
    if (sentToday[key]) continue;

    if (
      currentHour   === reminder.hour &&
      currentMinute === reminder.minute
    ) {
      await self.registration.showNotification(reminder.title, {
        body:  reminder.body,
        icon:  "/logo192.png",
        badge: "/logo192.png",
        tag:   reminder.id,
      });
      sentToday[key] = true;
    }
  }

  // Daily affirmation
  if (affirmationsEnabled && affirmations.length) {
    const affKey = `affirmation_${todayKey}`;
    if (
      !sentToday[affKey] &&
      currentHour   === 8 &&
      currentMinute === 0
    ) {
      const aff = affirmations[Math.floor(Math.random() * affirmations.length)];
      await self.registration.showNotification("Your Daily Affirmation 💜", {
        body:  aff,
        icon:  "/logo192.png",
        badge: "/logo192.png",
        tag:   "affirmation",
      });
      sentToday[affKey] = true;
    }
  }

  // Persist updated sentToday
  await dbSet("sentToday", sentToday);
}

// ── Receive messages from the app ────────────────────────────
self.addEventListener("message", async (event) => {
  const { type, reminders, affirmations, affirmationsEnabled } = event.data || {};

  if (type === "INIT_REMINDERS") {
    // FIX: Persist everything to IndexedDB so it survives page reloads
    await dbSet("reminders",           reminders            || []);
    await dbSet("affirmations",        affirmations         || []);
    await dbSet("affirmationsEnabled", affirmationsEnabled  || false);

    // Start scheduler (safe to call multiple times — it checks schedulerRunning)
    await startScheduler();

    console.log("✅ SW: reminders stored and scheduler started");
  }

  if (type === "UPDATE_AFFIRMATIONS") {
    await dbSet("affirmationsEnabled", event.data.affirmationsEnabled || false);
  }

  if (type === "TEST_NOTIFICATION") {
    await self.registration.showNotification("🔔 Notifications are working!", {
      body:  "You'll receive daily health reminders and affirmations.",
      icon:  "/logo192.png",
      badge: "/logo192.png",
    });
  }
});

// ── On SW startup, restart the scheduler if reminders exist ──
// FIX: This handles the case where SW restarts (page reload, browser restart)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await clients.claim();
      const reminders = await dbGet("reminders");
      if (reminders && reminders.length > 0) {
        await startScheduler();
        console.log("✅ SW: scheduler restarted after activation");
      }
    })()
  );
});

// ── Notification click → open app ─────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow("/");
      })
  );
});