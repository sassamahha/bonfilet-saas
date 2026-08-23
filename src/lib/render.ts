// src/lib/render.ts — ブラウザ側 Canvas 描画（片面ずつ）
import { BAND_RECT_RATIO, BONFILET_BASE_IMAGE_PATH } from "./bonfiletConfig";
import { fontFamilyOf } from "./fonts";

export interface SideDesign {
  text: string;
  font: string;
  bgColor: string;
  fontColor: string;
}

let baseImagePromise: Promise<HTMLImageElement> | null = null;

export function loadBaseImage() {
  if (!baseImagePromise) {
    baseImagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = BONFILET_BASE_IMAGE_PATH;
    });
  }
  return baseImagePromise;
}

export async function ensureFont(font: string, sample: string) {
  const family = fontFamilyOf(font);
  try {
    await document.fonts.load(`32px ${family}`, sample || "Aa");
  } catch {
    /* ignore */
  }
}

/** canvas に片面を描く。canvas のサイズはベース画像に合わせて調整する。 */
/** ベース画像のうち表示する縦範囲（帯＋バックル周辺だけを切り出す） */
const CROP = { top: 0.3, height: 0.42 } as const;

export function drawSide(canvas: HTMLCanvasElement, img: HTMLImageElement, d: SideDesign, scale = 1) {
  const fullW = img.naturalWidth;
  const fullH = img.naturalHeight;
  const srcY = Math.round(fullH * CROP.top);
  const srcH = Math.round(fullH * CROP.height);
  const w = Math.round(fullW * scale);
  const h = Math.round(srcH * scale);
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, srcY, fullW, srcH, 0, 0, w, h);

  const band = {
    x: Math.round(w * BAND_RECT_RATIO.x),
    y: Math.round((fullH * BAND_RECT_RATIO.y - srcY) * scale),
    width: Math.round(w * BAND_RECT_RATIO.width),
    height: Math.round(fullH * BAND_RECT_RATIO.height * scale),
  };
  ctx.fillStyle = d.bgColor;
  ctx.fillRect(band.x, band.y, band.width, band.height);

  const text = d.text.trim();
  if (!text) return;
  const family = fontFamilyOf(d.font);
  let fontSize = Math.floor(band.height * 0.55);
  const maxWidth = band.width * 0.9;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = d.fontColor;
  while (fontSize > 8) {
    ctx.font = `500 ${fontSize}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    fontSize -= 1;
  }
  ctx.fillText(text, band.x + band.width / 2, band.y + band.height / 2);
}

/** 保存用の小さめ PNG data URL（幅 800px） */
export async function renderPreviewDataUrl(d: SideDesign) {
  const img = await loadBaseImage();
  await ensureFont(d.font, d.text);
  const canvas = document.createElement("canvas");
  drawSide(canvas, img, d, 800 / img.naturalWidth);
  return canvas.toDataURL("image/png");
}
