import { useState } from "react";
import "./About.css";

const pcosFactoids = [
  { icon: "👩", stat: "1 in 10", label: "Women of reproductive age have PCOS — one of the most common hormonal disorders worldwide." },
  { icon: "⏳", stat: "2–3 yrs", label: "Average time to get a PCOS diagnosis due to overlapping and variable symptoms." },
  { icon: "🧬", stat: "30+",     label: "Possible symptoms — from irregular periods to hair loss, acne, fatigue, and mood changes." },
  { icon: "📋", stat: "70%",     label: "Of women with PCOS remain undiagnosed, often mistaking symptoms for something else." },
];

const faqs = [
  {
    q: "What exactly is PCOS?",
    a: "Polycystic Ovary Syndrome (PCOS) is a hormonal disorder where the ovaries produce excess androgens (male hormones). This disrupts ovulation, causes irregular periods, and can lead to small fluid-filled follicles on the ovaries. Despite the name, not everyone with PCOS has cysts.",
  },
  {
    q: "Why does PCOS cause so many different symptoms?",
    a: "PCOS affects hormones — insulin, oestrogen, progesterone, and androgens — which regulate almost every system in your body. That's why it can show up as acne, hair thinning, weight changes, anxiety, infertility, and more, all at once or in different combinations.",
  },
  {
    q: "Is PCOS the same for everyone?",
    a: "No. PCOS is a spectrum. Some people have mostly metabolic issues (insulin resistance, weight gain), others have predominantly androgenic symptoms (acne, excess hair), and some mainly experience irregular cycles. Tracking is essential because your PCOS is unique to you.",
  },
  {
    q: "Can PCOS be cured?",
    a: "Currently there is no cure, but PCOS is very manageable. Lifestyle changes, medications, and consistent monitoring can significantly reduce symptoms and long-term risks like type 2 diabetes and cardiovascular disease.",
  },
];

export default function About() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="about-root">

      {/* App identity */}
      <section className="about-hero">
        <div className="hero-badge">About</div>
        <h1 className="hero-title">PCOS Health Tracker</h1>
        <p className="hero-sub">
          A dedicated tracking companion for people living with PCOS — helping
          you understand your patterns, manage your symptoms, and walk into
          every doctor's appointment fully prepared.
        </p>
      </section>

      {/* PCOS Education */}
      <section className="about-section">
        <div className="section-label">Understanding PCOS</div>
        <h2 className="section-title">What is PCOS?</h2>
        <p className="section-body">
          Polycystic Ovary Syndrome is one of the most common — and most
          misunderstood — hormonal conditions. It disrupts the balance of
          oestrogen, progesterone, and androgens, causing a wide range of
          symptoms that vary from person to person. Because of this variability,
          PCOS is notoriously hard to diagnose and easy to dismiss.
        </p>
        <div className="factoid-grid">
          {pcosFactoids.map((f) => (
            <div className="factoid-card" key={f.stat}>
              <div className="factoid-icon">{f.icon}</div>
              <div className="factoid-stat">{f.stat}</div>
              <div className="factoid-label">{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why PCOS-specific */}
      <section className="about-section about-section--tinted">
        <div className="section-label">Why PCOS-specific?</div>
        <h2 className="section-title">PCOS needs dedicated attention</h2>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">🔀</div>
            <h3>Hormonal complexity</h3>
            <p>PCOS involves at least four interacting hormones. Generic period trackers only log cycles — this app maps the full hormonal picture.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🎭</div>
            <h3>Symptom variety</h3>
            <p>PCOS looks different in every person. Personalised tracking reveals which symptoms are linked for you, not textbook averages.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🔍</div>
            <h3>Pattern recognition</h3>
            <p>Diet, sleep, stress — they all influence your hormones. Only consistent tracking reveals these invisible connections over time.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🩺</div>
            <h3>Doctor communication</h3>
            <p>Weeks of data instead of vague recollections transforms your appointments into productive, informed conversations.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="about-section">
        <div className="section-label">PCOS 101</div>
        <h2 className="section-title">Quick answers</h2>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div
              className={`faq-item ${openFaq === i ? "faq-item--open" : ""}`}
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <span className="faq-chevron">{openFaq === i ? "−" : "+"}</span>
              </div>
              {openFaq === i && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="about-section about-section--tinted">
        <div className="section-label">Your privacy</div>
        <h2 className="section-title">Your health data belongs to you</h2>
        <div className="privacy-grid">
          <div className="privacy-card">
            <div className="privacy-icon">🔒</div>
            <div className="privacy-title">Encrypted</div>
            <div className="privacy-desc">Data is encrypted on your device before it ever leaves it.</div>
          </div>
          <div className="privacy-card">
            <div className="privacy-icon">🚫</div>
            <div className="privacy-title">Never sold</div>
            <div className="privacy-desc">We never sell, share, or monetise your health information.</div>
          </div>
          <div className="privacy-card">
            <div className="privacy-icon">📤</div>
            <div className="privacy-title">Export anytime</div>
            <div className="privacy-desc">Download all your data as PDF or CSV — it's always yours.</div>
          </div>
          <div className="privacy-card">
            <div className="privacy-icon">🗑️</div>
            <div className="privacy-title">Delete anytime</div>
            <div className="privacy-desc">Remove your account and all data in one tap, no waiting.</div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="about-section">
        <div className="disclaimer-box">
          <div className="disclaimer-icon">⚕️</div>
          <div>
            <div className="disclaimer-title">Medical disclaimer</div>
            <div className="disclaimer-body">
              PCOS Health Tracker is a personal tracking tool, not a medical device.
              Information and insights are for informational purposes only and are
              not a substitute for professional medical advice, diagnosis, or treatment.
              Always consult a qualified healthcare provider — such as a gynaecologist
              or endocrinologist — about your PCOS management.
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="about-section about-section--tinted">
        <div className="section-label">Support</div>
        <h2 className="section-title">We're here for you</h2>
        <div className="connect-grid">
          <div className="connect-card">
            <div className="connect-icon">💬</div>
            <div className="connect-title">Send feedback</div>
            <div className="connect-desc">Use the in-app feedback form to share suggestions or report issues.</div>
          </div>
          <div className="connect-card">
            <div className="connect-icon">🌸</div>
            <div className="connect-title">Community</div>
            <div className="connect-desc">Join others navigating PCOS — find us on Instagram and Reddit.</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-logo">🌸 PCOS Health Tracker</div>
        <div className="footer-meta">Version 1.0.0 &nbsp;·&nbsp; Last updated May 2025</div>
        <div className="footer-links">
          <a href="#">Privacy policy</a>
          <a href="#">Terms of use</a>
        </div>
        <div className="footer-copy">Made with care for every person navigating PCOS. You are not alone.</div>
      </footer>

    </div>
  );
}