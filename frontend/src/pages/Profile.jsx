import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import { requestNotificationPermission, sendTestNotification } from "../services/Notification";
import ReminderTimings from "./ReminderTimings";

export default function Profile() {
  const navigate = useNavigate();
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifStatus, setNotifStatus] = useState("default"); // "default" | "granted" | "denied"

  useEffect(() => {
    // Check current notification permission status
    if ("Notification" in window) {
      setNotifStatus(Notification.permission);
    }

    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    axios.get("/api/v1/user/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => {
        if (res.data.success) {
          setUser(res.data.data);
          localStorage.setItem("user", JSON.stringify(res.data.data));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotifStatus("granted");
      sendTestNotification();
    } else {
      setNotifStatus("denied");
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (loading) return (
    <div className="prof-page">
      <div className="prof-loading">
        <div className="prof-spinner" />
        <p>Loading your profile…</p>
      </div>
    </div>
  );

  return (
    <div className="prof-page">
      <div className="prof-inner">

        {/* ── Header ── */}
        <div className="prof-header">
          <div className="prof-eyebrow">My Account</div>
          <h1 className="prof-title">Your <em>profile</em></h1>
        </div>

        {/* ── Notification Banner ── */}
        {notifStatus === "default" && (
          <div className="prof-notif-banner">
            <div className="prof-notif-banner-left">
              <span className="prof-notif-icon">🔔</span>
              <div>
                <div className="prof-notif-title">Enable health reminders</div>
                <div className="prof-notif-sub">
                  Get daily reminders for water intake, walks, meals, seed cycling, and more
                </div>
              </div>
            </div>
            <button className="prof-notif-btn" onClick={handleEnableNotifications}>
              Enable
            </button>
          </div>
        )}

        {notifStatus === "granted" && (
          <div className="prof-notif-banner success">
            <div className="prof-notif-banner-left">
              <span className="prof-notif-icon">✅</span>
              <div>
                <div className="prof-notif-title">Notifications enabled</div>
                <div className="prof-notif-sub">
                  You'll receive daily health reminders and affirmations
                </div>
              </div>
            </div>
            <button className="prof-notif-btn outlined" onClick={sendTestNotification}>
              Send test
            </button>
          </div>
        )}

        {notifStatus === "denied" && (
          <div className="prof-notif-banner denied">
            <div className="prof-notif-banner-left">
              <span className="prof-notif-icon">🔕</span>
              <div>
                <div className="prof-notif-title">Notifications blocked</div>
                <div className="prof-notif-sub">
                  Click the 🔒 lock icon in your browser address bar → Notifications → Allow
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Avatar + name card ── */}
        <div className="prof-hero-card">
          <div className="prof-avatar">{initials}</div>
          <div className="prof-hero-info">
            <div className="prof-name">{user?.name || "—"}</div>
            <div className="prof-email">{user?.email || "—"}</div>
            {user?.diagnosedWithPCOS && (
              <div className="prof-pcos-badge">🌸 PCOS Diagnosed</div>
            )}
          </div>
          <button className="prof-edit-btn" onClick={() => navigate("/edit-profile")}>
            ✏️ Edit profile
          </button>
        </div>

        <div className="prof-grid">

          {/* ── Personal info ── */}
          <div className="prof-card">
            <div className="prof-card-label">Personal info</div>
            <div className="prof-rows">
              <div className="prof-row">
                <span className="prof-row-icon">🎂</span>
                <span className="prof-row-key">Age</span>
                <span className="prof-row-val">{user?.age ? `${user.age} years` : "—"}</span>
              </div>
              <div className="prof-row">
                <span className="prof-row-icon">⚧</span>
                <span className="prof-row-key">Gender</span>
                <span className="prof-row-val">{user?.gender || "—"}</span>
              </div>
              <div className="prof-row">
                <span className="prof-row-icon">⚖️</span>
                <span className="prof-row-key">Weight</span>
                <span className="prof-row-val">{user?.weight ? `${user.weight} kg` : "—"}</span>
              </div>
              <div className="prof-row">
                <span className="prof-row-icon">📏</span>
                <span className="prof-row-key">Height</span>
                <span className="prof-row-val">{user?.height ? `${user.height} cm` : "—"}</span>
              </div>
            </div>
          </div>

          {/* ── Cycle info ── */}
          <div className="prof-card">
            <div className="prof-card-label">Cycle info</div>
            <div className="prof-rows">
              <div className="prof-row">
                <span className="prof-row-icon">📅</span>
                <span className="prof-row-key">Last period</span>
                <span className="prof-row-val">
                  {user?.lastPeriodDate
                    ? new Date(user.lastPeriodDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "—"}
                </span>
              </div>
              <div className="prof-row">
                <span className="prof-row-icon">🔄</span>
                <span className="prof-row-key">Cycle length</span>
                <span className="prof-row-val">{user?.cycleLength ? `${user.cycleLength} days` : "—"}</span>
              </div>
              <div className="prof-row">
                <span className="prof-row-icon">🩸</span>
                <span className="prof-row-key">Period duration</span>
                <span className="prof-row-val">{user?.periodDuration ? `${user.periodDuration} days` : "—"}</span>
              </div>
            </div>
          </div>

          {/* ── Symptoms ── */}
          <div className="prof-card prof-card-full">
            <div className="prof-card-label">Common symptoms</div>
            {user?.commonSymptoms?.length ? (
              <div className="prof-symptoms">
                {user.commonSymptoms.map((s, i) => (
                  <span className="prof-symptom-pill" key={i}>{s}</span>
                ))}
              </div>
            ) : (
              <p className="prof-empty">No symptoms added yet.</p>
            )}
          </div>

          {/* ── Medical conditions ── */}
          {user?.medicalConditions && (
            <div className="prof-card prof-card-full">
              <div className="prof-card-label">Medical conditions</div>
              <p className="prof-medical">{user.medicalConditions}</p>
            </div>
          )}

         {/* ── Settings ── */}
          <div className="prof-card prof-card-full">
            <div className="prof-card-label">Settings</div>
            <div className="prof-rows">
              <div className="prof-row">
                <span className="prof-row-icon">🌸</span>
                <span className="prof-row-key">PCOS diagnosed</span>
                <span className={`prof-toggle-badge ${user?.diagnosedWithPCOS ? "on" : "off"}`}>
                  {user?.diagnosedWithPCOS ? "Yes" : "No"}
                </span>
              </div>
              <div className="prof-row">
                <span className="prof-row-icon">✨</span>
                <span className="prof-row-key">Daily affirmations</span>
                <span className={`prof-toggle-badge ${user?.affirmationsEnabled ? "on" : "off"}`}>
                  {user?.affirmationsEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="prof-row">
                <span className="prof-row-icon">🔔</span>
                <span className="prof-row-key">Notifications</span>
                <span className={`prof-toggle-badge ${notifStatus === "granted" ? "on" : "off"}`}>
                  {notifStatus === "granted" ? "Enabled" : notifStatus === "denied" ? "Blocked" : "Not set"}
                </span>
              </div>
            </div>
          </div>

          {/* ── Reminder Timings ── */}   {/* 👈 ADD THIS BLOCK */}
          <div className="prof-card prof-card-full">
            <div className="prof-card-label">Reminder timings</div>
            <ReminderTimings />
          </div>

        </div>  {/* end of prof-grid */}

        {/* ── Logout ── */}
        <button
          className="prof-logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/auth";
          }}
        >
          ↩ Log out
        </button>

      </div>
    </div>
  );
}