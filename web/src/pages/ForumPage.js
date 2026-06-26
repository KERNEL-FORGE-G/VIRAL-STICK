import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import { colors, radius } from "../theme/tokens";

const ForumPage = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const res = await fetch("/api/forum/memes");
      const data = await res.json();
      setMemes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erreur forum", e);
      setMemes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await fetch(`/api/forum/like/${id}`, { method: "POST" });
      if (res.ok) {
        setMemes(prev => prev.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m));
      }
    } catch (e) {
      console.error("Erreur like", e);
    }
  };

  const handleRemix = (meme) => {
    // Rediriger vers la page remix avec l'image du mème
    navigate("/remix", { state: { imageUrl: meme.imageUrl, text: `${meme.topText} ${meme.bottomText}` } });
  };

  return (
    <WebShell title="Forum Viral" companion="ubu">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 40, color: colors.almostBlack, margin: "0 0 8px" }}>
          Forum <span style={{ color: colors.duoGreen }}>Viral</span>
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: colors.graphite, margin: 0 }}>
          Découvre les meilleures créations de la communauté et remixe-les !
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48 }}>Chargement du flux...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {memes.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: colors.silver }}>
              Aucun mème partagé pour le moment. Sois le premier !
            </div>
          )}
          {memes.map((meme) => (
            <div key={meme.id} className="duo-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", background: colors.almostBlack }}>
                <img
                  src={meme.imageUrl}
                  alt="Mème"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 18, color: colors.duoGreen }}>
                    {meme.likes} ❤️
                  </span>
                  <span style={{ fontSize: 12, color: colors.silver }}>
                    {new Date(meme.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <PremiumButton
                    variant="ghost"
                    onClick={() => handleLike(meme.id)}
                    style={{ flex: 1, minHeight: 40, padding: "8px" }}
                  >
                    Liker
                  </PremiumButton>
                  <PremiumButton
                    variant="primary"
                    onClick={() => handleRemix(meme)}
                    style={{ flex: 1, minHeight: 40, padding: "8px" }}
                  >
                    Remixer
                  </PremiumButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </WebShell>
  );
};

export default ForumPage;
