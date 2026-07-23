import { APP_SETTINGS } from "../settings/app-settings.js";
import { STAT_DEFINITIONS } from "../settings/icon-options.js";

export function createDefaultToken() {
  return {
    id: crypto.randomUUID(),
    templateId: APP_SETTINGS.defaultTemplateId,
    name: "",
    range: 6,
    bolts: 1,
    special: false,
    teamAbilityId: "none",
    artwork: {
      dataUrl: "",
      x: 0,
      y: 0,
      zoom: 1,
      rotation: 0
    },
    stats: Object.fromEntries(
      STAT_DEFINITIONS.map((stat) => [
        stat.id,
        {
          value: stat.defaultValue,
          iconId: stat.defaultIcon,
          abilityId: "none"
        }
      ])
    )
  };
}

export function cloneToken(token, { preserveId = false } = {}) {
  const clone = structuredClone(token);
  if (!preserveId) clone.id = crypto.randomUUID();
  return clone;
}

export function createDefaultTokenPair() {
  return {
    front: createDefaultToken(),
    back: createDefaultToken()
  };
}

export function cloneTokenPair(pair, { preserveIds = false } = {}) {
  return {
    front: cloneToken(pair.front, { preserveId: preserveIds }),
    back: cloneToken(pair.back, { preserveId: preserveIds })
  };
}

export function createInitialState() {
  return {
    version: APP_SETTINGS.projectVersion,
    currentTokens: createDefaultTokenPair(),
    activeSide: "front",
    queue: [],
    editingQueueId: null
  };
}

function normalizeToken(token) {
  const fallback = createDefaultToken();
  if (!token || typeof token !== "object") return fallback;

  return {
    ...fallback,
    ...token,
    artwork: {
      ...fallback.artwork,
      ...(token.artwork || {})
    },
    stats: Object.fromEntries(
      STAT_DEFINITIONS.map((definition) => [
        definition.id,
        {
          ...fallback.stats[definition.id],
          ...(token.stats?.[definition.id] || {})
        }
      ])
    )
  };
}

function normalizePair(pair, legacyToken) {
  return {
    front: normalizeToken(pair?.front || legacyToken),
    back: normalizeToken(pair?.back)
  };
}

export function normalizeProject(project) {
  const fallback = createInitialState();
  if (!project || typeof project !== "object") return fallback;

  return {
    version: APP_SETTINGS.projectVersion,
    currentTokens: normalizePair(project.currentTokens, project.currentToken),
    activeSide: project.activeSide === "back" ? "back" : "front",
    queue: Array.isArray(project.queue)
      ? project.queue.map((item) => {
          const pair = item.tokens
            ? normalizePair(item.tokens)
            : normalizePair(null, item.token);

          return {
            id: item.id || crypto.randomUUID(),
            quantity: Math.max(1, Number(item.quantity) || 1),
            tokens: pair
          };
        })
      : [],
    editingQueueId: null
  };
}
