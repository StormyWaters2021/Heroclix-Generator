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
  return queue.flatMap((item) => Array.from({ length: Math.max(1, Number(item.quantity) || 1) }, () => item.token));
}

function getLayout(mode, includeBleed, tightPack) {
  if (mode === "avery8293") {
    return { ...PRINT_SETTINGS.modes.avery8293, type: "avery" };
  }
  if (includeBleed) {
    return { ...PRINT_SETTINGS.modes.max.bleed, type: "centered-bleed" };
  }
  return { ...(tightPack ? PRINT_SETTINGS.modes.max.tight : PRINT_SETTINGS.modes.max.normal), type: "centered" };
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

export async function createPrintPdf(queue, options = {}) {
  const tokens = expandQueue(queue);
  if (!tokens.length) throw new Error("Add at least one token to the print list first.");

  const mode = options.mode || "max";
  const includeBleed = Boolean(options.includeBleed);
  const tightPack = Boolean(options.tightPack);
  const layout = getLayout(mode, includeBleed, tightPack);
  const positions = getPositions(layout);
  const dpi = PRINT_SETTINGS.page.renderDpi;
  const pageWidth = Math.round(PRINT_SETTINGS.page.widthInches * dpi);
  const pageHeight = Math.round(PRINT_SETTINGS.page.heightInches * dpi);
  const tokenPixels = Math.round(layout.tokenDiameterInches * dpi);
  const bleedPixels = Math.round(PRINT_SETTINGS.bleedInches * dpi);
  const tokenCanvases = new Map();
  const jpegPages = [];

  for (let pageStart = 0; pageStart < tokens.length; pageStart += positions.length) {
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

    const pageTokens = tokens.slice(pageStart, pageStart + positions.length);
    for (let index = 0; index < pageTokens.length; index += 1) {
      const token = pageTokens[index];
      let tokenCanvas = tokenCanvases.get(token.id);
      if (!tokenCanvas) {
        tokenCanvas = document.createElement("canvas");
        await renderToken(tokenCanvas, token);
        tokenCanvases.set(token.id, tokenCanvas);
      }

      const position = positions[index];
      const centerX = Math.round(position.centerX * dpi);
      const centerY = Math.round(position.centerY * dpi);

      if (includeBleed) {
        ctx.save();
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(centerX, centerY, tokenPixels / 2 + bleedPixels, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.drawImage(
        tokenCanvas,
        centerX - tokenPixels / 2,
        centerY - tokenPixels / 2,
        tokenPixels,
        tokenPixels
      );
    }

		jpegPages.push(
		  dataUrlToBytes(
			pageCanvas.toDataURL(
			  "image/jpeg",
			  PRINT_SETTINGS.page.jpegQuality ?? 1
			)
		  )
		);
  }

  return buildPdf(jpegPages, pageWidth, pageHeight);
}
