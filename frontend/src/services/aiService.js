import api from "../utils/api";

export async function getLocationInsight(payload) {
  const { data } = await api.post("/ai/location-insight", payload);
  return data;
}

export async function chatWithAI(messages, context) {
  const { data } = await api.post("/ai/chat", { messages, context });
  return data;
}
