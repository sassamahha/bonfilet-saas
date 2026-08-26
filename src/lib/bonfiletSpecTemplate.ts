// src/lib/bonfiletSpecTemplate.ts — 工場向け仕様書（A4 1枚・印刷前提）

export interface SpecData {
  // プレビュー画像
  frontPreviewImage?: string; // data URL または URL
  backPreviewImage?: string;
  // 文字情報
  text: string;
  backText?: string;
  // カラー情報（HEXコード）
  bgColor: string;
  fontColor: string;
  backBgColor?: string;
  backFontColor?: string;
  // フォント
  font?: string;
  // 数量
  quantity: number;
  // 注文者情報
  customerName?: string;
  customerEmail?: string;
  // 配送先情報
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

const FONT_LABELS: Record<string, string> = {
  inter: "Inter",
  "noto-sans": "Noto Sans JP (Gothic)",
  "noto-serif": "Noto Serif JP (Mincho)",
  "kosugi-maru": "Kosugi Maru (Rounded Gothic)",
  "zen-maru": "Zen Maru Gothic Bold (Rounded, Bold)",
  mplus: "M PLUS 1p Bold (Gothic, Bold)",
};

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * 工場向け仕様書のHTMLテンプレートを生成（A4 1枚に収まるレイアウト）
 */
export function generateSpecHTML(
  data: SpecData,
  options?: { showPrintButton?: boolean }
): string {
  const showPrintButton = options?.showPrintButton ?? true;
  const shippingAddressText = data.shippingAddress
    ? [
        data.shippingAddress.line1,
        data.shippingAddress.line2,
        data.shippingAddress.city,
        data.shippingAddress.state,
        data.shippingAddress.postal_code,
        data.shippingAddress.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const escapedText = escapeHtml(data.text || "");
  const escapedBackText = escapeHtml(data.backText || "");
  const fontLabel = FONT_LABELS[data.font ?? "inter"] ?? data.font ?? "Inter";

  const colorRow = (label: string, hex?: string) =>
    hex
      ? `<tr><td>${label}</td><td class="mono">${hex}</td><td><span class="color-box" style="background-color: ${hex}"></span></td></tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bonfilet Production Specification</title>
  <style>
    /* 印刷時に背景色（色見本）を落とさない */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @media print {
      @page { size: A4; margin: 10mm; }
      body { margin: 0; padding: 0; }
      .print-button { display: none; }
    }
    body {
      font-family: Arial, "Hiragino Sans", sans-serif;
      max-width: 190mm;
      margin: 0 auto;
      padding: 12px;
      color: #222;
      font-size: 12px;
      line-height: 1.45;
    }
    h1 {
      font-size: 17px;
      margin: 0 0 10px;
      border-bottom: 2px solid #222;
      padding-bottom: 6px;
    }
    h2 {
      font-size: 12px;
      margin: 0 0 4px;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .section { margin-bottom: 10px; }
    .previews { display: flex; gap: 8px; }
    .previews figure { flex: 1; margin: 0; }
    .previews figcaption { font-weight: bold; margin-bottom: 3px; font-size: 11px; }
    .preview-image {
      width: 100%;
      max-height: 42mm;
      object-fit: contain;
      border: 1px solid #ddd;
      background: #fff;
      display: block;
    }
    .columns { display: flex; gap: 12px; align-items: flex-start; }
    .columns > div { flex: 1; }
    .spec-table { width: 100%; border-collapse: collapse; }
    .spec-table th, .spec-table td {
      border: 1px solid #ccc;
      padding: 4px 6px;
      text-align: left;
      font-size: 11.5px;
    }
    .spec-table th { background-color: #f2f2f2; font-weight: bold; }
    .mono { font-family: "Courier New", monospace; }
    .color-box {
      display: inline-block;
      width: 26px;
      height: 14px;
      border: 1px solid #333;
      vertical-align: middle;
      border-radius: 2px;
    }
    .qty {
      font-size: 15px;
      font-weight: bold;
      border: 2px solid #222;
      display: inline-block;
      padding: 4px 14px;
      border-radius: 4px;
    }
    .info-table td { border: 1px solid #ccc; padding: 4px 6px; font-size: 11.5px; }
    .info-table td:first-child { background: #f2f2f2; font-weight: bold; width: 70px; }
    .print-button {
      position: fixed; top: 16px; right: 16px;
      background-color: #2563eb; color: #fff; border: none;
      padding: 10px 20px; border-radius: 6px; cursor: pointer;
      font-size: 14px; font-weight: 600; z-index: 1000;
    }
    .print-button:hover { background-color: #1d4ed8; }
  </style>
</head>
<body>
  ${showPrintButton ? `<button class="print-button" onclick="window.print()">Print / PDF</button>` : ""}
  <h1>Bonfilet Production Specification</h1>

  <div class="section previews">
    ${data.frontPreviewImage ? `<figure><figcaption>Front</figcaption><img src="${data.frontPreviewImage}" alt="Front Preview" class="preview-image"></figure>` : ""}
    ${data.backPreviewImage ? `<figure><figcaption>Back</figcaption><img src="${data.backPreviewImage}" alt="Back Preview" class="preview-image"></figure>` : ""}
  </div>

  <div class="section columns">
    <div>
      <h2>Text</h2>
      <table class="spec-table">
        <tr><th>Item</th><th>Value</th></tr>
        <tr><td>Front Text</td><td>${escapedText || "-"}</td></tr>
        ${data.backText ? `<tr><td>Back Text</td><td>${escapedBackText}</td></tr>` : ""}
        <tr><td>Font</td><td>${fontLabel}</td></tr>
      </table>
      <div style="margin-top: 10px;">
        <h2>Quantity</h2>
        <span class="qty">${data.quantity} pcs</span>
      </div>
    </div>
    <div>
      <h2>Colors</h2>
      <table class="spec-table">
        <tr><th>Item</th><th>HEX</th><th>Color</th></tr>
        ${colorRow("Front Background", data.bgColor)}
        ${colorRow("Front Text", data.fontColor)}
        ${colorRow("Back Background", data.backBgColor)}
        ${colorRow("Back Text", data.backFontColor)}
      </table>
    </div>
  </div>

  <div class="section">
    <h2>Ship To (FedEx)</h2>
    <table class="spec-table info-table" style="width: 100%;">
      ${data.shippingName ? `<tr><td>Name</td><td>${escapeHtml(data.shippingName)}</td></tr>` : ""}
      ${shippingAddressText ? `<tr><td>Address</td><td>${escapeHtml(shippingAddressText)}</td></tr>` : ""}
      ${data.shippingPhone ? `<tr><td>Phone</td><td>${escapeHtml(data.shippingPhone)}</td></tr>` : ""}
    </table>
  </div>
</body>
</html>`;
}
