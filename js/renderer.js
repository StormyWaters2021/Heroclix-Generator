import { APP_SETTINGS } from "../settings/app-settings.js";
import { TOKEN_LAYOUTS } from "../settings/token-layouts.js";
import {
  STAT_DEFINITIONS,
  SPECIAL_ICON,
  TEAM_ABILITY_OPTIONS
} from "../settings/icon-options.js";
import { getAbilityColor } from "../settings/ability-colors.js";
import { loadImage } from "./assets.js";

function buildFont(settings) {
  const style = settings.style || "normal";
  const weight = settings.weight || "400";
  return `${style} ${weight} ${settings.size}px "${settings.family}", ${settings.fallback || "sans-serif"}`;
}

function fitText(ctx, text, settings, maxWidth) {
  let size = settings.size;
  do {
    ctx.font = buildFont({ ...settings, size });
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  } while (size > 18);
}

function drawOutlinedText(ctx, text, position, font, maxWidth) {
  ctx.save();
  fitText(ctx, text, font, maxWidth);
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

export async function renderToken(canvas, token, { includeTransparentBackground = true } = {}) {
  const size = APP_SETTINGS.canvasSize;
  if (canvas.width !== size) canvas.width = size;
  if (canvas.height !== size) canvas.height = size;

  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.clearRect(0, 0, size, size);
  if (!includeTransparentBackground) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
  }

  const template = APP_SETTINGS.templates.find((entry) => entry.id === token.templateId) || APP_SETTINGS.templates[0];
  const layout = TOKEN_LAYOUTS[template.layoutId];

  if (token.artwork.dataUrl) {
    const artwork = await loadImage(token.artwork.dataUrl);
    ctx.save();
    ctx.beginPath();
    ctx.arc(layout.artwork.clipCenterX, layout.artwork.clipCenterY, layout.artwork.clipRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.translate(
      layout.artwork.centerX + token.artwork.x,
      layout.artwork.centerY + token.artwork.y
    );
    ctx.rotate((token.artwork.rotation * Math.PI) / 180);
    const baseScale = Math.max(size / artwork.width, size / artwork.height);
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

  const templateImage = await loadImage(template.image);
  ctx.drawImage(templateImage, 0, 0, size, size);

  if (token.name.trim()) {
    drawOutlinedText(ctx, token.name.trim().toUpperCase(), layout.name, APP_SETTINGS.fonts.name, layout.name.maxWidth);
  }

  drawOutlinedText(
    ctx,
    String(token.range ?? ""),
    layout.range,
    APP_SETTINGS.fonts.range,
    layout.range.maxWidth || 90
  );
  const boltCount = Math.max(0, Math.min(6, Number(token.bolts) || 0));
  for (let index = 0; index < boltCount; index += 1) {
    drawBolt(ctx, layout.bolts.startX + index * layout.bolts.stepX, layout.bolts.y, layout.bolts);
  }

  if (token.special) {
    await drawConfiguredIcon(ctx, SPECIAL_ICON, layout.special);
  }

  const teamAbility = TEAM_ABILITY_OPTIONS.find(
    (ability) => ability.id === token.teamAbilityId
  );

  if (teamAbility?.image) {
    await drawConfiguredIcon(
	  ctx,
	  teamAbility,
	  layout.teamAbility
    );
  }

  for (const statDefinition of STAT_DEFINITIONS) {
    const stat = token.stats[statDefinition.id];
    const position = layout.stats[statDefinition.id];
    const color = getAbilityColor(statDefinition.id, stat.abilityId);
    const iconDefinition = statDefinition.icons.find((entry) => entry.id === stat.iconId) || statDefinition.icons[0];
    const icon = await loadImage(iconDefinition.image);

    await drawTintedMask(ctx, position.fillMask, color);

    drawOutlinedText(
      ctx,
      String(stat.value ?? ""),
      { ...layout.statText, x: position.x, y: position.y },
      APP_SETTINGS.fonts.stats,
      92
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

  return canvas;
}

export async function tokenToDataUrl(token, type = "image/png", quality = 1) {
  const canvas = document.createElement("canvas");
  await renderToken(canvas, token);
  return canvas.toDataURL(type, quality);
}
