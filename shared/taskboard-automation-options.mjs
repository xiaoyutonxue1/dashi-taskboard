export const AUTOMATION_MODELS = [
  {
    label: "5.6 Sol",
    slug: "gpt-5.6-sol",
    defaultEffort: "low",
    efforts: ["low", "medium", "high", "xhigh", "max", "ultra"],
  },
  {
    label: "5.6 Terra",
    slug: "gpt-5.6-terra",
    defaultEffort: "medium",
    efforts: ["low", "medium", "high", "xhigh", "max", "ultra"],
  },
  {
    label: "5.6 Luna",
    slug: "gpt-5.6-luna",
    defaultEffort: "medium",
    efforts: ["low", "medium", "high", "xhigh", "max"],
  },
  {
    label: "5.5",
    slug: "gpt-5.5",
    defaultEffort: "medium",
    efforts: ["low", "medium", "high", "xhigh"],
  },
  {
    label: "5.4",
    slug: "gpt-5.4",
    defaultEffort: "medium",
    efforts: ["low", "medium", "high", "xhigh"],
  },
  {
    label: "5.4 Mini",
    slug: "gpt-5.4-mini",
    defaultEffort: "medium",
    efforts: ["low", "medium", "high", "xhigh"],
  },
];

const MODELS_BY_SLUG = new Map(AUTOMATION_MODELS.map((model) => [model.slug, model]));
const REASONING_EFFORTS = new Set(AUTOMATION_MODELS.flatMap((model) => model.efforts));
const DEFAULT_FALLBACK_EFFORTS = ["low", "medium", "high", "xhigh"];

export function getAutomationModel(value) {
  return MODELS_BY_SLUG.get(value);
}

export function isAutomationModel(value) {
  // Accept any non-empty slug. Known static models pass; provider-mapped
  // models (Cockpit Tools / custom catalogs) pass as long as they are
  // non-empty strings, so stored and host-replied automations are not
  // silently dropped just because they use a dynamic model.
  return typeof value === "string" && value.trim().length > 0;
}

export function isAutomationReasoningEffort(value) {
  return REASONING_EFFORTS.has(value);
}

export function isSupportedModelEffort(model, effort) {
  // Unknown models (e.g. provider-mapped slugs from Cockpit Tools or a
  // custom catalog) are accepted leniently; only known static models are
  // validated strictly against their supported efforts.
  const known = getAutomationModel(model);
  return known ? known.efforts.includes(effort) : true;
}

export function normalizeAutomationModels(catalogModels) {
  if (!Array.isArray(catalogModels)) return [];
  return catalogModels.flatMap((model) => {
    if (!model || typeof model !== "object") return [];
    const slug = typeof model.slug === "string" && model.slug.trim()
      ? model.slug.trim()
      : null;
    if (!slug) return [];
    const efforts = Array.isArray(model.supportedReasoningEfforts)
      ? [...new Set(model.supportedReasoningEfforts.filter(
          (effort) => typeof effort === "string" && effort.trim(),
        ))]
      : [];
    const defaultEffort = typeof model.defaultReasoningEffort === "string"
      && model.defaultReasoningEffort.trim()
      && efforts.includes(model.defaultReasoningEffort)
      ? model.defaultReasoningEffort
      : (efforts[0] ?? DEFAULT_FALLBACK_EFFORTS[0]);
    return [{
      label: typeof model.displayName === "string" && model.displayName.trim()
        ? model.displayName.trim()
        : slug,
      slug,
      defaultEffort,
      efforts: efforts.length > 0 ? efforts : DEFAULT_FALLBACK_EFFORTS,
    }];
  });
}

export function withAutomationModel(options, model) {
  const nextModel = getAutomationModel(model);
  return {
    ...options,
    model,
    // Unknown models keep the current reasoning effort; known models
    // coerce to their default effort when the current one is unsupported.
    reasoningEffort: nextModel
      ? (nextModel.efforts.includes(options.reasoningEffort)
        ? options.reasoningEffort
        : nextModel.defaultEffort)
      : options.reasoningEffort,
  };
}
