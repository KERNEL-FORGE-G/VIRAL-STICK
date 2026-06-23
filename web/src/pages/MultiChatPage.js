import React, { useState, useEffect } from "react";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell, { pageStyles } from "../components/WebShell";
import { colors } from "../theme/tokens";

const COMPANIONS = [
  { id: "arch", name: "Archlord", color: colors.arch },
  { id: "data", name: "Data", color: colors.data },
  { id: "para", name: "Para", color: colors.para },
  { id: "secu", name: "Secu", color: colors.secu },
  { id: "bio", name: "Bio", color: colors.bio },
  { id: "ubu", name: "Ubu", color: colors.ubu },
  { id: "art", name: "Art", color: colors.art },
];

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
          greets.push({
            id: `g-${c.id}`,
            text: `${c.name} est en ligne.`,
            sender: c.id,
            companion: c.id,
          });
          newStatuses[c.id] = "done";
        }
        setStatuses({ ...newStatuses });
      }),
    );

    setMessages(greets);
    setLoading(false);
  };

  const sendToAll = async () => {
    if (!input.trim() || loading) return;
    const currentInput = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: currentInput, sender: "user" },
    ]);
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

    setMessages((prev) => [...prev, ...replies]);
    setLoading(false);
  };

  return (
    <WebShell title="Multi-Chat" companion="arch">
      <section style={{ ...pageStyles.panel, padding: 24 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {COMPANIONS.map((c) => (
            <div
              key={c.id}
              style={{
                ...pageStyles.softPanel,
                padding: 12,
                textAlign: "center",
              }}
            >
              <CompanionAvatarWeb companion={c.id} size={66} />
              <div style={{ color: c.color, fontWeight: 800 }}>{c.name}</div>
              <div style={{ color: colors.textMuted, fontSize: 12 }}>
                {statuses[c.id] || "idle"}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "78%",
                  padding: "14px 16px",
                  borderRadius: 18,
                  background:
                    m.sender === "user"
                      ? `linear-gradient(135deg, ${colors.brandPrimary}, ${colors.brandSecondary})`
                      : "rgba(255,255,255,0.05)",
                  border:
                    m.sender === "user" ? "none" : `1px solid ${colors.border}`,
                }}
              >
                {m.sender !== "user" ? (
                  <div
                    style={{
                      color: colors[m.companion] || colors.textMuted,
                      fontSize: 12,
                      fontWeight: 800,
                      marginBottom: 6,
                    }}
                  >
                    {m.companion}
                  </div>
                ) : null}
                <div>{m.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Parler à toute l'équipe..."
            style={pageStyles.input}
          />
          <button onClick={sendToAll} style={pageStyles.buttonPrimary}>
            {loading ? "Envoi..." : "Envoyer à tous"}
          </button>
        </div>
      </section>
    </WebShell>
  );
};

export default MultiChatPage;
