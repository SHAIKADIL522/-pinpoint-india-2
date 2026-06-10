// ─────────────────────────────────────────────────────────────
//  PinPoint India 2.0 — models.dev Service
//  Source: https://models.dev/api.json  (no API key required)
//
//  What the API returns (from source analysis):
//  {
//    data: [
//      {
//        id: "anthropic/claude-opus-4.6",
//        name: "Anthropic: Claude Opus 4.6",
//        created: 1770219050,           // Unix timestamp
//        description: "...",
//        context_length: 1000000,
//        architecture: {
//          modality: "text+image+file->text",
//          input_modalities: ["text","image","file"],
//          output_modalities: ["text"],
//          tokenizer: "Claude"
//        },
//        pricing: {
//          prompt: "0.000005",          // price per token (string)
//          completion: "0.000025",
//          web_search: "0.01",          // optional
//          input_cache_read: "...",     // optional
//          input_cache_write: "..."     // optional
//        },
//        top_provider: {
//          context_length: 1000000,
//          max_completion_tokens: 128000,
//          is_moderated: false
//        },
//        supported_parameters: ["max_tokens","reasoning",...],
//        knowledge_cutoff: "2025-01-31",  // nullable
//        expiration_date: null,
//        links: { details: "/api/v1/models/..." }
//      }
//    ]
//  }
//
//  Features:
//  - 1-hour in-memory cache (Redis-ready architecture)
//  - Search by name, provider, id
//  - Filter by modality, capability, pricing
//  - Compare models side-by-side
//  - Analytics: provider distribution, pricing stats, capability matrix
//  - Provider logo URL generation
// ─────────────────────────────────────────────────────────────

const env = require('../../config/env');

// ── Cache (1 hour TTL) ───────────────────────────────────────
let modelsCache = null;
let cacheTs = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// ── Fetch with timeout ───────────────────────────────────────
async function fetchModelsData() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(env.MODELS_DEV_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`models.dev returned ${res.status}`);
    const json = await res.json();
    if (!json?.data || !Array.isArray(json.data)) {
      throw new Error('Unexpected models.dev response shape');
    }
    return json.data;
  } finally {
    clearTimeout(timer);
  }
}

// ── Get all models (cached) ──────────────────────────────────
async function getAllModels() {
  const now = Date.now();
  if (modelsCache && now - cacheTs < CACHE_TTL_MS) {
    return { models: modelsCache, fromCache: true, cacheAge: Math.round((now - cacheTs) / 1000) };
  }

  const models = await fetchModelsData();
  modelsCache = models;
  cacheTs = now;
  return { models, fromCache: false, cacheAge: 0 };
}

// ── Extract provider slug from model ID ──────────────────────
function extractProvider(modelId) {
  if (!modelId) return 'unknown';
  const parts = modelId.split('/');
  return parts[0].replace(/^~/, ''); // strip ~ prefix for alias routes
}

// ── Parse price safely ───────────────────────────────────────
function parsePrice(val) {
  if (val == null) return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

// ── Compute price per million tokens ────────────────────────
function pricePerMillion(raw) {
  const p = parsePrice(raw);
  return p !== null ? Math.round(p * 1_000_000 * 1000) / 1000 : null;
}

// ── Normalize single model ───────────────────────────────────
function normalizeModel(m) {
  const provider = extractProvider(m.id);
  const promptPrice = parsePrice(m.pricing?.prompt);
  const completionPrice = parsePrice(m.pricing?.completion);

  // Free tier detection
  const isFree = m.id?.includes(':free') || (promptPrice === 0 && completionPrice === 0);

  // Capability flags derived from supported_parameters + architecture
  const params = m.supported_parameters || [];
  const inputModes = m.architecture?.input_modalities || [];
  const outputModes = m.architecture?.output_modalities || [];

  return {
    id: m.id || null,
    canonicalSlug: m.canonical_slug || null,
    name: m.name || null,
    provider,
    providerLogoUrl: `${env.MODELS_DEV_LOGOS_URL}/${provider}.svg`,
    created: m.created ? new Date(m.created * 1000).toISOString() : null,
    description: m.description || null,
    contextLength: m.context_length || null,
    maxCompletionTokens: m.top_provider?.max_completion_tokens || null,
    isModerated: m.top_provider?.is_moderated ?? null,

    // Architecture
    modality: m.architecture?.modality || null,
    inputModalities: inputModes,
    outputModalities: outputModes,
    tokenizer: m.architecture?.tokenizer || null,

    // Pricing (per token as float, also per million for display)
    pricing: {
      promptPerToken: promptPrice,
      completionPerToken: completionPrice,
      promptPerMillion: pricePerMillion(m.pricing?.prompt),
      completionPerMillion: pricePerMillion(m.pricing?.completion),
      webSearch: parsePrice(m.pricing?.web_search),
      cacheRead: parsePrice(m.pricing?.input_cache_read),
      cacheWrite: parsePrice(m.pricing?.input_cache_write),
      isFree,
    },

    // Capabilities
    capabilities: {
      reasoning: params.includes('reasoning') || params.includes('include_reasoning'),
      tools: params.includes('tools') || params.includes('tool_choice'),
      structuredOutput: params.includes('structured_outputs'),
      imageInput: inputModes.includes('image'),
      videoInput: inputModes.includes('video'),
      audioInput: inputModes.includes('audio'),
      fileInput: inputModes.includes('file'),
      imageOutput: outputModes.includes('image'),
      audioOutput: outputModes.includes('audio'),
      webSearch: m.pricing?.web_search != null,
      temperature: params.includes('temperature'),
    },

    knowledgeCutoff: m.knowledge_cutoff || null,
    expirationDate: m.expiration_date || null,
    supportedParameters: params,
    detailsUrl: m.links?.details || null,
  };
}

// ── SEARCH ───────────────────────────────────────────────────
/**
 * Search models by query string.
 * Matches against: name, id, provider, description
 */
async function searchModels(query, options = {}) {
  const { models } = await getAllModels();
  const q = (query || '').toLowerCase().trim();

  let results = models;

  // Text search
  if (q) {
    results = results.filter(m => {
      const name = (m.name || '').toLowerCase();
      const id = (m.id || '').toLowerCase();
      const desc = (m.description || '').toLowerCase();
      return name.includes(q) || id.includes(q) || desc.includes(q);
    });
  }

  return applyFiltersAndSort(results, options);
}

// ── FILTER ───────────────────────────────────────────────────
/**
 * Filter models by various criteria.
 * options: {
 *   provider, free, reasoning, tools, imageInput,
 *   minContext, maxPricePerMillion, sortBy
 * }
 */
async function filterModels(options = {}) {
  const { models } = await getAllModels();
  return applyFiltersAndSort(models, options);
}

function applyFiltersAndSort(models, options = {}) {
  const {
    provider,
    free,
    reasoning,
    tools,
    imageInput,
    audioInput,
    videoInput,
    structuredOutput,
    webSearch,
    minContext,
    maxPromptPricePerMillion,
    sortBy = 'created_desc',
    limit = 50,
    offset = 0,
  } = options;

  let results = models;

  if (provider) {
    const p = provider.toLowerCase();
    results = results.filter(m => extractProvider(m.id).toLowerCase() === p);
  }

  if (free === true || free === 'true') {
    results = results.filter(m => {
      const prompt = parsePrice(m.pricing?.prompt);
      const completion = parsePrice(m.pricing?.completion);
      return m.id?.includes(':free') || (prompt === 0 && completion === 0);
    });
  }

  if (reasoning === true || reasoning === 'true') {
    results = results.filter(m => {
      const params = m.supported_parameters || [];
      return params.includes('reasoning') || params.includes('include_reasoning');
    });
  }

  if (tools === true || tools === 'true') {
    results = results.filter(m => {
      const params = m.supported_parameters || [];
      return params.includes('tools') || params.includes('tool_choice');
    });
  }

  if (imageInput === true || imageInput === 'true') {
    results = results.filter(m => (m.architecture?.input_modalities || []).includes('image'));
  }

  if (audioInput === true || audioInput === 'true') {
    results = results.filter(m => (m.architecture?.input_modalities || []).includes('audio'));
  }

  if (videoInput === true || videoInput === 'true') {
    results = results.filter(m => (m.architecture?.input_modalities || []).includes('video'));
  }

  if (structuredOutput === true || structuredOutput === 'true') {
    results = results.filter(m => (m.supported_parameters || []).includes('structured_outputs'));
  }

  if (webSearch === true || webSearch === 'true') {
    results = results.filter(m => m.pricing?.web_search != null);
  }

  if (minContext) {
    const min = parseInt(minContext, 10);
    results = results.filter(m => (m.context_length || 0) >= min);
  }

  if (maxPromptPricePerMillion !== undefined) {
    const max = parseFloat(maxPromptPricePerMillion);
    if (!isNaN(max)) {
      results = results.filter(m => {
        const p = parsePrice(m.pricing?.prompt);
        if (p === null) return false;
        return p * 1_000_000 <= max;
      });
    }
  }

  // Sort
  results = sortModels(results, sortBy);

  const total = results.length;
  const off = parseInt(offset, 10) || 0;
  const lim = Math.min(parseInt(limit, 10) || 50, 200);
  const paginated = results.slice(off, off + lim);

  return {
    total,
    offset: off,
    limit: lim,
    models: paginated.map(normalizeModel),
  };
}

function sortModels(models, sortBy) {
  switch (sortBy) {
    case 'created_asc':
      return [...models].sort((a, b) => (a.created || 0) - (b.created || 0));
    case 'created_desc':
      return [...models].sort((a, b) => (b.created || 0) - (a.created || 0));
    case 'context_desc':
      return [...models].sort((a, b) => (b.context_length || 0) - (a.context_length || 0));
    case 'price_asc': {
      return [...models].sort((a, b) => {
        const pa = parsePrice(a.pricing?.prompt) ?? Infinity;
        const pb = parsePrice(b.pricing?.prompt) ?? Infinity;
        return pa - pb;
      });
    }
    case 'price_desc': {
      return [...models].sort((a, b) => {
        const pa = parsePrice(a.pricing?.prompt) ?? -1;
        const pb = parsePrice(b.pricing?.prompt) ?? -1;
        return pb - pa;
      });
    }
    case 'name_asc':
      return [...models].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    default:
      return [...models].sort((a, b) => (b.created || 0) - (a.created || 0));
  }
}

// ── COMPARE ──────────────────────────────────────────────────
/**
 * Compare multiple models side-by-side by ID.
 * @param {string[]} ids  - Array of model IDs
 */
async function compareModels(ids) {
  if (!Array.isArray(ids) || ids.length < 2) {
    throw new Error('Provide at least 2 model IDs to compare');
  }
  if (ids.length > 6) {
    throw new Error('Maximum 6 models can be compared at once');
  }

  const { models } = await getAllModels();
  const idSet = new Set(ids.map(id => id.toLowerCase()));
  const found = models.filter(m => idSet.has((m.id || '').toLowerCase()));
  const normalized = found.map(normalizeModel);

  if (normalized.length === 0) {
    throw new Error('No models found for the provided IDs');
  }

  // Build comparison matrix
  const fields = ['contextLength', 'maxCompletionTokens'];
  const priceFields = ['promptPerMillion', 'completionPerMillion'];
  const capFields = Object.keys(normalized[0]?.capabilities || {});

  const comparison = {
    models: normalized,
    summary: {
      cheapestPrompt: null,
      largestContext: null,
      mostCapable: null,
    },
  };

  // Find cheapest prompt
  const withPrice = normalized.filter(m => m.pricing.promptPerMillion !== null);
  if (withPrice.length > 0) {
    comparison.summary.cheapestPrompt = withPrice.reduce((a, b) =>
      a.pricing.promptPerMillion < b.pricing.promptPerMillion ? a : b
    ).id;
  }

  // Find largest context
  const withContext = normalized.filter(m => m.contextLength !== null);
  if (withContext.length > 0) {
    comparison.summary.largestContext = withContext.reduce((a, b) =>
      a.contextLength > b.contextLength ? a : b
    ).id;
  }

  // Most capable (most capability flags = true)
  comparison.summary.mostCapable = normalized.reduce((best, m) => {
    const score = Object.values(m.capabilities).filter(Boolean).length;
    const bestScore = Object.values(best.capabilities).filter(Boolean).length;
    return score > bestScore ? m : best;
  }).id;

  return comparison;
}

// ── ANALYTICS ────────────────────────────────────────────────
/**
 * Compute analytics over the full dataset.
 * Returns: provider stats, pricing distribution, capability matrix, etc.
 */
async function getAnalytics() {
  const { models, fromCache, cacheAge } = await getAllModels();

  const providerMap = {};
  let totalFree = 0;
  let totalWithReasoning = 0;
  let totalWithTools = 0;
  let totalWithImageInput = 0;
  let totalWithVideoInput = 0;
  let totalWithAudioInput = 0;
  let totalWithWebSearch = 0;
  const pricingBuckets = { free: 0, cheap: 0, mid: 0, premium: 0 };
  const contextBuckets = { small: 0, medium: 0, large: 0, huge: 0 };
  const modalitySet = new Set();

  models.forEach(m => {
    const provider = extractProvider(m.id);
    providerMap[provider] = (providerMap[provider] || 0) + 1;

    const params = m.supported_parameters || [];
    const inputModes = m.architecture?.input_modalities || [];
    const promptPrice = parsePrice(m.pricing?.prompt);
    const isFree = m.id?.includes(':free') || (promptPrice === 0 && parsePrice(m.pricing?.completion) === 0);

    if (isFree) totalFree++;
    if (params.includes('reasoning') || params.includes('include_reasoning')) totalWithReasoning++;
    if (params.includes('tools') || params.includes('tool_choice')) totalWithTools++;
    if (inputModes.includes('image')) totalWithImageInput++;
    if (inputModes.includes('video')) totalWithVideoInput++;
    if (inputModes.includes('audio')) totalWithAudioInput++;
    if (m.pricing?.web_search != null) totalWithWebSearch++;

    // Pricing buckets (prompt per million tokens)
    if (isFree) pricingBuckets.free++;
    else if (promptPrice !== null) {
      const ppm = promptPrice * 1_000_000;
      if (ppm <= 0.5) pricingBuckets.cheap++;
      else if (ppm <= 5) pricingBuckets.mid++;
      else pricingBuckets.premium++;
    }

    // Context buckets
    const ctx = m.context_length || 0;
    if (ctx <= 8192) contextBuckets.small++;
    else if (ctx <= 131072) contextBuckets.medium++;
    else if (ctx <= 500000) contextBuckets.large++;
    else contextBuckets.huge++;

    // Modality tracking
    if (m.architecture?.modality) modalitySet.add(m.architecture.modality);
  });

  // Sort providers by count
  const topProviders = Object.entries(providerMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([provider, count]) => ({
      provider,
      count,
      percentage: Math.round((count / models.length) * 100 * 10) / 10,
      logoUrl: `${env.MODELS_DEV_LOGOS_URL}/${provider}.svg`,
    }));

  return {
    total: models.length,
    fromCache,
    cacheAge,
    lastFetched: cacheTs ? new Date(cacheTs).toISOString() : null,
    providers: {
      total: Object.keys(providerMap).length,
      top: topProviders,
    },
    capabilities: {
      free: totalFree,
      freePercentage: Math.round((totalFree / models.length) * 100),
      reasoning: totalWithReasoning,
      tools: totalWithTools,
      imageInput: totalWithImageInput,
      videoInput: totalWithVideoInput,
      audioInput: totalWithAudioInput,
      webSearch: totalWithWebSearch,
    },
    pricing: pricingBuckets,
    contextWindow: contextBuckets,
    modalities: [...modalitySet],
  };
}

// ── Get single model by ID ───────────────────────────────────
async function getModelById(id) {
  const { models } = await getAllModels();
  const model = models.find(m =>
    m.id?.toLowerCase() === id.toLowerCase() ||
    m.canonical_slug?.toLowerCase() === id.toLowerCase()
  );
  if (!model) return null;
  return normalizeModel(model);
}

// ── Get all unique providers ─────────────────────────────────
async function getProviders() {
  const { models } = await getAllModels();
  const map = {};
  models.forEach(m => {
    const p = extractProvider(m.id);
    if (!map[p]) {
      map[p] = { provider: p, count: 0, logoUrl: `${env.MODELS_DEV_LOGOS_URL}/${p}.svg` };
    }
    map[p].count++;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}

// ── Cache utilities ──────────────────────────────────────────
function invalidateCache() {
  modelsCache = null;
  cacheTs = 0;
}

module.exports = {
  getAllModels,
  searchModels,
  filterModels,
  compareModels,
  getAnalytics,
  getModelById,
  getProviders,
  invalidateCache,
};
