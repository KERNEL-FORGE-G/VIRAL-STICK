import React, { useState, useEffect } from "react";
import "./App.css";

const FEATURES = [
  {
    id: "context",
    icon: "📖",
    title: "Context Reader",
    tagline: "Analyse un texte et génère un mème IA",
    description:
      "Colle un texte, une conversation ou un statut. Notre IA détecte le ton, le contexte et les personnages, puis génère un mème ou un sticker parfaitement adapté.",
    gradient: "linear-gradient(135deg, #7C3AED, #3B82F6)",
    companion: "art",
  },
  {
    id: "voice",
    icon: "🎙️",
    title: "Voice → Mème",
    tagline: "Parle, ton mème se génère automatiquement",
    description:
      "Enregistre ta voix depuis le mobile, notre IA transcrit et analyse ton ton. En quelques secondes, transforme tes paroles en sticker viral.",
    gradient: "linear-gradient(135deg, #06B6D4, #7C3AED)",
    companion: "ubu",
  },
  {
    id: "remixer",
    icon: "🎨",
    title: "Status Remixer",
    tagline: "Remixe tes images en stickers viraux",
    description:
      "Importe une image, applique des filtres, ajoute du texte et des effets. Remixe tes photos en stickers uniques prêts à partager.",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    companion: "bio",
  },
];

const COMPANIONS = [
  { id: "arch", name: "Archlord", role: "PDG & Admin" },
  { id: "art", name: "Art", role: "Artiste Visuel" },
  { id: "ubu", name: "Ubu", role: "Humoriste" },
  { id: "bio", name: "Bio", role: "Créatif" },
  { id: "data", name: "Data", role: "Analyste" },
  { id: "para", name: "Para", role: "Stratège" },
  { id: "secu", name: "Secu", role: "Gardien" },
];

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="app">
      {/* ── Header ─────────────────────────────────── */}
      <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
        <div className="header-inner">
          <div className="logo-wrap">
            <img
              src="/asset/logo/logo_sans_fond.png"
              alt="Viral Stick"
              className="logo-img"
            />
            <span className="logo-text">
              Viral <strong>Stick</strong>
            </span>
          </div>
          <nav className="nav">
            <a href="#features">Fonctionnalités</a>
            <a href="#companions">Compagnons</a>
            <a href="#about">À propos</a>
          </nav>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge">Générateur IA Multimodal</div>
          <h1 className="hero-title">
            Crée du contenu <span className="gradient-text">viral</span>
            <br />
            en un clic
          </h1>
          <p className="hero-subtitle">
            Context Reader, Voice to Meme, Status Remixer — trois outils IA pour
            transformer vos idées en stickers et mèmes prêts à partager.
          </p>
          <div className="hero-actions">
            <a href="#features" className="btn-primary">
              Découvrir
            </a>
            <a href="#companions" className="btn-secondary">
              Nos Compagnons
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-glow" />
          <img
            src="/asset/compagnons/arch_sans_fond.png"
            alt="Archlord"
            className="hero-mascot"
          />
        </div>
      </section>

      {/* ── Features ────────────────────────────────── */}
      <section id="features" className="features">
        <div className="section-label">FONCTIONNALITÉS</div>
        <h2 className="section-title">
          Tout ce dont tu as besoin pour{" "}
          <span className="gradient-text">devenir viral</span>
        </h2>
        <p className="section-desc">
          Trois modules complémentaires propulsés par l'IA Générative.
        </p>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.id}
              className="feature-card"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div
                className="feature-card-glow"
                style={{ background: f.gradient }}
              />
              <div className="feature-card-inner">
                <div
                  className="feature-icon-wrap"
                  style={{ background: f.gradient }}
                >
                  <span className="feature-icon">{f.icon}</span>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-tagline">{f.tagline}</p>
                <p className="feature-desc">{f.description}</p>
                <div className="feature-companion">
                  <img
                    src={`/asset/compagnons/${f.companion}_sans_fond.png`}
                    alt={f.companion}
                    className="feature-companion-img"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Companions ──────────────────────────────── */}
      <section id="companions" className="companions">
        <div className="section-label">ÉQUIPE</div>
        <h2 className="section-title">
          Rencontre les <span className="gradient-text">Compagnons</span>
        </h2>
        <p className="section-desc">
          7 personnalités IA prêtes à t'assister dans la création.
        </p>

        <div className="companions-grid">
          {COMPANIONS.map((c) => (
            <div key={c.id} className="companion-card">
              <div className="companion-avatar-wrap">
                <div className="companion-glow" />
                <img
                  src={`/asset/compagnons/${c.id}_sans_fond.png`}
                  alt={c.name}
                  className="companion-avatar"
                />
              </div>
              <h4 className="companion-name">{c.name}</h4>
              <p className="companion-role">{c.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="cta">
        <div className="cta-glow" />
        <h2 className="cta-title">Prêt à créer du contenu viral ?</h2>
        <p className="cta-desc">
          Rejoins KERNEL FORGE et propulse ta créativité avec l'IA.
        </p>
        <div className="cta-actions">
          <a
            href="https://github.com/Archlord12345/VIRAL-STICK"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Code source →
          </a>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer id="about" className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img
              src="/asset/logo/logo_sans_fond.png"
              alt="Viral Stick"
              className="footer-logo"
            />
            <div>
              <strong>Viral Stick</strong>
              <p>Générateur IA Multimodal — ICT202</p>
            </div>
          </div>
          <div className="footer-links">
            <p className="footer-credit">
              Projet académique — Université de Yaoundé I
            </p>
            <p className="footer-copy">KERNEL FORGE &copy; 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
