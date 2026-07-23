import { APP_SETTINGS } from "../settings/app-settings.js";
import { STAT_DEFINITIONS } from "../settings/icon-options.js";

export function createDefaultToken() {
  return {
    id: crypto.randomUUID(),
    templateId: APP_SETTINGS.defaultTemplateId,
    name: "",
    range: 6,
    bolts: 1,
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

export function createInitialState() {
  return {
    version: APP_SETTINGS.projectVersion,
    currentToken: createDefaultToken(),
    queue: [],
    editingQueueId: null
  };
}

export function normalizeProject(project) {
  const fallback = createInitialState();
  if (!project || typeof project !== "object") return fallback;
  return {
    version: APP_SETTINGS.projectVersion,
    currentToken: project.currentToken ? { ...createDefaultToken(), ...project.currentToken } : fallback.currentToken,
    queue: Array.isArray(project.queue)
      ? project.queue.map((item) => ({
          id: item.id || crypto.randomUUID(),
          quantity: Math.max(1, Number(item.quantity) || 1),
          token: { ...createDefaultToken(), ...(item.token || {}) }
        }))
      : [],
    editingQueueId: null
  };
}
