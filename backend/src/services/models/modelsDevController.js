// ─────────────────────────────────────────────────────────────
//  PinPoint India 2.0 — models.dev Controller
//  Route: /api/v1/models
// ─────────────────────────────────────────────────────────────

const {
  getAllModels,
  searchModels,
  filterModels,
  compareModels,
  getAnalytics,
  getModelById,
  getProviders,
  invalidateCache,
} = require('../../services/models/modelsDevService');

function handleError(err, res) {
  console.error('[ModelsController]', err.message);
  res.status(500).json({ success: false, error: err.message || 'Models service error' });
}

// ── GET /api/v1/models ──────────────────────────────────────
// Filter + paginate all models
async function list(req, res) {
  try {
    const result = await filterModels({
      provider: req.query.provider,
      free: req.query.free,
      reasoning: req.query.reasoning,
      tools: req.query.tools,
      imageInput: req.query.imageInput,
      audioInput: req.query.audioInput,
      videoInput: req.query.videoInput,
      structuredOutput: req.query.structuredOutput,
      webSearch: req.query.webSearch,
      minContext: req.query.minContext,
      maxPromptPricePerMillion: req.query.maxPromptPricePerMillion,
      sortBy: req.query.sortBy,
      limit: req.query.limit,
      offset: req.query.offset,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    handleError(err, res);
  }
}

// ── GET /api/v1/models/search?q= ────────────────────────────
async function search(req, res) {
  try {
    const q = req.query.q || '';
    const result = await searchModels(q, {
      provider: req.query.provider,
      free: req.query.free,
      reasoning: req.query.reasoning,
      tools: req.query.tools,
      sortBy: req.query.sortBy,
      limit: req.query.limit,
      offset: req.query.offset,
    });
    res.json({ success: true, query: q, ...result });
  } catch (err) {
    handleError(err, res);
  }
}

// ── GET /api/v1/models/compare?ids=id1,id2 ──────────────────
async function compare(req, res) {
  try {
    const ids = req.query.ids ? req.query.ids.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (ids.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Provide at least 2 model IDs as comma-separated ?ids= query param',
        example: '/api/v1/models/compare?ids=anthropic/claude-opus-4.6,openai/gpt-5',
      });
    }
    const result = await compareModels(ids);
    res.json({ success: true, ...result });
  } catch (err) {
    handleError(err, res);
  }
}

// ── GET /api/v1/models/analytics ────────────────────────────
async function analytics(req, res) {
  try {
    const result = await getAnalytics();
    res.json({ success: true, analytics: result });
  } catch (err) {
    handleError(err, res);
  }
}

// ── GET /api/v1/models/providers ────────────────────────────
async function providers(req, res) {
  try {
    const result = await getProviders();
    res.json({ success: true, total: result.length, providers: result });
  } catch (err) {
    handleError(err, res);
  }
}

// ── POST /api/v1/models/cache/invalidate ────────────────────
async function clearCache(req, res) {
  invalidateCache();
  res.json({ success: true, message: 'models.dev cache invalidated' });
}

// ── GET /api/v1/models/:id ──────────────────────────────────
// NOTE: mount AFTER other named routes to avoid conflict
async function getOne(req, res) {
  try {
    const id = decodeURIComponent(req.params.id + (req.params[0] || ''));
    const model = await getModelById(id);
    if (!model) {
      return res.status(404).json({ success: false, error: `Model not found: ${id}` });
    }
    res.json({ success: true, model });
  } catch (err) {
    handleError(err, res);
  }
}

module.exports = { list, search, compare, analytics, providers, clearCache, getOne };
