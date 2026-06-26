import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import { colors, radius } from "../theme/tokens";

const ForumPage = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("createdAt");
  const navigate = useNavigate();

  useEffect(() => { fetchMemes(); }, [sortBy]);

  const fetchMemes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/forum/memes?sortBy=${sortBy}`);
      const data = await res.json();
      setMemes(Array.isArray(data) ? data : []);
    } catch (e) { setMemes([]); }
    finally { setLoading(false); }
  };

  const handleLike = async (id) => {
    const res = await fetch(`/api/forum/like/${id}`, { method: "POST" });
    if (res.ok) setMemes(prev => prev.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m));
  };

  return (
    <WebShell title="Leaderboard Viral" companion="ubu">
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 40, color: colors.almostBlack, margin: "0 0 8px" }}>
            Leaderboard <span style={{ color: colors.duoGreen }}>Viral</span>
          </h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: colors.graphite, margin: 0 }}>
            Les créations les plus chaudes de la communauté.
          </p>
        </div>

        <div style={{ display: "flex", background: colors.bgSecondary, padding: 4, borderRadius: radius.lg, border: `2px solid ${colors.cloudGray}` }}>
          {[
            { id: "createdAt", label: "Récents", icon: "🕒" },
            { id: "likes",     label: "Populaires", icon: "🔥" },
            { id: "remixes",   label: "Viraux", icon: "🔄" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSortBy(tab.id)}
              style={{
                padding: "10px 16px", borderRadius: radius.md, border: "none", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14,
                background: sortBy === tab.id ? colors.snowWhite : "transparent",
                color: sortBy === tab.id ? colors.duoGreenDark : colors.silver,
                boxShadow: sortBy === tab.id ? "0 2px 0 #e5e5e5" : "none",
                transition: "all 0.2s"
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 80, color: colors.silver }}>Chargement du flux...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {memes.map((meme, index) => (
            <div key={meme.id} className="duo-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
              {sortBy !== "createdAt" && index < 3 && (
                <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, background: colors.sunshineYellow, padding: "4px 10px", borderRadius: radius.pill, fontWeight: 900, fontSize: 12 }}>
                  #{index + 1} TOP
                </div>
              )}
              <div style={{ width: "100%", aspectRatio: "1/1", background: "#000" }}>
                <img src={meme.imageUrl} alt="Mème" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <div style={{ padding: 16, flex: 1 }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                  <div style={{ textAlign: "center" }}><Text style={{ display: "block", fontSize: 18, fontWeight: 900, color: colors.duoGreen }}>{meme.likes}</Text><Text style={{ fontSize: 10, color: colors.silver, fontWeight: 800 }}>LIKES</Text></div>
                  <div style={{ textAlign: "center" }}><Text style={{ display: "block", fontSize: 18, fontWeight: 900, color: colors.duoBlue }}>{meme.remixes || 0}</Text><Text style={{ fontSize: 10, color: colors.silver, fontWeight: 800 }}>REMIX</Text></div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <PremiumButton variant="ghost" onClick={() => handleLike(meme.id)} style={{ flex: 1, minHeight: 40 }}>❤️ Liker</PremiumButton>
                  <PremiumButton variant="primary" onClick={() => navigate("/remix", { state: { imageUrl: meme.imageUrl, sourceMemeId: meme.id } })} style={{ flex: 1, minHeight: 40 }}>✨ Remix</PremiumButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </WebShell>
  );
};
const Text = ({ children, style }) => <span style={style}>{children}</span>;
export default ForumPage;
