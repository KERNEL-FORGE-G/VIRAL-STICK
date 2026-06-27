import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import { colors, radius } from "../theme/tokens";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ memes: 0, likes: 0, remixes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement du profil
    setTimeout(() => {
      setUser({
        username: "ViralUser",
        email: "user@viralstick.com",
        joinedAt: new Date().toLocaleDateString('fr-FR'),
        avatar: "arch"
      });
      setStats({ memes: 12, likes: 156, remixes: 8 });
      setLoading(false);
    }, 500);
  }, []);

  const handleLogout = () => {
    navigate("/auth");
  };

  if (loading) {
    return (
      <WebShell companion="data" title="Profil">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
          <div style={{ fontSize: 24, color: colors.silver }}>Chargement...</div>
        </div>
      </WebShell>
    );
  }

  return (
    <WebShell companion="data" title="Profil">
      {/* Hero Profile */}
      <div style={{
        display: "grid", gridTemplateColumns: "auto 1fr", gap: 32,
        alignItems: "center", marginBottom: 40,
        background: colors.bgSecondary, borderRadius: radius.xl,
        border: `2px solid ${colors.cloudGray}`, padding: "40px 48px",
        boxShadow: "0 2px 0 #e5e5e5",
      }}>
        <div style={{ animation: "floatSoft 4s ease-in-out infinite" }}>
          <CompanionAvatarWeb companion={user.avatar} size={120} />
        </div>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${colors.data}22`, color: colors.data,
            padding: "5px 14px", borderRadius: radius.pill,
            fontSize: 13, fontWeight: 800, marginBottom: 16,
          }}>
            👤 MON PROFIL
          </div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 40, color: colors.almostBlack, margin: "0 0 12px" }}>
            {user.username}
          </h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: colors.graphite, margin: "0 0 8px" }}>
            {user.email}
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: colors.silver, margin: 0 }}>
            Membre depuis le {user.joinedAt}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="duo-card" style={{ padding: 40, marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: colors.almostBlack, margin: "0 0 24px" }}>
          📊 Statistiques
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          <div style={{
            background: colors.bgSecondary, borderRadius: radius.lg,
            padding: 24, textAlign: "center", border: `2px solid ${colors.cloudGray}`
          }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: colors.sapphire, marginBottom: 8 }}>
              {stats.memes}
            </div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, color: colors.graphite }}>
              Mèmes créés
            </div>
          </div>
          <div style={{
            background: colors.bgSecondary, borderRadius: radius.lg,
            padding: 24, textAlign: "center", border: `2px solid ${colors.cloudGray}`
          }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: colors.successGreen, marginBottom: 8 }}>
              {stats.likes}
            </div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, color: colors.graphite }}>
              Likes reçus
            </div>
          </div>
          <div style={{
            background: colors.bgSecondary, borderRadius: radius.lg,
            padding: 24, textAlign: "center", border: `2px solid ${colors.cloudGray}`
          }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: colors.skyBlue, marginBottom: 8 }}>
              {stats.remixes}
            </div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, color: colors.graphite }}>
              Remixes
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "grid", gap: 16 }}>
        <PremiumButton
          variant="primary"
          onClick={() => navigate("/settings")}
          style={{ justifyContent: "center", padding: "16px" }}
        >
          ⚙️ Réglages
        </PremiumButton>
        <PremiumButton
          variant="ghost"
          onClick={handleLogout}
          style={{ justifyContent: "center", padding: "16px", borderColor: colors.danger, color: colors.danger }}
        >
          🚪 Déconnexion
        </PremiumButton>
      </div>
    </WebShell>
  );
};

export default ProfilePage;
