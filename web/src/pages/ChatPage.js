import React, { useEffect, useMemo, useState } from "react";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell, { pageStyles } from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import AppIcon from "../components/AppIcon";
import WhatsAppShareButton from "../components/WhatsAppShareButton";
import { colors, shadows } from "../theme/tokens";

const COMPANIONS = [
  {
    id: "arch",
    name: "Archlord",
    role: "Direction produit",
    color: colors.arch,
  },
  { id: "data", name: "Data", role: "Support & structure", color: colors.data },
  {
    id: "para",
    name: "Para",
    role: "Réglages & onboarding",
    color: colors.para,
  },
  {
    id: "secu",
    name: "Secu",
    role: "Sécurité & vigilance",
    color: colors.secu,
  },
  { id: "bio", name: "Bio", role: "Énergie visuelle", color: colors.bio },
  { id: "ubu", name: "Ubu", role: "Humour & imprévu", color: colors.ubu },
  { id: "art", name: "Art", role: "Direction artistique", color: colors.art },
];

const formatTime = () =>
  new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
          {
            id: Date.now(),
            text: data.reply,
            sender: "companion",
            companion: activeCompanion,
            time: "maintenant",
          },
        ]);
      })
      .catch(() => {
        setMessages([
          {
            id: Date.now(),
            text: "Salut. Le noyau social est prêt.",
            sender: "companion",
            companion: activeCompanion,
            time: "maintenant",
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [activeCompanion]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: userText,
        sender: "user",
        companion: activeCompanion,
        time: formatTime(),
      },
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
        {
          id: Date.now() + 1,
          text: data.reply,
          sender: "companion",
          companion: activeCompanion,
          time: formatTime(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Erreur de connexion au noyau conversationnel.",
          sender: "companion",
          companion: activeCompanion,
          time: "maintenant",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const active = useMemo(
    () => COMPANIONS.find((c) => c.id === activeCompanion) || COMPANIONS[0],
    [activeCompanion],
  );

  return (
    <WebShell title="Compagnons" companion={activeCompanion}>
      <section
        style={{
          ...pageStyles.panel,
          minHeight: 760,
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          overflow: "hidden",
        }}
      >
        <aside
          style={{
            borderRight: `1px solid ${colors.border}`,
            background: "rgba(255,255,255,0.03)",
            display: "flex",
            flexDirection: "column",
            minHeight: 760,
          }}
        >
          <div
            style={{
              padding: 18,
              borderBottom: `1px solid ${colors.border}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <CompanionAvatarWeb companion="arch" size={64} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>
                Boîte de réception
              </div>
              <div style={{ color: colors.textMuted, fontSize: 13 }}>
                Style inspiré de WhatsApp, version Viral Stick
              </div>
            </div>
          </div>

          <div
            style={{ padding: 14, borderBottom: `1px solid ${colors.border}` }}
          >
            <div
              style={{
                ...pageStyles.input,
                minHeight: 48,
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: colors.textMuted,
              }}
            >
              <AppIcon name="chat" size={16} color={colors.textMuted} />
              <span>Rechercher un compagnon</span>
            </div>
          </div>

          <div style={{ display: "grid", gap: 2, padding: 8 }}>
            {COMPANIONS.map((c) => {
              const isActive = c.id === activeCompanion;
              const preview =
                messages.findLast?.((m) => m.companion === c.id)?.text ||
                c.role;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCompanion(c.id)}
                  style={{
                    border: "none",
                    textAlign: "left",
                    padding: 14,
                    borderRadius: 18,
                    background: isActive ? `${c.color}18` : "transparent",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 12,
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <CompanionAvatarWeb companion={c.id} size={58} />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <span style={{ fontWeight: 800, color: colors.text }}>
                        {c.name}
                      </span>
                      <span style={{ fontSize: 12, color: colors.textMuted }}>
                        actif
                      </span>
                    </div>
                    <div
                      style={{
                        color: isActive
                          ? colors.textSecondary
                          : colors.textMuted,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginTop: 4,
                      }}
                    >
                      {preview}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: isActive ? c.color : "transparent",
                      boxShadow: isActive ? `0 0 18px ${c.color}` : "none",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </aside>

        <main
          style={{ display: "flex", flexDirection: "column", minHeight: 760 }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <CompanionAvatarWeb companion={active.id} size={72} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>
                  {active.name}
                </div>
                <div
                  style={{ color: active.color, fontWeight: 700, fontSize: 14 }}
                >
                  {active.role}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <WhatsAppShareButton
                text={`Je discute avec ${active.name} sur Viral Stick.`}
                url={window.location.href}
                label="Partager ce chat"
                style={{ minHeight: 46, padding: "12px 18px" }}
              />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: 22,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background:
                "radial-gradient(circle at top, rgba(255,255,255,0.03), transparent 24%), rgba(11,10,27,0.38)",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                alignSelf: "center",
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                color: colors.textMuted,
                fontSize: 12,
                boxShadow: shadows.lift,
              }}
            >
              Conversation sécurisée · style WhatsApp revisité
            </div>

            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "72%",
                      padding: "12px 14px 10px",
                      borderRadius: isUser
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      background: isUser
                        ? "linear-gradient(135deg, rgba(139,92,246,0.92), rgba(34,211,238,0.82))"
                        : "rgba(255,255,255,0.07)",
                      border: isUser ? "none" : `1px solid ${colors.border}`,
                      boxShadow: isUser ? shadows.glow : shadows.lift,
                      lineHeight: 1.6,
                    }}
                  >
                    {!isUser ? (
                      <div
                        style={{
                          color: active.color,
                          fontSize: 12,
                          fontWeight: 900,
                          marginBottom: 4,
                        }}
                      >
                        {active.name}
                      </div>
                    ) : null}
                    <div style={{ color: colors.text }}>{m.text}</div>
                    <div
                      style={{
                        marginTop: 8,
                        textAlign: "right",
                        fontSize: 11,
                        color: isUser
                          ? "rgba(255,255,255,0.74)"
                          : colors.textMuted,
                      }}
                    >
                      {m.time}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading ? (
              <div style={{ color: colors.textMuted, fontSize: 13 }}>
                Le compagnon écrit…
              </div>
            ) : null}
          </div>

          <div
            style={{
              padding: 16,
              borderTop: `1px solid ${colors.border}`,
              display: "flex",
              gap: 12,
              alignItems: "center",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${colors.border}`,
              }}
            >
              <AppIcon name="gallery" size={18} color={colors.textMuted} />
            </div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder={`Écris à ${active.name}...`}
              style={{ ...pageStyles.input, minHeight: 54 }}
            />
            <PremiumButton
              onClick={sendMessage}
              icon={<AppIcon name="chat" size={18} color="#fff" />}
              style={{ minHeight: 54 }}
            >
              Envoyer
            </PremiumButton>
          </div>
        </main>
      </section>
    </WebShell>
  );
};

export default ChatPage;
