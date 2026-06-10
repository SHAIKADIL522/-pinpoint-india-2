import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";

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
        borderRadius: 14,
        overflow: "hidden",
        background: "rgba(15,22,41,0.6)",
        border: "1px solid rgba(99,102,241,0.2)",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background:
            "linear-gradient(90deg, rgba(99,102,241,0.1), transparent)",
        }}
      >
        <span style={{ fontSize: 16 }}>🤖</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc" }}>
          AI Chat Assistant
        </span>
        <span style={{ fontSize: 11, color: "#475569" }}>
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
                    ? "rgba(59,130,246,0.2)"
                    : "rgba(255,255,255,0.05)",
                border: `1px solid ${msg.role === "user" ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.08)"}`,
                fontSize: 13,
                color: msg.role === "user" ? "#93c5fd" : "#e2e8f0",
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
                  background: "#6366f1",
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
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything…"
          disabled={loading}
          style={{
            flex: 1,
            height: 38,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: "0 14px",
            color: "#e2e8f0",
            fontSize: 13,
            fontFamily: "var(--font-body)",
            outline: "none",
          }}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={send}
          disabled={loading}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            cursor: "pointer",
            background: input.trim()
              ? "rgba(99,102,241,0.3)"
              : "rgba(255,255,255,0.04)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc",
            fontSize: 16,
            transition: "all 0.2s",
          }}
        >
          ➤
        </motion.button>
      </div>
    </div>
  );
}
