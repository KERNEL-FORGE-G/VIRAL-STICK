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

const STATUS_LABELS = {
  idle: { text: "en attente", color: "rgba(255,255,255,0.3)" },
  loading: { text: "réfléchit...", color: "#FCD34D" },
  done: { text: "prêt", color: "#34D399" },
  error: { text: "erreur", color: "#F87171" },
};

const MultiChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    loadGreetings();
  }, []);

  const loadGreetings = async () => {
    setLoading(true);
    const greets = [];
    const newStatuses = {};

    await Promise.all(
      COMPANIONS.map(async (c) => {
        newStatuses[c.id] = "loading";
        setStatuses({ ...newStatuses });
        try {
          const res = await fetch("/api/memes/chat/greeting", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ companionId: c.id }),
          });
          const data = await res.json();
          greets.push({
            id: `g-${c.id}`,
            text: data.reply,
            sender: c.id,
            companion: c.id,
          });
          newStatuses[c.id] = "done";
        } catch {
          const fallbacks = {
            arch: "Bienvenue dans Viral Stick. Je suis Archlord.",
            data: "Salut ! Data ici, prêt à t'aider.",
            para: "Hey ! Para à ta disposition.",
            secu: "Sécurité activée. Tout est sous contrôle.",
            bio: "Yooo ! Bio en ligne !",
            ubu: "Ubu débarque !",
            art: "Art est là pour créer !",
          };
          greets.push({
            id: `g-${c.id}`,
            text: fallbacks[c.id] || "Bonjour !",
            sender: c.id,
            companion: c.id,
          });
          newStatuses[c.id] = "done";
        }
        setStatuses({ ...newStatuses });
      }),
    );

    greets.sort(
      (a, b) =>
        COMPANIONS.findIndex((c) => c.id === a.companion) -
        COMPANIONS.findIndex((c) => c.id === b.companion),
    );
    setMessages(greets);
    setLoading(false);
  };

  const sendToAll = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), text: input, sender: "user" };
    const currentInput = input;
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const newStatuses = {};
    const replies = [];

    await Promise.all(
      COMPANIONS.map(async (c) => {
        newStatuses[c.id] = "loading";
        setStatuses({ ...newStatuses });
        try {
          const res = await fetch("/api/memes/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ companionId: c.id, message: currentInput }),
          });
          const data = await res.json();
          replies.push({
            id: `${Date.now()}-${c.id}`,
            text: data.reply,
            sender: c.id,
            companion: c.id,
          });
          newStatuses[c.id] = "done";
        } catch {
          replies.push({
            id: `${Date.now()}-${c.id}`,
            text: "...",
            sender: c.id,
            companion: c.id,
          });
          newStatuses[c.id] = "error";
        }
        setStatuses({ ...newStatuses });
      }),
    );

    replies.sort(
      (a, b) =>
        COMPANIONS.findIndex((c) => c.id === a.companion) -
        COMPANIONS.findIndex((c) => c.id === b.companion),
    );
    setMessages((prev) => [...prev, ...replies]);
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)",
      }}
    >
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
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>
          Multi-Chat
        </h1>
      </header>

      <div style={{ display: "flex", flex: 1, marginTop: "80px" }}>
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Status Bar */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              padding: "16px 32px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              flexWrap: "wrap",
              background: "rgba(0,0,0,0.2)",
            }}
          >
            {COMPANIONS.map((c) => {
              const st = statuses[c.id] || "idle";
              const statusInfo = STATUS_LABELS[st];
              return (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 14px",
                    borderRadius: "20px",
                    background: `${c.color}15`,
                    border: `1px solid ${c.color}40`,
                    fontSize: "12px",
                  }}
                >
                  <CompanionAvatarWeb companion={c.id} size={28} />
                  <span style={{ fontWeight: "600", color: c.color }}>
                    {c.name}
                  </span>
                  <span style={{ color: statusInfo.color, fontSize: "11px" }}>
                    {statusInfo.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
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
                {m.sender !== "user" && (
                  <CompanionAvatarWeb companion={m.companion} size={44} />
                )}
                <div
                  style={{
                    background:
                      m.sender === "user"
                        ? "linear-gradient(135deg, #7c3aed, #5b21b6)"
                        : "rgba(255, 255, 255, 0.06)",
                    padding: "16px 20px",
                    borderRadius:
                      m.sender === "user"
                        ? "24px 24px 8px 24px"
                        : "24px 24px 24px 8px",
                    color: "#f3f4f6",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    boxShadow:
                      m.sender === "user"
                        ? "0 4px 20px rgba(124, 58, 237, 0.3)"
                        : "none",
                    border:
                      m.sender !== "user"
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : "none",
                  }}
                >
                  {m.sender !== "user" && (
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        marginBottom: "4px",
                        color:
                          COMPANIONS.find((c) => c.id === m.companion)?.color ||
                          "#a78bfa",
                      }}
                    >
                      {COMPANIONS.find((c) => c.id === m.companion)?.name}
                    </div>
                  )}
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  padding: "16px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "14px",
                    fontStyle: "italic",
                  }}
                >
                  Les compagnons réfléchissent...
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "20px 32px",
              borderTop: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              gap: "16px",
              background: "rgba(0, 0, 0, 0.2)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendToAll()}
              placeholder="Message à tous les compagnons..."
              style={{
                flex: 1,
                padding: "16px 24px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                color: "#f3f4f6",
                fontSize: "15px",
                outline: "none",
              }}
            />
            <button
              onClick={sendToAll}
              disabled={loading || !input.trim()}
              style={{
                padding: "16px 32px",
                background: loading
                  ? "rgba(124, 58, 237, 0.5)"
                  : "linear-gradient(135deg, #7c3aed, #5b21b6)",
                color: "white",
                border: "none",
                borderRadius: "24px",
                fontWeight: "700",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
              }}
            >
              Envoyer
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MultiChatPage;
