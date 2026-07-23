import { APP_SETTINGS } from "../settings/app-settings.js";
import { STAT_DEFINITIONS } from "../settings/icon-options.js";
import { getAbilityOptions } from "../settings/ability-colors.js";
import { createInitialState, createDefaultToken, cloneToken, normalizeProject } from "./state.js";
import { fileToDataUrl } from "./assets.js";
import { renderToken, tokenToDataUrl } from "./renderer.js";
import { downloadBlob, downloadDataUrl, safeFilename } from "./downloads.js";
import { createPrintPdf, getTokensPerPage } from "./pdf-export.js";
import { initializeTheme } from "./theme-controller.js";

const elements = {
  canvas: document.querySelector("#token-canvas"),
  canvasLoading: document.querySelector("#canvas-loading"),
  name: document.querySelector("#name-input"),
  template: document.querySelector("#template-select"),
  range: document.querySelector("#range-input"),
  bolts: document.querySelector("#bolts-input"),
  artwork: document.querySelector("#artwork-input"),
  zoom: document.querySelector("#zoom-input"),
  zoomOutput: document.querySelector("#zoom-output"),
  rotation: document.querySelector("#rotation-input"),
  rotationOutput: document.querySelector("#rotation-output"),
  statControls: document.querySelector("#stat-controls"),
  statTemplate: document.querySelector("#stat-row-template"),
  addToQueue: document.querySelector("#add-to-queue-button"),
  exportPng: document.querySelector("#export-png-button"),
  resetArtwork: document.querySelector("#reset-artwork-button"),
  resetToken: document.querySelector("#reset-token-button"),
  queueList: document.querySelector("#queue-list"),
  queueEmpty: document.querySelector("#queue-empty"),
  queueCount: document.querySelector("#queue-count"),
  saveProject: document.querySelector("#save-project-button"),
  loadProject: document.querySelector("#load-project-input"),
  newProject: document.querySelector("#new-project-button"),
  themeToggle: document.querySelector("#theme-toggle"),
  bleed: document.querySelector("#bleed-input"),
  tightPack: document.querySelector("#tight-pack-input"),
  tightPackRow: document.querySelector("#tight-pack-row"),
  pageSummary: document.querySelector("#page-summary"),
  exportPdf: document.querySelector("#export-pdf-button")
};

let state = createInitialState();
let renderSequence = 0;
let dragState = null;

function currentPrintMode() {
  return document.querySelector('input[name="print-mode"]:checked')?.value || "max";
}

function setBusy(button, busy, busyLabel) {
  if (busy) {
    button.dataset.originalLabel = button.textContent;
    button.textContent = busyLabel;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalLabel || button.textContent;
    button.disabled = false;
  }
}

async function redraw() {
  const sequence = ++renderSequence;
  elements.canvasLoading.classList.remove("is-hidden");
  try {
    await document.fonts.ready;
    await renderToken(elements.canvas, state.currentToken);
    if (sequence === renderSequence) elements.canvasLoading.classList.add("is-hidden");
  } catch (error) {
    console.error(error);
    elements.canvasLoading.textContent = "Unable to render token.";
  }
}

function populateTemplates() {
  elements.template.replaceChildren();
  for (const template of APP_SETTINGS.templates) {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = template.label;
    elements.template.append(option);
  }
}

function populateStatControls() {
  elements.statControls.replaceChildren();
  for (const definition of STAT_DEFINITIONS) {
    const fragment = elements.statTemplate.content.cloneNode(true);
    const row = fragment.querySelector(".stat-row");
    row.dataset.statId = definition.id;
    fragment.querySelector(".stat-label").textContent = definition.label;

    const iconSelect = fragment.querySelector(".stat-icon-select");
    for (const icon of definition.icons) {
      const option = document.createElement("option");
      option.value = icon.id;
      option.textContent = icon.label;
      iconSelect.append(option);
    }

    const abilitySelect = fragment.querySelector(".stat-ability-select");
    for (const ability of getAbilityOptions(definition.id)) {
      const option = document.createElement("option");
      option.value = ability.id;
      option.textContent = ability.label;
      abilitySelect.append(option);
    }

    iconSelect.addEventListener("change", () => {
      state.currentToken.stats[definition.id].iconId = iconSelect.value;
      redraw();
    });

    const valueInput = fragment.querySelector(".stat-value-input");
    valueInput.addEventListener("input", () => {
      state.currentToken.stats[definition.id].value = valueInput.value;
      redraw();
    });

    abilitySelect.addEventListener("change", () => {
      state.currentToken.stats[definition.id].abilityId = abilitySelect.value;
      redraw();
    });

    elements.statControls.append(fragment);
  }
}

function syncFormFromState() {
  const token = state.currentToken;
  elements.name.value = token.name;
  elements.template.value = token.templateId;
  elements.range.value = token.range;
  elements.bolts.value = token.bolts;
  elements.zoom.value = Math.round(token.artwork.zoom * 100);
  elements.zoomOutput.textContent = `${Math.round(token.artwork.zoom * 100)}%`;
  elements.rotation.value = token.artwork.rotation;
  elements.rotationOutput.textContent = `${token.artwork.rotation}°`;

  for (const definition of STAT_DEFINITIONS) {
    const row = elements.statControls.querySelector(`[data-stat-id="${definition.id}"]`);
    row.querySelector(".stat-icon-select").value = token.stats[definition.id].iconId;
    row.querySelector(".stat-value-input").value = token.stats[definition.id].value;
    row.querySelector(".stat-ability-select").value = token.stats[definition.id].abilityId;
  }

  elements.addToQueue.textContent = state.editingQueueId ? "Update print item" : "Add token to print list";
  redraw();
}

function resetArtworkPosition() {
  Object.assign(state.currentToken.artwork, { x: 0, y: 0, zoom: 1, rotation: 0 });
  syncFormFromState();
}

function getQueueCopies() {
  return state.queue.reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
}

async function renderQueue() {
  elements.queueList.replaceChildren();
  const total = getQueueCopies();
  elements.queueCount.textContent = `${total} ${total === 1 ? "copy" : "copies"}`;
  elements.queueEmpty.classList.toggle("is-hidden", state.queue.length > 0);

  for (const item of state.queue) {
    const article = document.createElement("article");
    article.className = "queue-item";

    const preview = document.createElement("img");
    preview.className = "queue-preview";
    preview.alt = "";
    preview.src = await tokenToDataUrl(item.token);

    const body = document.createElement("div");
    body.className = "queue-body";
    const title = document.createElement("div");
    title.className = "queue-title";
    title.textContent = item.token.name.trim() || "Untitled token";

    const toolbar = document.createElement("div");
    toolbar.className = "queue-toolbar";

    const quantityLabel = document.createElement("label");
    quantityLabel.className = "quantity-control";
    quantityLabel.append("Qty");
    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.min = "1";
    quantity.max = "999";
    quantity.value = item.quantity;
    quantity.addEventListener("change", () => {
      item.quantity = Math.max(1, Number(quantity.value) || 1);
      quantity.value = item.quantity;
      renderQueue();
      updatePrintSummary();
    });
    quantityLabel.append(quantity);

    const actions = [
      ["Edit", () => editQueueItem(item.id), "button button--quiet"],
      ["Duplicate", () => duplicateQueueItem(item.id), "button button--quiet"],
      ["Remove", () => removeQueueItem(item.id), "button button--quiet button--danger"]
    ];

    toolbar.append(quantityLabel);
    for (const [label, handler, className] of actions) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = className;
      button.textContent = label;
      button.addEventListener("click", handler);
      toolbar.append(button);
    }

    body.append(title, toolbar);
    article.append(preview, body);
    elements.queueList.append(article);
  }
}

function editQueueItem(id) {
  const item = state.queue.find((entry) => entry.id === id);
  if (!item) return;
  state.currentToken = cloneToken(item.token, { preserveId: true });
  state.editingQueueId = id;
  syncFormFromState();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function duplicateQueueItem(id) {
  const item = state.queue.find((entry) => entry.id === id);
  if (!item) return;
  state.queue.push({ id: crypto.randomUUID(), quantity: item.quantity, token: cloneToken(item.token) });
  renderQueue();
  updatePrintSummary();
}

function removeQueueItem(id) {
  state.queue = state.queue.filter((entry) => entry.id !== id);
  if (state.editingQueueId === id) {
    state.editingQueueId = null;
    state.currentToken = createDefaultToken();
    syncFormFromState();
  }
  renderQueue();
  updatePrintSummary();
}

function addOrUpdateQueue() {
  const token = cloneToken(state.currentToken, { preserveId: true });
  if (state.editingQueueId) {
    const item = state.queue.find((entry) => entry.id === state.editingQueueId);
    if (item) item.token = token;
  } else {
    state.queue.push({ id: crypto.randomUUID(), quantity: 1, token });
  }
  state.editingQueueId = null;
  state.currentToken = createDefaultToken();
  syncFormFromState();
  renderQueue();
  updatePrintSummary();
}

function updatePrintSummary() {
  const mode = currentPrintMode();
  const includeBleed = elements.bleed.checked;
  const tightPack = elements.tightPack.checked;
  const perPage = getTokensPerPage(mode, includeBleed, tightPack);
  const total = getQueueCopies();
  const pages = total ? Math.ceil(total / perPage) : 0;
  elements.pageSummary.textContent = `${perPage} tokens per page${total ? ` — ${pages} ${pages === 1 ? "page" : "pages"} for ${total} copies` : ""}.`;
  elements.tightPackRow.classList.toggle("is-hidden", mode !== "max" || includeBleed);
}

function saveProject() {
  const project = {
    version: APP_SETTINGS.projectVersion,
    currentToken: state.currentToken,
    queue: state.queue
  };
  localStorage.setItem(APP_SETTINGS.storageKey, JSON.stringify(project));
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
  downloadBlob(blob, "token-maker-project.json");
}

async function loadProjectFile(file) {
  try {
    const text = await file.text();
    state = normalizeProject(JSON.parse(text));
    syncFormFromState();
    await renderQueue();
    updatePrintSummary();
  } catch (error) {
    console.error(error);
    alert("That project file could not be opened.");
  } finally {
    elements.loadProject.value = "";
  }
}

function newProject() {
  if ((state.queue.length || state.currentToken.name || state.currentToken.artwork.dataUrl) && !confirm("Start a new project? Unsaved changes will be cleared.")) return;
  state = createInitialState();
  syncFormFromState();
  renderQueue();
  updatePrintSummary();
}

function attachInputListeners() {
  elements.name.addEventListener("input", () => {
    state.currentToken.name = elements.name.value;
    redraw();
  });
  elements.template.addEventListener("change", () => {
    state.currentToken.templateId = elements.template.value;
    redraw();
  });
  elements.range.addEventListener("input", () => {
    state.currentToken.range = elements.range.value;
    redraw();
  });
  elements.bolts.addEventListener("input", () => {
    state.currentToken.bolts = elements.bolts.value;
    redraw();
  });
  elements.zoom.addEventListener("input", () => {
    state.currentToken.artwork.zoom = Number(elements.zoom.value) / 100;
    elements.zoomOutput.textContent = `${elements.zoom.value}%`;
    redraw();
  });
  elements.rotation.addEventListener("input", () => {
    state.currentToken.artwork.rotation = Number(elements.rotation.value);
    elements.rotationOutput.textContent = `${elements.rotation.value}°`;
    redraw();
  });
  elements.artwork.addEventListener("change", async () => {
    const file = elements.artwork.files?.[0];
    if (!file) return;
    try {
      state.currentToken.artwork.dataUrl = await fileToDataUrl(file);
      resetArtworkPosition();
    } catch (error) {
      console.error(error);
      alert("The artwork could not be loaded.");
    } finally {
      elements.artwork.value = "";
    }
  });

  elements.resetArtwork.addEventListener("click", resetArtworkPosition);
  elements.resetToken.addEventListener("click", () => {
    state.currentToken = createDefaultToken();
    state.editingQueueId = null;
    syncFormFromState();
  });
  elements.addToQueue.addEventListener("click", addOrUpdateQueue);
  elements.exportPng.addEventListener("click", async () => {
    setBusy(elements.exportPng, true, "Creating PNG…");
    try {
      const dataUrl = await tokenToDataUrl(state.currentToken);
      downloadDataUrl(dataUrl, `${safeFilename(state.currentToken.name)}.png`);
    } finally {
      setBusy(elements.exportPng, false);
    }
  });
  elements.saveProject.addEventListener("click", saveProject);
  elements.loadProject.addEventListener("change", () => {
    const file = elements.loadProject.files?.[0];
    if (file) loadProjectFile(file);
  });
  elements.newProject.addEventListener("click", newProject);

  document.querySelectorAll('input[name="print-mode"]').forEach((radio) => radio.addEventListener("change", updatePrintSummary));
  elements.bleed.addEventListener("change", updatePrintSummary);
  elements.tightPack.addEventListener("change", updatePrintSummary);
  elements.exportPdf.addEventListener("click", async () => {
    setBusy(elements.exportPdf, true, "Creating PDF…");
    try {
      const pdf = await createPrintPdf(state.queue, {
        mode: currentPrintMode(),
        includeBleed: elements.bleed.checked,
        tightPack: elements.tightPack.checked
      });
      downloadBlob(pdf, `tokens-${currentPrintMode()}.pdf`);
    } catch (error) {
      console.error(error);
      alert(error.message || "The PDF could not be created.");
    } finally {
      setBusy(elements.exportPdf, false);
    }
  });
}

function attachArtworkDrag() {
  elements.canvas.addEventListener("pointerdown", (event) => {
    if (!state.currentToken.artwork.dataUrl) return;
    elements.canvas.setPointerCapture(event.pointerId);
    elements.canvas.classList.add("is-dragging");
    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      artworkX: state.currentToken.artwork.x,
      artworkY: state.currentToken.artwork.y
    };
  });

  elements.canvas.addEventListener("pointermove", (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const rect = elements.canvas.getBoundingClientRect();
    const scale = APP_SETTINGS.canvasSize / rect.width;
    state.currentToken.artwork.x = dragState.artworkX + (event.clientX - dragState.startX) * scale;
    state.currentToken.artwork.y = dragState.artworkY + (event.clientY - dragState.startY) * scale;
    redraw();
  });

  function endDrag(event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    dragState = null;
    elements.canvas.classList.remove("is-dragging");
  }

  elements.canvas.addEventListener("pointerup", endDrag);
  elements.canvas.addEventListener("pointercancel", endDrag);
}

async function initialize() {
  initializeTheme(elements.themeToggle);
  populateTemplates();
  populateStatControls();
  attachInputListeners();
  attachArtworkDrag();

  const saved = localStorage.getItem(APP_SETTINGS.storageKey);
  if (saved) {
    try {
      state = normalizeProject(JSON.parse(saved));
    } catch {
      localStorage.removeItem(APP_SETTINGS.storageKey);
    }
  }

  syncFormFromState();
  await renderQueue();
  updatePrintSummary();
}

initialize();
