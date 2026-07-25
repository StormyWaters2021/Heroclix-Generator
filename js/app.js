import { APP_SETTINGS } from "../settings/app-settings.js";
import { PRINT_SETTINGS } from "../settings/print-layouts.js";
import {
  STAT_DEFINITIONS,
  TEAM_ABILITY_OPTIONS,
  IMPROVED_ABILITY_GROUPS
} from "../settings/icon-options.js";
import { getAbilityOptions } from "../settings/ability-colors.js";
import {
  createInitialState,
  createDefaultToken,
  createDefaultTokenPair,
  cloneTokenPair,
  normalizeProject
} from "./state.js";
import { fileToDataUrl } from "./assets.js";
import { renderToken, tokenToDataUrl } from "./renderer.js";
import { downloadBlob, downloadDataUrl, safeFilename } from "./downloads.js";
import { createPrintPdf, getTokensPerPage } from "./pdf-export.js";
import { initializeTheme } from "./theme-controller.js";

const elements = {
  canvas: document.querySelector("#token-canvas"),
  canvasLoading: document.querySelector("#canvas-loading"),
  sideButtons: [...document.querySelectorAll("[data-token-side]")],
  name: document.querySelector("#name-input"),
  ability: document.querySelector("#ability-input"),
  template: document.querySelector("#template-select"),
  range: document.querySelector("#range-input"),
  bolts: document.querySelector("#bolts-input"),
  special: document.querySelector("#special-input"),
  teamAbility: document.querySelector("#team-ability-select"),
  artwork: document.querySelector("#artwork-input"),
  zoom: document.querySelector("#zoom-input"),
  zoomOutput: document.querySelector("#zoom-output"),
  rotation: document.querySelector("#rotation-input"),
  rotationOutput: document.querySelector("#rotation-output"),
  statControls: document.querySelector("#stat-controls"),
  statTemplate: document.querySelector("#stat-row-template"),
  improvedAbilityControls: document.querySelector("#improved-ability-controls"),
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
  doubleSided: document.querySelector("#double-sided-input"),
  tightPack: document.querySelector("#tight-pack-input"),
  tightPackRow: document.querySelector("#tight-pack-row"),
  pageSummary: document.querySelector("#page-summary"),
  versionFooter: document.querySelector("#version-footer"),
  exportPdf: document.querySelector("#export-pdf-button")
};

let state = createInitialState();
let renderSequence = 0;
let dragState = null;

function currentToken() {
  return state.currentTokens[state.activeSide];
}

function currentPrintMode() {
  return document.querySelector('input[name="print-mode"]:checked')?.value || "max";
}

function getPreviewBleedScale() {
  if (!elements.bleed.checked) return 1;
  return (
    APP_SETTINGS.tokenDiameterInches + PRINT_SETTINGS.bleedInches * 2
  ) / APP_SETTINGS.tokenDiameterInches;
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
    const includeBleed = elements.bleed.checked;

    await renderToken(elements.canvas, currentToken(), {
      bleedScale: getPreviewBleedScale(),
      showCutLine: includeBleed
    });

    if (sequence === renderSequence) {
      elements.canvasLoading.classList.add("is-hidden");
    }
  } catch (error) {
    console.error(error);
    if (sequence === renderSequence) {
      elements.canvasLoading.textContent = "Unable to render token.";
    }
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

function updateEditorVisibility() {
  const template = APP_SETTINGS.templates.find(
    (entry) => entry.id === currentToken().templateId
  );

  const editorSettings = template?.editor || {};

  for (const element of document.querySelectorAll(
    "[data-editor-option]"
  )) {
    const optionName = element.dataset.editorOption;

    // Controls are visible by default. They are hidden only when
    // the current template explicitly sets the option to false.
    element.classList.toggle(
      "is-hidden",
      editorSettings[optionName] === false
    );
  }

  for (const group of document.querySelectorAll(
    "[data-editor-option-group]"
  )) {
    const controls = [
      ...group.querySelectorAll("[data-editor-option]")
    ];

    const hasVisibleControl = controls.some(
      (control) => !control.classList.contains("is-hidden")
    );

    group.classList.toggle(
      "is-hidden",
      !hasVisibleControl
    );
  }
}

function populateTeamAbilities() {
  elements.teamAbility.replaceChildren();
  for (const ability of TEAM_ABILITY_OPTIONS) {
    const option = document.createElement("option");
    option.value = ability.id;
    option.textContent = ability.label;
    elements.teamAbility.append(option);
  }
}


function populateImprovedAbilityControls() {
  elements.improvedAbilityControls.replaceChildren();

  for (const [groupId, group] of Object.entries(IMPROVED_ABILITY_GROUPS)) {
    const section = document.createElement("section");
    section.className = "improved-ability-group";
    section.dataset.improvedAbilityGroup = groupId;

    const heading = document.createElement("h3");
    heading.textContent = group.label;

    const options = document.createElement("div");
    options.className = "improved-ability-options";

    for (const ability of group.options) {
      const label = document.createElement("label");
      label.className = "improved-ability-option";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = ability.id;
      input.dataset.improvedAbilityId = ability.id;
      input.addEventListener("change", () => {
        const checkedIds = new Set(
          [...options.querySelectorAll("input:checked")].map((entry) => entry.value)
        );

        currentToken().improvedAbilities[groupId] = group.options
          .filter((entry) => checkedIds.has(entry.id))
          .map((entry) => entry.id);
        redraw();
      });

      const text = document.createElement("span");
      text.textContent = ability.label;
      label.append(input, text);
      options.append(label);
    }

    section.append(heading, options);
    elements.improvedAbilityControls.append(section);
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

    const specialOption = document.createElement("option");
    specialOption.value = "special";
    specialOption.textContent = "Special";
    abilitySelect.append(specialOption);

    iconSelect.addEventListener("change", () => {
      currentToken().stats[definition.id].iconId = iconSelect.value;
      redraw();
    });

    const valueInput = fragment.querySelector(".stat-value-input");
    valueInput.addEventListener("input", () => {
      currentToken().stats[definition.id].value = valueInput.value;
      redraw();
    });

    abilitySelect.addEventListener("change", () => {
      const stat = currentToken().stats[definition.id];
      stat.special = abilitySelect.value === "special";
      stat.abilityId = stat.special ? "none" : abilitySelect.value;
      redraw();
    });

    elements.statControls.append(fragment);
  }
}

function syncSideToggle() {
  for (const button of elements.sideButtons) {
    const active = button.dataset.tokenSide === state.activeSide;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  }
}

function syncFormFromState() {
  const token = currentToken();
  elements.name.value = token.name;
  elements.ability.value = token.ability || "";
  elements.template.value = token.templateId;
  elements.range.value = token.range;
  elements.bolts.value = token.bolts;
  elements.special.checked = Boolean(token.special);
  elements.teamAbility.value = token.teamAbilityId || "none";
  elements.zoom.value = Math.round(token.artwork.zoom * 100);
  elements.zoomOutput.textContent = `${Math.round(token.artwork.zoom * 100)}%`;
  elements.rotation.value = token.artwork.rotation;
  elements.rotationOutput.textContent = `${token.artwork.rotation}°`;

  for (const definition of STAT_DEFINITIONS) {
    const row = elements.statControls.querySelector(`[data-stat-id="${definition.id}"]`);
    row.querySelector(".stat-icon-select").value = token.stats[definition.id].iconId;
    row.querySelector(".stat-value-input").value = token.stats[definition.id].value;
    row.querySelector(".stat-ability-select").value = token.stats[definition.id].special
      ? "special"
      : token.stats[definition.id].abilityId;
  }


  for (const [groupId, group] of Object.entries(IMPROVED_ABILITY_GROUPS)) {
    const selectedIds = new Set(token.improvedAbilities?.[groupId] || []);
    const groupElement = elements.improvedAbilityControls.querySelector(
      `[data-improved-ability-group="${groupId}"]`
    );

    for (const ability of group.options) {
      const input = groupElement?.querySelector(
        `[data-improved-ability-id="${ability.id}"]`
      );
      if (input) input.checked = selectedIds.has(ability.id);
    }
  }

  elements.addToQueue.textContent = state.editingQueueId
    ? "Update print item"
    : "Add token to print list";

  syncSideToggle();
  updateEditorVisibility();
  redraw();
}

function switchSide(side) {
  if (side !== "front" && side !== "back") return;
  state.activeSide = side;
  syncFormFromState();
}

function resetArtworkPosition() {
  Object.assign(currentToken().artwork, {
    x: 0,
    y: 0,
    zoom: 1,
    rotation: 0
  });
  syncFormFromState();
}

function getQueueCopies() {
  return state.queue.reduce(
    (sum, item) => sum + Math.max(1, Number(item.quantity) || 1),
    0
  );
}

function createQueuePreview(side, dataUrl) {
  const figure = document.createElement("figure");
  figure.className = "queue-side";

  const preview = document.createElement("img");
  preview.className = "queue-preview";
  preview.alt = `${side} preview`;
  preview.src = dataUrl;

  const label = document.createElement("figcaption");
  label.textContent = side;

  figure.append(preview, label);
  return figure;
}

async function renderQueue() {
  elements.queueList.replaceChildren();
  const total = getQueueCopies();
  elements.queueCount.textContent = `${total} ${total === 1 ? "copy" : "copies"}`;
  elements.queueEmpty.classList.toggle("is-hidden", state.queue.length > 0);

  for (const item of state.queue) {
    const article = document.createElement("article");
    article.className = "queue-item";

    const previews = document.createElement("div");
    previews.className = "queue-previews";
    const [frontUrl, backUrl] = await Promise.all([
      tokenToDataUrl(item.tokens.front),
      tokenToDataUrl(item.tokens.back)
    ]);
    previews.append(
      createQueuePreview("Front", frontUrl),
      createQueuePreview("Back", backUrl)
    );

    const body = document.createElement("div");
    body.className = "queue-body";

    const title = document.createElement("div");
    title.className = "queue-title";
    const frontName = item.tokens.front.name.trim() || "Untitled front";
    const backName = item.tokens.back.name.trim() || "Untitled back";
    title.textContent = frontName === backName
      ? frontName
      : `${frontName} / ${backName}`;

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
    article.append(previews, body);
    elements.queueList.append(article);
  }
}

function editQueueItem(id) {
  const item = state.queue.find((entry) => entry.id === id);
  if (!item) return;

  state.currentTokens = cloneTokenPair(item.tokens, { preserveIds: true });
  state.activeSide = "front";
  state.editingQueueId = id;
  syncFormFromState();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function duplicateQueueItem(id) {
  const item = state.queue.find((entry) => entry.id === id);
  if (!item) return;

  state.queue.push({
    id: crypto.randomUUID(),
    quantity: item.quantity,
    tokens: cloneTokenPair(item.tokens)
  });
  renderQueue();
  updatePrintSummary();
}

function removeQueueItem(id) {
  state.queue = state.queue.filter((entry) => entry.id !== id);

  if (state.editingQueueId === id) {
    state.editingQueueId = null;
    state.currentTokens = createDefaultTokenPair();
    state.activeSide = "front";
    syncFormFromState();
  }

  renderQueue();
  updatePrintSummary();
}

function addOrUpdateQueue() {
  const tokens = cloneTokenPair(state.currentTokens, { preserveIds: true });

  if (state.editingQueueId) {
    const item = state.queue.find((entry) => entry.id === state.editingQueueId);
    if (item) item.tokens = tokens;
  } else {
    state.queue.push({
      id: crypto.randomUUID(),
      quantity: 1,
      tokens
    });
  }

  state.editingQueueId = null;
  state.currentTokens = createDefaultTokenPair();
  state.activeSide = "front";
  syncFormFromState();
  renderQueue();
  updatePrintSummary();
}

function updatePrintSummary() {
  const mode = currentPrintMode();
  const includeBleed = elements.bleed.checked;
  const tightPack = elements.tightPack.checked;
  const perSheet = getTokensPerPage(mode, includeBleed, tightPack);
  const total = getQueueCopies();
  const sheets = total ? Math.ceil(total / perSheet) : 0;

  const doubleSided = elements.doubleSided.checked;
  const pageCount = sheets * (doubleSided ? 2 : 1);

  elements.pageSummary.textContent = `Current layout: ${perSheet} tokens per sheet, ${
	  doubleSided ? "double-sided" : "single-sided"
	}${
	  total
		? ` — ${sheets} ${
			sheets === 1 ? "sheet" : "sheets"
		  } / ${pageCount} PDF ${
			pageCount === 1 ? "page" : "pages"
		  } for ${total} copies`
		: ""
	}.`;
  elements.tightPackRow.classList.toggle(
    "is-hidden",
    mode !== "max" || includeBleed
  );
}

function saveProject() {
  const project = {
    version: APP_SETTINGS.projectVersion,
    currentTokens: state.currentTokens,
    activeSide: state.activeSide,
    queue: state.queue
  };

  localStorage.setItem(APP_SETTINGS.storageKey, JSON.stringify(project));
  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: "application/json"
  });
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
  const front = state.currentTokens.front;
  const back = state.currentTokens.back;
  const hasImprovedAbilities = (token) => Object.values(
    token.improvedAbilities || {}
  ).some((selections) => Array.isArray(selections) && selections.length > 0);

  const hasWork = state.queue.length
    || front.name
    || front.artwork.dataUrl
    || hasImprovedAbilities(front)
    || back.name
    || back.artwork.dataUrl
    || hasImprovedAbilities(back);

  if (hasWork && !confirm("Start a new project? Unsaved changes will be cleared.")) {
    return;
  }

  state = createInitialState();
  syncFormFromState();
  renderQueue();
  updatePrintSummary();
}

function attachInputListeners() {
  for (const button of elements.sideButtons) {
    button.addEventListener("click", () => switchSide(button.dataset.tokenSide));
  }

  elements.name.addEventListener("input", () => {
    currentToken().name = elements.name.value;
    redraw();
  });
  elements.ability.addEventListener("input", () => {
    currentToken().ability = elements.ability.value;
    redraw();
  });
  elements.template.addEventListener("change", () => {
    currentToken().templateId = elements.template.value;
    updateEditorVisibility();
    redraw();
  });
  elements.range.addEventListener("input", () => {
    currentToken().range = elements.range.value;
    redraw();
  });
  elements.bolts.addEventListener("input", () => {
    currentToken().bolts = elements.bolts.value;
    redraw();
  });
  elements.special.addEventListener("change", () => {
    currentToken().special = elements.special.checked;
    redraw();
  });
  elements.teamAbility.addEventListener("change", () => {
    currentToken().teamAbilityId = elements.teamAbility.value;
    redraw();
  });
  elements.zoom.addEventListener("input", () => {
    currentToken().artwork.zoom = Number(elements.zoom.value) / 100;
    elements.zoomOutput.textContent = `${elements.zoom.value}%`;
    redraw();
  });
  elements.rotation.addEventListener("input", () => {
    currentToken().artwork.rotation = Number(elements.rotation.value);
    elements.rotationOutput.textContent = `${elements.rotation.value}°`;
    redraw();
  });
  elements.artwork.addEventListener("change", async () => {
    const file = elements.artwork.files?.[0];
    if (!file) return;

    try {
      currentToken().artwork.dataUrl = await fileToDataUrl(file);
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
    state.currentTokens[state.activeSide] = createDefaultToken();
    syncFormFromState();
  });
  elements.addToQueue.addEventListener("click", addOrUpdateQueue);
  elements.exportPng.addEventListener("click", async () => {
    setBusy(elements.exportPng, true, "Creating PNG…");
    try {
      const token = currentToken();
      const dataUrl = await tokenToDataUrl(token);
      downloadDataUrl(
        dataUrl,
        `${safeFilename(token.name)}-${state.activeSide}.png`
      );
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

  document.querySelectorAll('input[name="print-mode"]').forEach((radio) => {
    radio.addEventListener("change", updatePrintSummary);
  });
  elements.bleed.addEventListener("change", () => {
    updatePrintSummary();
    redraw();
  });
  elements.doubleSided.addEventListener("change", updatePrintSummary);
  elements.tightPack.addEventListener("change", updatePrintSummary);
  elements.exportPdf.addEventListener("click", async () => {
    setBusy(elements.exportPdf, true, "Creating PDF…");
    try {
      const pdf = await createPrintPdf(state.queue, {
        mode: currentPrintMode(),
        includeBleed: elements.bleed.checked,
        doubleSided: elements.doubleSided.checked,
        tightPack: elements.tightPack.checked
      });
      downloadBlob(
        pdf,
        `tokens-${currentPrintMode()}-${elements.doubleSided.checked ? "duplex" : "fronts"}.pdf`
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "The PDF could not be created.");
    } finally {
      setBusy(elements.exportPdf, false);
    }
  });
}

function initializeVersionFooter() {
  const versionSettings = APP_SETTINGS.versionmsg;
  const footer = elements.versionFooter;
  if (!footer) return;

  const shouldShow = versionSettings?.visible !== false
    && typeof versionSettings?.text === "string"
    && versionSettings.text.trim() !== "";

  if (!shouldShow) {
    footer.hidden = true;
    footer.textContent = "";
    return;
  }

  footer.textContent = versionSettings.text.trim();
  footer.hidden = false;
}

function attachArtworkDrag() {
  elements.canvas.addEventListener("pointerdown", (event) => {
    const token = currentToken();
    if (!token.artwork.dataUrl) return;

    elements.canvas.setPointerCapture(event.pointerId);
    elements.canvas.classList.add("is-dragging");
    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      artworkX: token.artwork.x,
      artworkY: token.artwork.y
    };
  });

  elements.canvas.addEventListener("pointermove", (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const rect = elements.canvas.getBoundingClientRect();
    const scale = elements.canvas.width / rect.width;
    const token = currentToken();
    token.artwork.x = dragState.artworkX
      + (event.clientX - dragState.startX) * scale;
    token.artwork.y = dragState.artworkY
      + (event.clientY - dragState.startY) * scale;
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
  populateTeamAbilities();
  populateImprovedAbilityControls();
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
  initializeVersionFooter();
  await renderQueue();
  updatePrintSummary();
}

initialize();
