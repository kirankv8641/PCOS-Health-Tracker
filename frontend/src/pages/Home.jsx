import { useNavigate } from "react-router-dom";
import "./Home.css";

const stats = [
  { num: "1 in 10", desc: "Women are affected by PCOS" },
  { num: "70%", desc: "Cases remain undiagnosed" },
  { num: "2–3 yrs", desc: "Average delay in diagnosis" },
  { num: "↑ Risk", desc: "Of long-term complications if untreated" },
];

const features = [
  {
    icon: "🥗",
    iconClass: "diet",
    title: "Healthy diet",
    desc: "Balanced, hormone-friendly meals tailored to manage insulin resistance and reduce inflammation.",
    link: "Explore diet plan",
    path: "/diet",
  },
  {
    icon: "🏃",
    iconClass: "exercise",
    title: "Exercise",
    desc: "Curated workout routines to boost metabolism, regulate hormones, and improve energy levels.",
    link: "View exercises",
    path: "/exercise",
  },
  {
    icon: "📋",
    iconClass: "symptoms",
    title: "Symptom tracking",
    desc: "Log and monitor your body signals — from acne and hair loss to cycle irregularities — over time.",
    link: "Track symptoms",
    path: "/symptoms",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-left">
          <div className="home-eyebrow">PCOS Health Tracker</div>
          <h1 className="home-title">
            Your health,<br /><em>understood</em>
          </h1>
          <p className="home-desc">
            Track your symptoms, manage your diet, and stay active to improve
            your health and lifestyle. Built specifically for women living with PCOS.
          </p>
          <button className="home-cta" onClick={() => navigate("/auth")}>
            Get started
            <span className="home-cta-arrow">→</span>
          </button>
        </div>

        <div className="home-hero-right">
          <div className="home-hero-card">
            <div className="home-hero-card-label">Hormonal imbalance cycle</div>
            <div className="home-cycle-grid">
              <div className="home-cycle-node">
                <div className="home-cycle-title">Hypothalamus</div>
                <div className="home-cycle-sub">↑ LH, ↓ FSH signals</div>
              </div>
              <div className="home-cycle-node accent">
                <div className="home-cycle-title">Ovary</div>
                <div className="home-cycle-sub">↑ Androgens</div>
              </div>
              <div className="home-cycle-connector">
                <span className="home-cycle-dot" />
                <span className="home-cycle-dot" />
                <span className="home-cycle-dot" />
              </div>
              <div className="home-cycle-node accent">
                <div className="home-cycle-title">Insulin</div>
                <div className="home-cycle-sub">↑ Resistance</div>
              </div>
              <div className="home-cycle-node">
                <div className="home-cycle-title">Cortisol</div>
                <div className="home-cycle-sub">Adrenal impact</div>
              </div>
            </div>
          </div>
          <div className="home-floating-badge">
            <div className="home-badge-dot" />
            <div>
              <div className="home-badge-text">1 in 10 women affected</div>
              <div className="home-badge-sub">70% remain undiagnosed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="home-stats-strip">
        <div className="home-stats-label">PCOS awareness</div>
        <div className="home-stats-grid">
          {stats.map((s, i) => (
            <div className="home-stat-item" key={i}>
              <div className="home-stat-num">{s.num}</div>
              <div className="home-stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <div className="home-features-header">
          <div className="home-features-eyebrow">Everything you need</div>
          <h2 className="home-features-title">Three pillars of PCOS management</h2>
        </div>
        <div className="home-features-grid">
          {features.map((f, i) => (
            <div className="home-feature-card" key={i} onClick={() => navigate(f.path)}>
              <div className={`home-feature-icon ${f.iconClass}`}>{f.icon}</div>
              <div className="home-feature-title">{f.title}</div>
              <div className="home-feature-desc">{f.desc}</div>
              <div className="home-feature-link">{f.link} →</div>
            </div>
          ))}
        </div>
      </section>
  <section className="home-learn">
        <div className="home-learn-card">
          <div className="home-learn-left">
            <h2>Understand PCOS</h2>
            <p>
              Learn about symptoms, menstrual cycle, causes, and how to manage PCOS.
            </p>

            <button onClick={() => navigate("/about")}>
              Learn more →
            </button>
          </div>
        </div>
      </section>
      
      {/* CTA Banner */}
      
    </div>
  );
}
