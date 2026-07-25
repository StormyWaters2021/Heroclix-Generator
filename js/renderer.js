import { APP_SETTINGS } from "../settings/app-settings.js";
import { TOKEN_LAYOUTS } from "../settings/token-layouts.js";
import {
  STAT_DEFINITIONS,
  SPECIAL_ICON,
  TEAM_ABILITY_OPTIONS,
  IMPROVED_ABILITY_GROUPS
} from "../settings/icon-options.js";
import { getAbilityColor } from "../settings/ability-colors.js";
import { loadImage } from "./assets.js";

function resolveFontSettings(token, fontRole) {
  const role = APP_SETTINGS.fontRoles?.[fontRole] || {};
  const selectedFontId = token.fontSelections?.[fontRole]
    || role.fontId
    || APP_SETTINGS.defaultFontId;
  const fallbackFont = APP_SETTINGS.fontCatalog?.[APP_SETTINGS.defaultFontId] || {};
  const selectedFont = APP_SETTINGS.fontCatalog?.[selectedFontId] || fallbackFont;

  return {
    ...fallbackFont,
    ...selectedFont,
    ...role
  };
}

function buildFont(settings) {
  const style = settings.style || "normal";
  const weight = settings.weight || "400";
  const family = settings.family || "sans-serif";
  const fallback = settings.fallback ? `, ${settings.fallback}` : "";
  return `${style} ${weight} ${settings.size}px "${family}"${fallback}`;
}

function fitText(ctx, text, settings, maxWidth) {
  let size = Number(settings.size) || 16;
  const minSize = Number(settings.minSize) || 1;

  do {
    ctx.font = buildFont({ ...settings, size });
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  } while (size > minSize);

  return Math.max(size, minSize);
}

function drawOutlinedText(ctx, text, position, font, maxWidth) {
  ctx.save();
  const size = fitText(ctx, text, font, maxWidth);
  ctx.font = buildFont({ ...font, size });
  ctx.textAlign = position.align;
  ctx.textBaseline = position.baseline;
  ctx.lineJoin = "round";
  ctx.strokeStyle = position.stroke;
  ctx.lineWidth = position.strokeWidth;
  ctx.fillStyle = position.fill;
  if (position.strokeWidth > 0) ctx.strokeText(text, position.x, position.y, maxWidth);
  ctx.fillText(text, position.x, position.y, maxWidth);
  ctx.restore();
}

function wrapParagraph(ctx, paragraph, maxWidth) {
  const words = paragraph.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }

    if (line) lines.push(line);

    // Break unusually long words so every line remains inside the box.
    if (ctx.measureText(word).width > maxWidth) {
      let segment = "";
      for (const character of word) {
        const nextSegment = segment + character;
        if (segment && ctx.measureText(nextSegment).width > maxWidth) {
          lines.push(segment);
          segment = character;
        } else {
          segment = nextSegment;
        }
      }
      line = segment;
    } else {
      line = word;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function wrapText(ctx, text, maxWidth) {
  return String(text)
    .split(/\r?\n/)
    .flatMap((paragraph) => wrapParagraph(ctx, paragraph, maxWidth));
}

function getTokenTextValue(token, source) {
  return String(source || "")
    .split(".")
    .reduce((value, key) => value?.[key], token);
}

function drawConfiguredTextArea(ctx, token, area) {
  const rawText = getTokenTextValue(token, area.source);
  const text = String(rawText ?? "").trim();
  if (!text) return;

  const font = resolveFontSettings(token, area.fontRole);
  const startSize = Number(font.size) || 16;
  const minSize = Number(font.minSize) || 1;
  const lineHeightRatio = Number(area.lineHeight) || 1.15;
  const shrinkToFit = area.shrinkToFit !== false;

  let size = startSize;
  let lines = [];
  let lineHeight = size * lineHeightRatio;

  while (size >= minSize) {
    ctx.font = buildFont({ ...font, size });
    lines = area.wrap === false
      ? text.split(/\r?\n/)
      : wrapText(ctx, text, area.width);
    lineHeight = size * lineHeightRatio;

    const fitsHeight = lines.length * lineHeight <= area.height;
    const fitsLines = !area.maxLines || lines.length <= area.maxLines;
    if ((fitsHeight && fitsLines) || !shrinkToFit) break;
    size -= 2;
  }

  size = Math.max(size, minSize);
  ctx.save();
  ctx.font = buildFont({ ...font, size });
  ctx.textAlign = area.align || "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.strokeStyle = area.stroke || "transparent";
  ctx.lineWidth = Number(area.strokeWidth) || 0;
  ctx.fillStyle = area.fill || "#000000";

  const visibleLines = area.maxLines ? lines.slice(0, area.maxLines) : lines;
  const totalHeight = visibleLines.length * lineHeight;
  let firstLineY;

  if (area.verticalAlign === "top") {
    firstLineY = area.y - area.height / 2 + lineHeight / 2;
  } else if (area.verticalAlign === "bottom") {
    firstLineY = area.y + area.height / 2 - totalHeight + lineHeight / 2;
  } else {
    firstLineY = area.y - totalHeight / 2 + lineHeight / 2;
  }

  visibleLines.forEach((line, index) => {
    const y = firstLineY + index * lineHeight;
    if (area.strokeWidth > 0) ctx.strokeText(line, area.x, y, area.width);
    ctx.fillText(line, area.x, y, area.width);
  });

  ctx.restore();
}

function drawSpecialMarker(ctx, marker) {
  if (!marker) return;

  const lineWidth = Number(marker.lineWidth) || 6;

  ctx.save();
  ctx.strokeStyle = marker.stroke || "#000000";
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "miter";
  ctx.strokeRect(
    marker.x - marker.width / 2,
    marker.y - marker.height / 2,
    marker.width,
    marker.height
  );
  ctx.restore();
}

function drawBolt(ctx, x, y, settings) {
  const w = settings.width;
  const h = settings.height;
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(-w * 0.1, -h * 0.5);
  ctx.lineTo(w * 0.42, -h * 0.5);
  ctx.lineTo(w * 0.12, -h * 0.05);
  ctx.lineTo(w * 0.48, -h * 0.05);
  ctx.lineTo(-w * 0.38, h * 0.55);
  ctx.lineTo(-w * 0.06, h * 0.08);
  ctx.lineTo(-w * 0.4, h * 0.08);
  ctx.closePath();
  ctx.fillStyle = settings.fill;
  ctx.strokeStyle = settings.stroke;
  ctx.lineWidth = settings.strokeWidth;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

async function drawTintedMask(ctx, maskSettings, color) {
  if (!maskSettings?.image) return;

  const mask = await loadImage(maskSettings.image);
  const buffer = document.createElement("canvas");
  buffer.width = mask.width;
  buffer.height = mask.height;

  const bufferContext = buffer.getContext("2d", { alpha: true });
  bufferContext.clearRect(0, 0, buffer.width, buffer.height);
  bufferContext.drawImage(mask, 0, 0);
  bufferContext.globalCompositeOperation = "source-in";
  bufferContext.fillStyle = color;
  bufferContext.fillRect(0, 0, buffer.width, buffer.height);

  ctx.drawImage(buffer, maskSettings.x, maskSettings.y);
}

function containSize(image, maxWidth, maxHeight) {
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
  return { width: image.width * scale, height: image.height * scale };
}

async function drawConfiguredIcon(ctx, iconDefinition, position) {
  if (!iconDefinition?.image || !position) return;

  const image = await loadImage(iconDefinition.image);
  const scale = Number(iconDefinition.scale) || 1;
  const dimensions = containSize(
    image,
    position.width * scale,
    position.height * scale
  );

  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.rotate(((Number(position.rotation) || 0) * Math.PI) / 180);
  ctx.drawImage(
    image,
    -dimensions.width / 2,
    -dimensions.height / 2,
    dimensions.width,
    dimensions.height
  );
  ctx.restore();
}


async function drawImprovedAbilities(ctx, token, layout) {
  for (const [groupId, group] of Object.entries(IMPROVED_ABILITY_GROUPS)) {
    const slots = layout.improvedAbilities?.[groupId]?.slots || [];
    const selectedIds = new Set(token.improvedAbilities?.[groupId] || []);
    const selectedAbilities = group.options.filter((ability) =>
      selectedIds.has(ability.id)
    );

    if (selectedAbilities.length === 0) continue;

	const displayItems = [
	  group.main,
	  ...selectedAbilities
	];

    for (let index = 0; index < displayItems.length && index < slots.length; index += 1) {
      await drawConfiguredIcon(ctx, displayItems[index], slots[index]);
    }
  }
}

function createShapePath(ctx, shape, centerX, centerY, width, height = width) {
  ctx.beginPath();

  if (shape === "square") {
    ctx.rect(centerX - width / 2, centerY - height / 2, width, height);
    return;
  }

  ctx.arc(centerX, centerY, Math.min(width, height) / 2, 0, Math.PI * 2);
}

function resolveTemplate(token) {
  return APP_SETTINGS.templates.find((entry) => entry.id === token.templateId)
    || APP_SETTINGS.templates[0];
}

export function getTokenShape(token) {
  const template = resolveTemplate(token);
  const layout = TOKEN_LAYOUTS[template.id];
  return template.shape || layout?.shape || "circle";
}

export async function renderToken(
  canvas,
  token,
  {
    includeTransparentBackground = true,
    bleedScale = 1,
    showCutLine = false
  } = {}
) {
  const normalSize = APP_SETTINGS.canvasSize;
  const outputSize = Math.round(normalSize * Math.max(1, Number(bleedScale) || 1));
  const offset = (outputSize - normalSize) / 2;

  if (canvas.width !== outputSize) canvas.width = outputSize;
  if (canvas.height !== outputSize) canvas.height = outputSize;

  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.clearRect(0, 0, outputSize, outputSize);

  if (!includeTransparentBackground) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outputSize, outputSize);
  }

  const template = resolveTemplate(token);
  const layout = TOKEN_LAYOUTS[template.id];
  if (!layout) throw new Error(`Missing token layout: ${template.id}`);

  const tokenShape = template.shape || layout.shape || "circle";
  const clipInset = Math.max(0, Number(layout.artwork?.clipInset) || 0);

  // Clip the complete output to its configured physical shape.
  ctx.save();
  createShapePath(
    ctx,
    tokenShape,
    outputSize / 2,
    outputSize / 2,
    outputSize,
    outputSize
  );
  ctx.clip();

  if (token.artwork.dataUrl) {
    const artwork = await loadImage(token.artwork.dataUrl);

    ctx.save();
    createShapePath(
      ctx,
      tokenShape,
      outputSize / 2,
      outputSize / 2,
      outputSize - clipInset * 2,
      outputSize - clipInset * 2
    );
    ctx.clip();

    ctx.translate(
      offset + layout.artwork.centerX + token.artwork.x,
      offset + layout.artwork.centerY + token.artwork.y
    );
    ctx.rotate((token.artwork.rotation * Math.PI) / 180);

    const baseScale = Math.max(normalSize / artwork.width, normalSize / artwork.height);
    const scale = baseScale * token.artwork.zoom * layout.artwork.defaultScale;
    ctx.drawImage(
      artwork,
      (-artwork.width * scale) / 2,
      (-artwork.height * scale) / 2,
      artwork.width * scale,
      artwork.height * scale
    );
    ctx.restore();
  }

  // A bleed image is optional. Without one, the normal template is centered
  // and the uploaded artwork can still occupy the bleed area.
  const templateSource = bleedScale > 1 && template.bleedImage
    ? template.bleedImage
    : template.image;
  const templateImage = await loadImage(templateSource);

  if (bleedScale > 1 && template.bleedImage) {
    ctx.drawImage(templateImage, 0, 0, outputSize, outputSize);
  } else {
    ctx.drawImage(templateImage, offset, offset, normalSize, normalSize);
  }

  // All layout coordinates remain based on the normal canvas and are simply
  // centered within the larger bleed canvas.
  ctx.save();
  ctx.translate(offset, offset);

  if (token.name.trim()) {
    drawOutlinedText(
      ctx,
      token.name.trim().toUpperCase(),
      layout.name,
      resolveFontSettings(token, layout.name.fontRole),
      layout.name.maxWidth
    );
  }

  for (const area of Object.values(layout.textAreas || {})) {
    drawConfiguredTextArea(ctx, token, area);
  }

  drawOutlinedText(
    ctx,
    String(token.range ?? ""),
    layout.range,
    resolveFontSettings(token, layout.range.fontRole),
    layout.range.maxWidth
  );

  const boltCount = Math.max(0, Math.min(6, Number(token.bolts) || 0));
  for (let index = 0; index < boltCount; index += 1) {
    drawBolt(
      ctx,
      layout.bolts.startX + index * layout.bolts.stepX,
      layout.bolts.y,
      layout.bolts
    );
  }

  if (token.special) {
    await drawConfiguredIcon(ctx, SPECIAL_ICON, layout.special);
  }

  const teamAbility = TEAM_ABILITY_OPTIONS.find(
    (ability) => ability.id === token.teamAbilityId
  );

  if (teamAbility?.image) {
    await drawConfiguredIcon(ctx, teamAbility, layout.teamAbility);
  }


  await drawImprovedAbilities(ctx, token, layout);

  for (const statDefinition of STAT_DEFINITIONS) {
    const stat = token.stats[statDefinition.id];
    const position = layout.stats[statDefinition.id];
    const color = stat.special
      ? getAbilityColor(statDefinition.id, "none")
      : getAbilityColor(statDefinition.id, stat.abilityId);
    const iconDefinition = statDefinition.icons.find(
      (entry) => entry.id === stat.iconId
    ) || statDefinition.icons[0];
    const icon = await loadImage(iconDefinition.image);

    await drawTintedMask(ctx, position.fillMask, color);

    if (stat.special) {
      drawSpecialMarker(ctx, position.specialMarker);
    }

    drawOutlinedText(
      ctx,
      String(stat.value ?? ""),
      { ...layout.statText, x: position.x, y: position.y },
      resolveFontSettings(token, layout.statText.fontRole),
      layout.statText.maxWidth
    );

    const iconScale = iconDefinition.scale || 1;
    const dimensions = containSize(
      icon,
      position.iconWidth * iconScale,
      position.iconHeight * iconScale
    );

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(
      icon,
      position.iconX - dimensions.width / 2,
      position.iconY - dimensions.height / 2,
      dimensions.width,
      dimensions.height
    );
    ctx.restore();
  }

  ctx.restore(); // Normal-layout coordinate translation.
  ctx.restore(); // Complete output shape clip.

  // Preview-only cut guide. PDF export never requests this option.
  if (showCutLine && bleedScale > 1) {
    ctx.save();
    createShapePath(
      ctx,
      tokenShape,
      outputSize / 2,
      outputSize / 2,
      normalSize,
      normalSize
    );
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 5;
    ctx.setLineDash([18, 14]);
    ctx.stroke();
    ctx.restore();
  }

  return canvas;
}

export async function tokenToDataUrl(token, type = "image/png", quality = 1) {
  const canvas = document.createElement("canvas");
  await renderToken(canvas, token);
  return canvas.toDataURL(type, quality);
}
