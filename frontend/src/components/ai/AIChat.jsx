import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import PremiumInput from "../ui/PremiumInput";

export default function AIChat({ context }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I know all about ${context?.district || "this area"}. Ask me anything! 🗺️`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const { data } = await api.post("/ai/chat", {
        messages: newMessages.slice(-6),
        context,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      const msg =
        err?.response?.data?.error || "Sorry, couldn't connect. Try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "rgba(15,23,42,0.6)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "linear-gradient(90deg, rgba(34,211,238,0.08), transparent)",
        }}
      >
        <span style={{ fontSize: 16 }}>✨</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
          AI Chat Assistant
        </span>
        <span style={{ fontSize: 11, color: "#64748B" }}>
          · Ask anything about {context?.district}
        </span>
      </div>

      {/* Messages */}
      <div
        style={{
          height: 220,
          overflowY: "auto",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                maxWidth: "85%",
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                padding: "9px 14px",
                borderRadius:
                  msg.role === "user"
                    ? "14px 14px 4px 14px"
                    : "14px 14px 14px 4px",
                background:
                  msg.role === "user"
                    ? "rgba(34,211,238,0.12)"
                    : "rgba(255,255,255,0.04)",
                border: `1px solid ${msg.role === "user" ? "rgba(34,211,238,0.25)" : "rgba(255,255,255,0.08)"}`,
                fontSize: 13,
                color: msg.role === "user" ? "#67E8F9" : "#E2E8F0",
                lineHeight: 1.6,
              }}
            >
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              display: "flex",
              gap: 4,
              padding: "10px 14px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 12,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22D3EE",
                  animation: `bounce 1.2s ease ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
        <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
      </div>

      {/* Input */}
      <div
        style={{
          padding: "10px 12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          gap: 8,
        }}
      >
        <PremiumInput
          size="sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything…"
          disabled={loading}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={send}
          disabled={loading}
          style={{
            width: 38,
            height: 38,
            flexShrink: 0,
            borderRadius: 10,
            cursor: "pointer",
            background: input.trim()
              ? "linear-gradient(135deg, #22D3EE 0%, #10B981 100%)"
              : "rgba(255,255,255,0.04)",
            border: "1px solid rgba(34,211,238,0.25)",
            color: input.trim() ? "#020617" : "#67E8F9",
            fontSize: 16,
            fontWeight: 800,
            transition: "all 0.2s",
          }}
        >
          ➤
        </motion.button>
      </div>
    </div>
  );
}