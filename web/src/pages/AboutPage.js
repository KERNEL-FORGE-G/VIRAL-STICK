import React from "react";
import { Link } from "react-router-dom";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import { colors, radius } from "../theme/tokens";

const PILLARS = [
  { icon: "🎨", title: "Identité créative", text: "Une signature de marque forte portée par 7 compagnons IA uniques, chacun avec sa personnalité et son domaine d'expertise.", color: colors.art },
  { icon: "🧠", title: "IA multimodale",    text: "Texte, voix, image — trois canaux d'entrée connectés aux meilleurs modèles d'IA disponibles, avec système de fallback automatique.", color: colors.data },
  { icon: "🚀", title: "Contenu viral",      text: "Chaque outil est pensé pour produire du contenu prêt à poster, adapté à la culture de l'utilisateur.", color: colors.bio },
];

const TEAM = [
  { name: "Ravel", role: "Lead Technique & Fullstack", companion: "arch", github: "@Archlord12345" },
  { name: "Équipe", role: "Kernel Forge", companion: "data", github: "#KERNELFORGE" },
];

const TECH = [
  ["⚛️", "React 18 + React Native 0.75"],
  ["🟢", "Node.js / Express.js"],
  ["🖥️", "Puter AI"],
  ["💎", "Google Gemini (fallback)"],
  ["🌊", "Mistral AI (fallback)"],
  ["🎯", "7 compagnons IA personnalisés"],
];

const AboutPage = () => (
  <WebShell companion="arch" title="À propos">
    {/* Hero */}
    <section style={{
      display: "grid", gridTemplateColumns: "1fr auto", gap: 48,
      alignItems: "center", marginBottom: 48,
      background: colors.duoGreenLight, borderRadius: radius.xl,
      border: `2px solid ${colors.duoGreen}44`, padding: "48px 56px",
    }}>
      <div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: colors.snowWhite, color: colors.duoGreenDark,
          padding: "5px 14px", borderRadius: radius.pill,
          fontSize: 13, fontWeight: 800, marginBottom: 16,
        }}>
          MANIFESTE PRODUIT
        </div>
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 48, color: colors.almostBlack, margin: "0 0 20px", lineHeight: 1.1 }}>
          Créer du contenu viral,<br />
          <span style={{ color: colors.duoGreen }}>c'est notre mission.</span>
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 17, color: colors.charcoal, margin: "0 0 32px", lineHeight: 1.6, maxWidth: 540 }}>
          Viral Stick n'est pas juste un générateur de mèmes. C'est un studio de création
          IA complet, pensé pour les créateurs de contenu africains et francophones.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/context">
            <PremiumButton variant="primary">Essayer maintenant</PremiumButton>
          </Link>
          <a href="https://github.com/KERNEL-FORGE-G/VIRAL-STICK" target="_blank" rel="noopener noreferrer">
            <PremiumButton variant="ghost">GitHub ↗</PremiumButton>
          </a>
        </div>
      </div>
      <div style={{ animation: "floatSoft 4s ease-in-out infinite" }}>
        <CompanionAvatarWeb companion="arch" size={180} />
      </div>
    </section>

    {/* Piliers */}
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: colors.almostBlack, textAlign: "center", margin: "0 0 32px" }}>
        Notre vision
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {PILLARS.map((p) => (
          <div key={p.title} className="duo-card" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{p.icon}</div>
            <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: p.color, margin: "0 0 12px" }}>{p.title}</h3>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: colors.graphite, margin: 0, lineHeight: 1.6 }}>{p.text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Stack technique */}
    <section className="duo-card" style={{ padding: 40, marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: colors.almostBlack, margin: "0 0 24px" }}>
        🔧 Stack technique
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {TECH.map(([emoji, label]) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px", borderRadius: radius.md,
            background: colors.bgSecondary, border: `2px solid ${colors.cloudGray}`,
            fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, color: colors.charcoal,
          }}>
            <span style={{ fontSize: 20 }}>{emoji}</span>
            {label}
          </div>
        ))}
      </div>
    </section>

    {/* Équipe */}
    <section className="duo-card" style={{ padding: 40, marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: colors.almostBlack, margin: "0 0 32px" }}>
        👥 L'équipe
      </h2>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {TEAM.map((m) => (
          <div key={m.name} style={{
            display: "flex", alignItems: "center", gap: 20,
            padding: 24, borderRadius: radius.lg, flex: "1 1 300px",
            background: colors.bgSecondary, border: `2px solid ${colors.cloudGray}`,
            boxShadow: "0 2px 0 #e5e5e5",
          }}>
            <CompanionAvatarWeb companion={m.companion} size={72} />
            <div>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: colors.almostBlack, marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: colors.graphite, fontWeight: 700, marginBottom: 4 }}>{m.role}</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: colors.skyBlue, fontWeight: 800 }}>{m.github}</div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA footer */}
    <section style={{
      textAlign: "center", padding: "48px 32px",
      background: colors.bgSecondary, borderRadius: radius.xl,
      border: `2px solid ${colors.cloudGray}`,
    }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
        {["arch", "art", "bio"].map((id) => (
          <CompanionAvatarWeb key={id} companion={id} size={64} />
        ))}
      </div>
      <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: colors.almostBlack, margin: "0 0 12px" }}>
        KERNEL FORGE — 2026
      </h2>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: colors.silver, margin: "0 0 24px", fontWeight: 600 }}>
        Université de Yaoundé I · ICT202
      </p>
      <a href="https://github.com/KERNEL-FORGE-G/VIRAL-STICK" target="_blank" rel="noopener noreferrer">
        <PremiumButton variant="ghost">Voir le code source ↗</PremiumButton>
      </a>
    </section>
  </WebShell>
);

export default AboutPage;
