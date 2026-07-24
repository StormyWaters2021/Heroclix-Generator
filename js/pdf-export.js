import { PRINT_SETTINGS } from "../settings/print-layouts.js";
import { renderToken } from "./renderer.js";

function dataUrlToBytes(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function ascii(value) {
  return new TextEncoder().encode(value);
}

function concatBytes(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

function buildPdf(jpegPages, pixelWidth, pixelHeight) {
  const pageWidthPoints = 612;
  const pageHeightPoints = 792;
  const objectCount = 2 + jpegPages.length * 3;
  const objects = new Array(objectCount + 1);

  const pageObjectIds = jpegPages.map((_, index) => 3 + index * 3);
  objects[1] = ascii("<< /Type /Catalog /Pages 2 0 R >>");
  objects[2] = ascii(`<< /Type /Pages /Count ${jpegPages.length} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] >>`);

  jpegPages.forEach((jpeg, index) => {
    const pageId = 3 + index * 3;
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    const imageName = `Im${index + 1}`;
    const content = ascii(`q\n${pageWidthPoints} 0 0 ${pageHeightPoints} 0 0 cm\n/${imageName} Do\nQ\n`);

    objects[pageId] = ascii(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidthPoints} ${pageHeightPoints}] ` +
      `/Resources << /XObject << /${imageName} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    objects[imageId] = concatBytes([
      ascii(`<< /Type /XObject /Subtype /Image /Width ${pixelWidth} /Height ${pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`),
      jpeg,
      ascii("\nendstream")
    ]);
    objects[contentId] = concatBytes([
      ascii(`<< /Length ${content.length} >>\nstream\n`),
      content,
      ascii("endstream")
    ]);
  });

  const chunks = [ascii("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n")];
  const offsets = new Array(objectCount + 1).fill(0);
  let currentOffset = chunks[0].length;

  for (let id = 1; id <= objectCount; id += 1) {
    offsets[id] = currentOffset;
    const objectChunk = concatBytes([ascii(`${id} 0 obj\n`), objects[id], ascii("\nendobj\n")]);
    chunks.push(objectChunk);
    currentOffset += objectChunk.length;
  }

  const xrefOffset = currentOffset;
  const xrefLines = ["xref", `0 ${objectCount + 1}`, "0000000000 65535 f "];
  for (let id = 1; id <= objectCount; id += 1) {
    xrefLines.push(`${String(offsets[id]).padStart(10, "0")} 00000 n `);
  }
  chunks.push(ascii(`${xrefLines.join("\n")}\ntrailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`));
  return new Blob([concatBytes(chunks)], { type: "application/pdf" });
}

function expandQueue(queue) {
  return queue.flatMap((item) =>
    Array.from(
      { length: Math.max(1, Number(item.quantity) || 1) },
      () => item.tokens
    )
  );
}

function getLayout(mode, includeBleed, tightPack) {
  if (mode === "avery8293") {
    return { ...PRINT_SETTINGS.modes.avery8293, type: "avery" };
  }
  if (includeBleed) {
    return { ...PRINT_SETTINGS.modes.max.bleed, type: "centered-bleed" };
  }
  return {
    ...(tightPack ? PRINT_SETTINGS.modes.max.tight : PRINT_SETTINGS.modes.max.normal),
    type: "centered"
  };
}

function getPositions(layout) {
  const page = PRINT_SETTINGS.page;
  const positions = [];

  if (layout.type === "avery") {
    for (let row = 0; row < layout.rows; row += 1) {
      for (let column = 0; column < layout.columns; column += 1) {
        positions.push({
          centerX: layout.firstCenterXInches + column * layout.centerSpacingXInches,
          centerY: layout.firstCenterYInches + row * layout.centerSpacingYInches
        });
      }
    }
    return positions;
  }

  const footprint = layout.footprintInches || layout.tokenDiameterInches;
  const gapX = layout.gapXInches || 0;
  const gapY = layout.gapYInches || 0;
  const gridWidth = layout.columns * footprint + (layout.columns - 1) * gapX;
  const gridHeight = layout.rows * footprint + (layout.rows - 1) * gapY;
  const startX = (page.widthInches - gridWidth) / 2 + footprint / 2;
  const startY = (page.heightInches - gridHeight) / 2 + footprint / 2;

  for (let row = 0; row < layout.rows; row += 1) {
    for (let column = 0; column < layout.columns; column += 1) {
      positions.push({
        centerX: startX + column * (footprint + gapX),
        centerY: startY + row * (footprint + gapY)
      });
    }
  }

  return positions;
}

export function getTokensPerPage(mode, includeBleed, tightPack) {
  const layout = getLayout(mode, includeBleed, tightPack);
  return layout.columns * layout.rows;
}

async function getRenderedTokenCanvas(cache, token, bleedScale) {
  const cacheKey = `${token.id}:${bleedScale}`;
  let tokenCanvas = cache.get(cacheKey);

  if (!tokenCanvas) {
    tokenCanvas = document.createElement("canvas");
    await renderToken(tokenCanvas, token, { bleedScale });
    cache.set(cacheKey, tokenCanvas);
  }

  return tokenCanvas;
}

async function renderPdfPage({
  pairs,
  side,
  positions,
  renderedPixels,
  bleedScale,
  dpi,
  pageWidth,
  pageHeight,
  tokenCanvases,
  mirrorHorizontally = false
}) {
  const pageCanvas = document.createElement("canvas");
  pageCanvas.width = pageWidth;
  pageCanvas.height = pageHeight;

  const ctx = pageCanvas.getContext("2d", {
    alpha: false,
    desynchronized: true
  });

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, pageWidth, pageHeight);

  for (let index = 0; index < pairs.length; index += 1) {
    const pair = pairs[index];
    const token = pair[side];
    const tokenCanvas = await getRenderedTokenCanvas(
      tokenCanvases,
      token,
      bleedScale
    );

    const position = positions[index];
    const centerXInches = mirrorHorizontally
      ? PRINT_SETTINGS.page.widthInches - position.centerX
      : position.centerX;
    const centerX = Math.round(centerXInches * dpi);
    const centerY = Math.round(position.centerY * dpi);

    ctx.drawImage(
      tokenCanvas,
      centerX - renderedPixels / 2,
      centerY - renderedPixels / 2,
      renderedPixels,
      renderedPixels
    );
  }

  return dataUrlToBytes(
    pageCanvas.toDataURL(
      "image/jpeg",
      PRINT_SETTINGS.page.jpegQuality ?? 1
    )
  );
}

export async function createPrintPdf(queue, options = {}) {
  const pairs = expandQueue(queue);
  if (!pairs.length) {
    throw new Error("Add at least one token to the print list first.");
  }

  const mode = options.mode || "max";
  const includeBleed = Boolean(options.includeBleed);
  const doubleSided = options.doubleSided !== false;
  const tightPack = Boolean(options.tightPack);
  const layout = getLayout(mode, includeBleed, tightPack);
  const positions = getPositions(layout);
  const dpi = PRINT_SETTINGS.page.renderDpi;
  const pageWidth = Math.round(PRINT_SETTINGS.page.widthInches * dpi);
  const pageHeight = Math.round(PRINT_SETTINGS.page.heightInches * dpi);

  const renderedDiameterInches = includeBleed
    ? layout.tokenDiameterInches + PRINT_SETTINGS.bleedInches * 2
    : layout.tokenDiameterInches;
  const renderedPixels = Math.round(renderedDiameterInches * dpi);
  const bleedScale = renderedDiameterInches / layout.tokenDiameterInches;

  const tokenCanvases = new Map();
  const jpegPages = [];

  for (let pageStart = 0; pageStart < pairs.length; pageStart += positions.length) {
    const pagePairs = pairs.slice(pageStart, pageStart + positions.length);

    // Front and back pages are interleaved for ordinary duplex printing.
    jpegPages.push(await renderPdfPage({
      pairs: pagePairs,
      side: "front",
      positions,
      renderedPixels,
      bleedScale,
      dpi,
      pageWidth,
      pageHeight,
      tokenCanvases
    }));

    if (doubleSided) {
      // Back positions are mirrored left-to-right so they align after a
      // portrait sheet is flipped on its long edge. Token artwork is not mirrored.
      jpegPages.push(await renderPdfPage({
        pairs: pagePairs,
        side: "back",
        positions,
        renderedPixels,
        bleedScale,
        dpi,
        pageWidth,
        pageHeight,
        tokenCanvases,
        mirrorHorizontally: true
      }));
    }
  }

  return buildPdf(jpegPages, pageWidth, pageHeight);
}
