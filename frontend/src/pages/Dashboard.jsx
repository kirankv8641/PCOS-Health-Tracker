import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const symptoms = [
  { icon: "🔥", name: "Bloating", level: "Mild", color: "#22c55e" },
  { icon: "😴", name: "Fatigue", level: "Moderate", color: "#f59e0b" },
  { icon: "😢", name: "Mood Swings", level: "Severe", color: "#ef4444" },
  { icon: "😔", name: "Acne", level: "Mild", color: "#22c55e" },
  { icon: "💇", name: "Hair Fall", level: "Moderate", color: "#f59e0b" },
];

const weeklyData = [
  { day: "Mon", cal: 1200, min: 45 },
  { day: "Tue", cal: 1800, min: 60 },
  { day: "Wed", cal: 1500, min: 30 },
  { day: "Thu", cal: 1750, min: 55 },
  { day: "Fri", cal: 1900, min: 70 },
  { day: "Sat", cal: 1100, min: 25 },
  { day: "Sun", cal: 800, min: 20 },
];

const reminders = [
  { icon: "💧", name: "Drink Water", time: "10:00 AM" },
  { icon: "🚶", name: "Evening Walk", time: "06:00 PM" },
  { icon: "🧘", name: "Yoga", time: "07:00 PM" },
  { icon: "💊", name: "Take Supplements", time: "09:00 PM" },
];

const activities = [
  { icon: "🚶", name: "Morning Walk", duration: "30 min", cal: 250, when: "Today", time: "07:15 AM" },
  { icon: "🧘", name: "Yoga", duration: "20 min", cal: 120, when: "Today", time: "07:00 PM" },
  { icon: "🏋️", name: "Strength Training", duration: "25 min", cal: 180, when: "Yesterday", time: "06:30 PM" },
];

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard" },
  { icon: "📋", label: "Symptoms", path: "/symptoms" },
  { icon: "🥗", label: "Diet", path: "/diet" },
  { icon: "🏃", label: "Exercise", path: "/exercise" },
];

const maxCal = Math.max(...weeklyData.map(d => d.cal));
const maxMin = Math.max(...weeklyData.map(d => d.min));

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userName = "Ananya";

  return (
    <div className="db-root">

      {/* ── Sidebar ── */}
      <aside className={`db-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="db-sidebar-logo">
          <div className="db-logo-icon">👩</div>
          <div>
            <div className="db-logo-title">PCOS Care</div>
            <div className="db-logo-sub">Wellness Tracker</div>
          </div>
        </div>

        <nav className="db-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`db-nav-item ${item.label === "Dashboard" ? "active" : ""}`}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="db-logout" onClick={() => navigate("/auth")}>
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ── */}
      <main className="db-main">

      

        {/* Scrollable Content */}
        <div className="db-content">

          {/* Welcome + Quote Row */}
          <div className="db-welcome-row">
            <div className="db-welcome-text">
              <h2>Hello 👋</h2>
              <p>Track your health, understand your body, and stay in control.</p>
            </div>
            <div className="db-quote-card">
              <span className="db-quote-heart">❤️</span>
              <p>"Small steps every day lead to big changes."</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="db-stats-grid">
            <div className="db-stat-card">
              <div className="db-stat-header">
                <span className="db-stat-label">Today's Calories</span>
                <span className="db-stat-icon cal">🔥</span>
              </div>
              <div className="db-stat-value">1,350 <span className="db-stat-unit">kcal</span></div>
              <div className="db-stat-sub">/ 1,800 kcal</div>
              <div className="db-progress-bar"><div className="db-progress-fill cal" style={{ width: "75%" }} /></div>
              <div className="db-stat-pct">75% of daily goal</div>
            </div>

            <div className="db-stat-card">
              <div className="db-stat-header">
                <span className="db-stat-label">Active Minutes</span>
                <span className="db-stat-icon act">🏃</span>
              </div>
              <div className="db-stat-value">45 <span className="db-stat-unit">min</span></div>
              <div className="db-stat-sub">/ 60 min</div>
              <div className="db-progress-bar"><div className="db-progress-fill act" style={{ width: "75%" }} /></div>
              <div className="db-stat-pct">75% of daily goal</div>
            </div>

            <div className="db-stat-card">
              <div className="db-stat-header">
                <span className="db-stat-label">Water Intake</span>
                <span className="db-stat-icon water">💧</span>
              </div>
              <div className="db-stat-value">6 <span className="db-stat-unit">glasses</span></div>
              <div className="db-stat-sub">/ 8 glasses</div>
              <div className="db-progress-bar"><div className="db-progress-fill water" style={{ width: "75%" }} /></div>
              <div className="db-stat-pct">75% of daily goal</div>
            </div>

            <div className="db-stat-card">
              <div className="db-stat-header">
                <span className="db-stat-label">Weight</span>
                <span className="db-stat-icon weight">⚖️</span>
              </div>
              <div className="db-stat-value">64.5 <span className="db-stat-unit">kg</span></div>
              <div className="db-stat-sub">Last updated today</div>
              <div className="db-weight-change">↓ 0.5 kg</div>
            </div>
          </div>

          {/* Middle Row */}
          <div className="db-middle-row">

            {/* Symptoms Overview */}
            <div className="db-card">
              <div className="db-card-header">
                <span className="db-card-title">Symptoms Overview</span>
                <button className="db-view-all" onClick={() => navigate("/symptoms")}>View all</button>
              </div>
              <div className="db-symptoms-list">
                {symptoms.map((s, i) => (
                  <div className="db-symptom-row" key={i}>
                    <span className="db-symptom-icon">{s.icon}</span>
                    <span className="db-symptom-name">{s.name}</span>
                    <span className="db-symptom-level" style={{ color: s.color }}>{s.level}</span>
                    <span className="db-symptom-dot" style={{ background: s.color }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Progress Chart */}
            <div className="db-card db-chart-card">
              <div className="db-card-header">
                <span className="db-card-title">Weekly Progress</span>
                <span className="db-week-badge">This Week ▾</span>
              </div>
              <div className="db-chart-legend">
                <span className="db-legend-dot pink" /> Calories
                <span className="db-legend-dot purple" /> Active Minutes
              </div>
              <div className="db-chart">
                {weeklyData.map((d, i) => (
                  <div className="db-chart-col" key={i}>
                    <div className="db-bar-group">
                      <div
                        className="db-bar pink"
                        style={{ height: `${(d.cal / maxCal) * 100}%` }}
                        title={`${d.cal} kcal`}
                      />
                      <div
                        className="db-bar purple"
                        style={{ height: `${(d.min / maxMin) * 100}%` }}
                        title={`${d.min} min`}
                      />
                    </div>
                    <div className="db-chart-day">{d.day}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reminders */}
            <div className="db-card">
              <div className="db-card-header">
                <span className="db-card-title">Upcoming Reminders</span>
                <button className="db-view-all">View all</button>
              </div>
              <div className="db-reminders-list">
                {reminders.map((r, i) => (
                  <div className="db-reminder-row" key={i}>
                    <span className="db-reminder-icon">{r.icon}</span>
                    <span className="db-reminder-name">{r.name}</span>
                    <span className="db-reminder-time">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="db-bottom-row">

            {/* Diet Summary */}
            <div className="db-card">
              <div className="db-card-header">
                <span className="db-card-title">Diet Summary</span>
                <button className="db-view-all" onClick={() => navigate("/diet")}>View all</button>
              </div>
              <div className="db-diet-row">
                <div className="db-donut">
                  <svg viewBox="0 0 100 100" className="db-donut-svg">
                    {/* Carbs 45% */}
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#f9a8d4" strokeWidth="18"
                      strokeDasharray="98.9 212" strokeDashoffset="0" />
                    {/* Proteins 25% */}
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#93c5fd" strokeWidth="18"
                      strokeDasharray="54.9 212" strokeDashoffset="-98.9" />
                    {/* Fats 20% */}
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#86efac" strokeWidth="18"
                      strokeDasharray="43.9 212" strokeDashoffset="-153.8" />
                    {/* Fiber 10% */}
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#fde68a" strokeWidth="18"
                      strokeDasharray="22.0 212" strokeDashoffset="-197.7" />
                  </svg>
                </div>
                <div className="db-diet-legend">
                  {[
                    { color: "#f9a8d4", label: "Carbs", pct: "45%" },
                    { color: "#93c5fd", label: "Proteins", pct: "25%" },
                    { color: "#86efac", label: "Fats", pct: "20%" },
                    { color: "#fde68a", label: "Fiber", pct: "10%" },
                  ].map((item, i) => (
                    <div className="db-diet-legend-row" key={i}>
                      <span className="db-diet-dot" style={{ background: item.color }} />
                      <span className="db-diet-label">{item.label}</span>
                      <span className="db-diet-pct">{item.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="db-card">
              <div className="db-card-header">
                <span className="db-card-title">Recent Activity</span>
              </div>
              <div className="db-activity-list">
                {activities.map((a, i) => (
                  <div className="db-activity-row" key={i}>
                    <span className="db-activity-icon">{a.icon}</span>
                    <div className="db-activity-info">
                      <div className="db-activity-name">{a.name}</div>
                      <div className="db-activity-meta">{a.duration} &nbsp;|&nbsp; {a.cal} kcal</div>
                    </div>
                    <div className="db-activity-time">
                      <div className="db-activity-when">{a.when}</div>
                      <div className="db-activity-clock">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Tip */}
            <div className="db-card db-tip-card">
              <div className="db-card-header">
                <span className="db-card-title">Health Tip</span>
              </div>
              <div className="db-tip-body">
                <span className="db-tip-emoji">🧘‍♀️</span>
                <p className="db-tip-text">
                  Practice mindful breathing for 5 minutes daily to reduce stress and support hormonal balance.
                </p>
              </div>
              <div className="db-tip-dots">
                <span className="db-tip-dot active" />
                <span className="db-tip-dot" />
                <span className="db-tip-dot" />
              </div>
            </div>
          </div>

          <footer className="db-footer">© 2025 PCOS Care. All rights reserved.</footer>
        </div>
      </main>
    </div>
  );
}