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
            text: "Salut. Le noyau social est prêt.",
            sender: "companion",
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [activeCompanion]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: userText, sender: "user" },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/memes/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companionId: activeCompanion,
          message: userText,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: data.reply, sender: "companion" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Erreur de connexion au noyau conversationnel.",
          sender: "companion",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const activeColor =
    COMPANIONS.find((c) => c.id === activeCompanion)?.color ||
    colors.brandPrimary;

  return (
    <WebShell title="Compagnons" companion={activeCompanion}>
      <section
        style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}
      >
        <aside style={{ ...pageStyles.panel, padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Escouade</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {COMPANIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCompanion(c.id)}
                style={{
                  ...pageStyles.buttonGhost,
                  justifyContent: "flex-start",
                  padding: 12,
                  background:
                    activeCompanion === c.id
                      ? `${c.color}22`
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeCompanion === c.id ? c.color : colors.border}`,
                }}
              >
                <CompanionAvatarWeb companion={c.id} size={58} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </aside>

        <main
          style={{
            ...pageStyles.panel,
            padding: 20,
            minHeight: 620,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingBottom: 14,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <CompanionAvatarWeb companion={activeCompanion} size={70} />
            <div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>
                Canal {activeCompanion}
              </div>
              <div style={{ color: activeColor }}>
                Présence active et personnalité chargée
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              padding: "18px 0",
              overflowY: "auto",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent:
                    m.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "72%",
                    padding: "16px 18px",
                    borderRadius: 20,
                    background:
                      m.sender === "user"
                        ? `linear-gradient(135deg, ${colors.brandPrimary}, ${colors.brandSecondary})`
                        : "rgba(255,255,255,0.05)",
                    border:
                      m.sender === "user"
                        ? "none"
                        : `1px solid ${colors.border}`,
                    color: colors.text,
                    lineHeight: 1.6,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading ? (
              <div style={{ color: colors.textMuted }}>
                Le compagnon réfléchit...
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écris à ton compagnon..."
              style={pageStyles.input}
            />
            <button onClick={sendMessage} style={pageStyles.buttonPrimary}>
              Envoyer
            </button>
          </div>
        </main>
      </section>
    </WebShell>
  );
};

export default ChatPage;
