import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";

const COMPANIONS = [
  { id: "arch", name: "Archlord", color: "#3b82f6" },
  { id: "data", name: "Data", color: "#f59e0b" },
  { id: "para", name: "Para", color: "#10b981" },
  { id: "secu", name: "Secu", color: "#ef4444" },
  { id: "bio", name: "Bio", color: "#a78bfa" },
  { id: "ubu", name: "Ubu", color: "#84cc16" },
  { id: "art", name: "Art", color: "#f97316" },
];

const ChatPage = () => {
  const [activeCompanion, setActiveCompanion] = useState("data");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([]);
    setLoading(true);
    fetch("/api/memes/chat/greeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companionId: activeCompanion }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages([
          { id: Date.now(), text: data.reply, sender: "companion" },
        ]);
      })
      .catch(() => {
        setMessages([
          {
            id: Date.now(),
            text: "Salut ! Je suis prêt à t'aider.",
            sender: "companion",
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [activeCompanion]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/memes/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companionId: activeCompanion, message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: data.reply, sender: "companion" },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Désolé, erreur de connexion. Réessaie plus tard.",
          sender: "companion",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const activeColor =
    COMPANIONS.find((c) => c.id === activeCompanion)?.color || "#7c3aed";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "12px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(10, 10, 26, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img
            src="/asset/logo/logo_sans_fond.png"
            alt="Viral Stick Logo"
            style={{ width: 50, height: 50, objectFit: "contain" }}
          />
          <Link
            to="/"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            ← Retour
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <CompanionAvatarWeb companion={activeCompanion} size={96} />
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>
            Chat
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, marginTop: "80px" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "300px",
            borderRight: "1px solid rgba(255, 255, 255, 0.05)",
            padding: "24px",
            overflowY: "auto",
            background: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "rgba(255, 255, 255, 0.4)",
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Compagnons IA
          </p>
          {COMPANIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCompanion(c.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                background:
                  activeCompanion === c.id ? `${c.color}15` : "transparent",
                border:
                  activeCompanion === c.id
                    ? `1px solid ${c.color}40`
                    : "1px solid transparent",
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.3s",
                marginBottom: "12px",
              }}
              onMouseEnter={(e) => {
                if (activeCompanion !== c.id) {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeCompanion !== c.id) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <CompanionAvatarWeb companion={c.id} size={80} />
              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    display: "block",
                    color:
                      activeCompanion === c.id
                        ? c.color
                        : "rgba(255, 255, 255, 0.9)",
                    fontWeight: activeCompanion === c.id ? "700" : "500",
                    fontSize: "15px",
                  }}
                >
                  {c.name}
                </span>
                <span
                  style={{
                    display: "block",
                    color: "rgba(255, 255, 255, 0.4)",
                    fontSize: "12px",
                    marginTop: "2px",
                  }}
                >
                  Compagnon
                </span>
              </div>
            </button>
          ))}
        </aside>

        {/* Chat Area */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent:
                    m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                  alignItems: "flex-end",
                  gap: "12px",
                }}
              >
                {m.sender === "companion" && (
                  <CompanionAvatarWeb companion={activeCompanion} size={64} />
                )}
                <div
                  style={{
                    background:
                      m.sender === "user"
                        ? "linear-gradient(135deg, #7c3aed, #5b21b6)"
                        : "rgba(255, 255, 255, 0.06)",
                    padding: "20px 24px",
                    borderRadius:
                      m.sender === "user"
                        ? "24px 24px 8px 24px"
                        : "24px 24px 24px 8px",
                    color: "#f3f4f6",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    boxShadow:
                      m.sender === "user"
                        ? "0 4px 20px rgba(124, 58, 237, 0.3)"
                        : "none",
                    border:
                      m.sender === "companion"
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : "none",
                  }}
                >
                  {m.text}
                </div>
                {m.sender === "user" && (
                  <CompanionAvatarWeb companion={activeCompanion} size={64} />
                )}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  padding: "20px",
                  alignItems: "center",
                }}
              >
                <CompanionAvatarWeb companion={activeCompanion} size={64} />
                <div style={{ display: "flex", gap: "8px" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      background: activeColor,
                      borderRadius: "50%",
                      animation: "pulse 1s infinite",
                    }}
                  ></span>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      background: activeColor,
                      borderRadius: "50%",
                      animation: "pulse 1s infinite 0.2s",
                    }}
                  ></span>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      background: activeColor,
                      borderRadius: "50%",
                      animation: "pulse 1s infinite 0.4s",
                    }}
                  ></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: "24px 32px",
              borderTop: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              gap: "16px",
              background: "rgba(0, 0, 0, 0.2)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Écrivez votre message..."
              style={{
                flex: 1,
                padding: "18px 24px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                color: "#f3f4f6",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = `${activeColor}50`)}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")
              }
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: "18px 32px",
                background: loading
                  ? "rgba(124, 58, 237, 0.5)"
                  : `linear-gradient(135deg, ${activeColor}, ${activeColor}dd)`,
                color: "white",
                border: "none",
                borderRadius: "24px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: `0 8px 24px ${activeColor}40`,
              }}
              onMouseEnter={(e) => {
                if (!loading && input.trim()) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = `0 12px 32px ${activeColor}60`;
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 8px 24px ${activeColor}40`;
              }}
            >
              Envoyer
            </button>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
