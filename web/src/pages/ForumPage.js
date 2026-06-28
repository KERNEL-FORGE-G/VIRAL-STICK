import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import WhatsAppShareButton from "../components/WhatsAppShareButton";
import { colors, radius } from "../theme/tokens";
import { useUser } from "../contexts/UserContext";

const handleDownloadImage = (imageUrl) => {
  if (!imageUrl) return;
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `viral-stick-${Date.now()}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Skeleton Loader Component
const MemeSkeleton = () => (
  <div className="duo-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column", position: "relative", padding: "16px" }}>
    <div style={{
      width: "100%", aspectRatio: "1/1", backgroundColor: colors.cloudGray, borderRadius: radius.md, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
    <div style={{ marginTop: 12, height: 20, backgroundColor: colors.cloudGray, borderRadius: radius.sm, width: "80%" }} />
  </div>
);

const ForumPage = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("createdAt");
  const [likingId, setLikingId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();
  const { userId } = useUser();

  const fetchMemes = useCallback(async (reset = false) => {
    const currentPage = reset ? 1 : page;
    if (reset) {
      setMemes([]);
      setPage(1);
      setHasMore(true);
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ sortBy, page: currentPage, limit: 20 });
      if (userId) params.append("userId", userId);
      const res = await fetch(`/api/forum/memes?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
      const data = await res.json();
      const newMemes = Array.isArray(data) ? data : [];
      if (reset) {
        setMemes(newMemes);
      } else {
          setMemes(prev => [...prev, ...newMemes]);
      }
      setHasMore(newMemes.length === 20);
    } catch (e) {
      console.error("Fetch memes error:", e);
      if (reset) setMemes([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sortBy, userId, page]);

  useEffect(() => {
    fetchMemes(true);
  }, [sortBy, userId]);

  const lastMemeElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && memes.length > 0) {
        setLoadingMore(true);
        setPage(prev => prev + 1);
      }
    }, { rootMargin: "200px" });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, memes.length]);

  useEffect(() => {
    if (page > 1 && !loading && !loadingMore) {
      fetchMemes(false);
    }
  }, [page]);

  const handleLike = async (id) => {
    if (!userId) {
      navigate("/auth");
      return;
    }

    // Empêcher les clics multiples sur le même mème
    if (likingId === id) return;
    
    setLikingId(id);

    try {
      const res = await fetch(`/api/forum/like/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });

      if (res.ok) {
        const result = await res.json();
        // Optimistic UI update or wait for server response
        setMemes(prev => prev.map(m =>
          m.id === id
            ? {
                ...m,
                likes: result.liked ? (m.likes || 0) + 1 : Math.max(0, (m.likes || 0) - 1),
                likedByUser: result.liked
              }
            : m
        ));
      }
    } catch (e) {
      console.error("Like error:", e);
    } finally {
      setLikingId(null);
    }
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

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
          <PremiumButton variant="primary" onClick={() => navigate("/leaderboard")} style={{ whiteSpace: "nowrap" }}>🏆 Classement</PremiumButton>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {[1, 2, 3, 4, 5, 6].map(i => <MemeSkeleton key={i} />)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {memes.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: colors.silver }}>
              Aucun mème trouvé. Sois le premier à publier !
            </div>
          )}
          {memes.map((meme, index) => (
            <div 
              key={meme.id} 
              ref={index === memes.length -1 ? lastMemeElementRef : null}
              className="duo-card" 
              style={{ overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}
            >
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
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "block", fontSize: 18, fontWeight: 900, color: colors.duoGreen }}>{meme.likes || 0}</span>
                    <span style={{ fontSize: 10, color: colors.silver, fontWeight: 800 }}>LIKES</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "block", fontSize: 18, fontWeight: 900, color: colors.duoBlue }}>{meme.remixes || 0}</span>
                    <span style={{ fontSize: 10, color: colors.silver, fontWeight: 800 }}>REMIX</span>
                  </div>
                  {meme.username && (
                    <div style={{ flex: 1, textAlign: "right", alignSelf: "center" }}>
                      <span style={{ fontSize: 12, color: colors.silver, fontWeight: 700 }}>par {meme.username}</span>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <PremiumButton 
                    variant={meme.likedByUser ? "green" : "ghost"} 
                    onClick={() => handleLike(meme.id)} 
                    style={{ flex: 1, minHeight: 40 }}
                    disabled={likingId === meme.id}
                  >
                    {likingId === meme.id ? "⏳" : (meme.likedByUser ? "❤️ Liked" : "❤️ Liker")}
                  </PremiumButton>
                  <PremiumButton
                    variant="primary"
                    onClick={() => navigate("/remix", { state: { imageUrl: meme.imageUrl, sourceMemeId: meme.id } })}
                    style={{ flex: 1, minHeight: 40 }}
                  >
                    ✨ Remix
                  </PremiumButton>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <WhatsAppShareButton
                    text="Regarde ce mème ! 🔥"
                    imageDataUrl={meme.imageUrl}
                    label="WhatsApp"
                    style={{ flex: 1, minHeight: 40 }}
                  />
                  <PremiumButton
                    variant="ghost"
                    onClick={() => handleDownloadImage(meme.imageUrl)}
                    style={{ flex: 1, minHeight: 40 }}
                  >
                    📥 Télécharger
                  </PremiumButton>
                </div>
              </div>
            </div>
          ))}
          {loadingMore && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 20 }}>
              <div style={{ 
                width: 30, height: 30, 
                border: `3px solid ${colors.cloudGray}`, 
                borderTopColor: colors.duoGreen, 
                borderRadius: "50%", 
                animation: "spin 0.8s linear infinite", 
                margin: "0 auto"
              }} />
            </div>
          )}
        </div>
      )}
    </WebShell>
  );
};

export default ForumPage;
