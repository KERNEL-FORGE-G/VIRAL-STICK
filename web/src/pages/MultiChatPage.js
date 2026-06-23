import React, { useEffect, useState } from "react";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell, { pageStyles } from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import AppIcon from "../components/AppIcon";
import WhatsAppShareButton from "../components/WhatsAppShareButton";
import { colors, shadows } from "../theme/tokens";

const COMPANIONS = [
  { id: "arch", name: "Archlord", color: colors.arch, role: "Cap produit" },
  { id: "data", name: "Data", color: colors.data, role: "Analyse" },
  { id: "para", name: "Para", color: colors.para, role: "Clarté UX" },
  { id: "secu", name: "Secu", color: colors.secu, role: "Risque" },
  { id: "bio", name: "Bio", color: colors.bio, role: "Énergie" },
  { id: "ubu", name: "Ubu", color: colors.ubu, role: "Chute" },
  { id: "art", name: "Art", color: colors.art, role: "Visuel" },
];

const formatTime = () =>
  new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
            time: "maintenant",
          });
          newStatuses[c.id] = "done";
        } catch {
          greets.push({
            id: `g-${c.id}`,
            text: `${c.name} est en ligne.`,
            sender: c.id,
            companion: c.id,
            time: "maintenant",
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
    const currentInput = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: currentInput,
        sender: "user",
        time: formatTime(),
      },
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
            time: formatTime(),
          });
          newStatuses[c.id] = "done";
        } catch {
          replies.push({
            id: `${Date.now()}-${c.id}`,
            text: "Réponse indisponible pour le moment.",
            sender: c.id,
            companion: c.id,
            time: "maintenant",
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
      <section
        style={{
          ...pageStyles.panel,
          minHeight: 760,
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          overflow: "hidden",
        }}
      >
        <aside
          style={{
            borderRight: `1px solid ${colors.border}`,
            background: "rgba(255,255,255,0.03)",
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{ padding: 12, borderBottom: `1px solid ${colors.border}` }}
          >
            <div style={{ fontWeight: 900, fontSize: 18 }}>Board actif</div>
            <div
              style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}
            >
              Une logique de salon proche de WhatsApp, avec tous les compagnons
              connectés.
            </div>
          </div>

          {COMPANIONS.map((c) => (
            <div
              key={c.id}
              style={{
                padding: 12,
                borderRadius: 18,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${colors.border}`,
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 10,
                alignItems: "center",
              }}
            >
              <CompanionAvatarWeb companion={c.id} size={54} />
              <div>
                <div style={{ fontWeight: 800, color: c.color }}>{c.name}</div>
                <div style={{ color: colors.textMuted, fontSize: 12 }}>
                  {c.role}
                </div>
              </div>
              <div
                style={{
                  padding: "5px 8px",
                  borderRadius: 999,
                  background: `${c.color}18`,
                  color: c.color,
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                {statuses[c.id] || "idle"}
              </div>
            </div>
          ))}
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
            <div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>
                Salon collectif
              </div>
              <div style={{ color: colors.textMuted, fontSize: 14 }}>
                Tous les compagnons répondent en parallèle.
              </div>
            </div>
            <WhatsAppShareButton
              text="Je pilote un board de compagnons sur Viral Stick."
              url={window.location.href}
              label="Partager ce salon"
              style={{ minHeight: 46, padding: "12px 18px" }}
            />
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
              Canal multi-compagnons · style messagerie groupe
            </div>

            {messages.map((m) => {
              const isUser = m.sender === "user";
              const meta = COMPANIONS.find((c) => c.id === m.companion);
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
                      maxWidth: "76%",
                      padding: "12px 14px 10px",
                      borderRadius: isUser
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      background: isUser
                        ? "linear-gradient(135deg, rgba(139,92,246,0.92), rgba(34,211,238,0.82))"
                        : "rgba(255,255,255,0.07)",
                      border: isUser ? "none" : `1px solid ${colors.border}`,
                      boxShadow: isUser ? shadows.glow : shadows.lift,
                    }}
                  >
                    {!isUser && meta ? (
                      <div
                        style={{
                          color: meta.color,
                          fontSize: 12,
                          fontWeight: 900,
                          marginBottom: 4,
                        }}
                      >
                        {meta.name}
                      </div>
                    ) : null}
                    <div style={{ color: colors.text, lineHeight: 1.6 }}>
                      {m.text}
                    </div>
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
                Le groupe prépare ses réponses…
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
                if (e.key === "Enter") sendToAll();
              }}
              placeholder="Parler à tout le board..."
              style={{ ...pageStyles.input, minHeight: 54 }}
            />
            <PremiumButton
              onClick={sendToAll}
              icon={<AppIcon name="multiChat" size={18} color="#fff" />}
              style={{ minHeight: 54 }}
            >
              {loading ? "Envoi..." : "Envoyer"}
            </PremiumButton>
          </div>
        </main>
      </section>
    </WebShell>
  );
};

export default MultiChatPage;
