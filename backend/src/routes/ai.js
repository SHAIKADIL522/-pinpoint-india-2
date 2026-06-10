const express = require("express");
const axios   = require("axios");
const router  = express.Router();

const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";
const PRIMARY_MODEL  = "meta-llama/llama-3.1-8b-instruct";
const FALLBACK_MODEL = "mistralai/mistral-7b-instruct:free";

async function callOpenRouter(messages, max_tokens = 400, model = PRIMARY_MODEL) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set in .env");

  // FIX: old ternary was always truthy — VERCEL_URL overrode FRONTEND_URL
  const referer = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    const response = await axios.post(
      OPENROUTER_BASE,
      { model, max_tokens, messages },
      {
        headers: {
          Authorization:  `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer":  referer,
          "X-Title":       "PinPoint India 2.0",
        },
        timeout: 25000,
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from OpenRouter");
    return content.trim();
  } catch (err) {
    if (model === PRIMARY_MODEL) {
      console.warn(`Primary model failed (${err.message}), trying fallback...`);
      return callOpenRouter(messages, max_tokens, FALLBACK_MODEL);
    }
    throw err;
  }
}

// POST /api/ai/location-insight
router.post("/location-insight", async (req, res) => {
  const { pincode, district, state, postOfficeCount } = req.body;
  if (!pincode || !district || !state)
    return res.status(400).json({ error: "pincode, district, and state required." });

  const prompt = `You are an expert Indian geography and culture guide.

Location: Pincode ${pincode}, ${district}, ${state}
Post offices: ${postOfficeCount || "unknown"}

Write 3-4 engaging sentences covering:
1. What ${district} in ${state} is known for (culture, food, industry, history, or nature)
2. An interesting or surprising local fact
3. A practical tip for visitors or people doing business there

Flowing prose only. No bullet points. Warm, informative tone.`;

  try {
    const insight = await callOpenRouter([{ role: "user", content: prompt }], 400);
    res.json({ insight });
  } catch (err) {
    console.error("AI insight error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.message.includes("not set")
        ? "OPENROUTER_API_KEY missing in backend .env"
        : "Failed to generate AI insight. Check OPENROUTER_API_KEY.",
    });
  }
});

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  const { messages, context } = req.body;
  if (!messages?.length)
    return res.status(400).json({ error: "messages array required." });

  const systemPrompt = `You are a friendly, knowledgeable local guide for ${
    context?.district || "India"
  }${context?.state    ? `, ${context.state}`          : ""}${
    context?.pincode   ? ` (Pincode: ${context.pincode})` : ""
  }. Answer questions about this location. Keep replies to 2-3 sentences. Be helpful and friendly.`;

  try {
    const reply = await callOpenRouter(
      [{ role: "user", content: systemPrompt }, ...messages.slice(-8)],
      250
    );
    res.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.message.includes("not set")
        ? "OPENROUTER_API_KEY missing in backend .env"
        : "AI chat unavailable. Check OPENROUTER_API_KEY.",
    });
  }
});

module.exports = router;