// src/lib/bonfiletSpecTemplate.ts

export interface SpecData {
  // プレビュー画像
  frontPreviewImage?: string; // base64 data URL
  backPreviewImage?: string; // base64 data URL
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

/**
 * 工場向け仕様書のHTMLテンプレートを生成
 * @param data 仕様書データ
 * @param options.showPrintButton Printボタンを表示するか（デフォルト true）
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

  // HTMLエスケープ関数
  function escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const escapedText = escapeHtml(data.text || "");
  const escapedBackText = escapeHtml(data.backText || "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bonfilet Production Specification</title>
  <style>
    @media print {
      @page {
        size: A4;
        margin: 1cm;
      }
      body {
        margin: 0;
        padding: 0;
      }
    }
    body {
      font-family: Arial, sans-serif;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
      border-bottom: 2px solid #333;
      padding-bottom: 10px;
    }
    h2 {
      font-size: 18px;
      margin-top: 20px;
      margin-bottom: 10px;
      color: #555;
    }
    .section {
      margin-bottom: 20px;
    }
    .preview-image {
      max-width: 900px;
      width: 100%;
      height: auto;
      object-fit: contain;
      border: 1px solid #ddd;
      margin: 10px 0;
      background: white;
      display: block;
    }
    .spec-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }
    .spec-table th,
    .spec-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .spec-table th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    .color-box {
      display: inline-block;
      width: 30px;
      height: 30px;
      border: 1px solid #333;
      vertical-align: middle;
      margin-left: 10px;
    }
    .info-row {
      margin: 8px 0;
    }
    .info-label {
      font-weight: bold;
      display: inline-block;
      width: 150px;
    }
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }
    .print-button:hover {
      background-color: #1d4ed8;
    }
    @media print {
      .print-button {
        display: none;
      }
    }
  </style>
</head>
<body>
  ${showPrintButton ? `<button class="print-button" onclick="window.print()">Print</button>` : ""}
  <h1>Bonfilet Production Specification</h1>

  <div class="section">
    <h2>Preview Images</h2>
    ${data.frontPreviewImage ? `<div><strong>Front Side:</strong><br><img src="${data.frontPreviewImage}" alt="Front Preview" class="preview-image"></div>` : ""}
    ${data.backPreviewImage ? `<div style="margin-top: 20px;"><strong>Back Side:</strong><br><img src="${data.backPreviewImage}" alt="Back Preview" class="preview-image"></div>` : ""}
  </div>

  <div class="section">
    <h2>Text Specifications</h2>
    <table class="spec-table">
      <tr>
        <th>Item</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Front Text</td>
        <td>${escapedText || "-"}</td>
      </tr>
      ${data.backText ? `<tr><td>Back Text</td><td>${escapedBackText}</td></tr>` : ""}
    </table>
  </div>

  <div class="section">
    <h2>Color Specifications</h2>
    <table class="spec-table">
      <tr>
        <th>Item</th>
        <th>HEX Code</th>
        <th>Color</th>
      </tr>
      <tr>
        <td>Front Background</td>
        <td>${data.bgColor}</td>
        <td><span class="color-box" style="background-color: ${data.bgColor}"></span></td>
      </tr>
      <tr>
        <td>Front Text Color</td>
        <td>${data.fontColor}</td>
        <td><span class="color-box" style="background-color: ${data.fontColor}"></span></td>
      </tr>
      ${data.backBgColor ? `<tr><td>Back Background</td><td>${data.backBgColor}</td><td><span class="color-box" style="background-color: ${data.backBgColor}"></span></td></tr>` : ""}
      ${data.backFontColor ? `<tr><td>Back Text Color</td><td>${data.backFontColor}</td><td><span class="color-box" style="background-color: ${data.backFontColor}"></span></td></tr>` : ""}
      <tr>
        <td>Font</td>
        <td>${data.font === "inter" ? "Inter" : data.font === "noto-sans" ? "Noto Sans" : data.font === "noto-serif" ? "Noto Serif" : data.font || "Inter"}</td>
        <td>-</td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h2>Order Information</h2>
    <div class="info-row">
      <span class="info-label">Quantity:</span>
      <span>${data.quantity}</span>
    </div>
  </div>

  <div class="section">
    <h2>Shipping Information</h2>
    ${data.shippingName ? `<div class="info-row"><span class="info-label">Name:</span><span>${data.shippingName}</span></div>` : ""}
    ${data.customerEmail ? `<div class="info-row"><span class="info-label">Email:</span><span>${data.customerEmail}</span></div>` : ""}
    ${data.shippingPhone ? `<div class="info-row"><span class="info-label">Phone:</span><span>${data.shippingPhone}</span></div>` : ""}
    ${shippingAddressText ? `<div class="info-row"><span class="info-label">Address:</span><span>${shippingAddressText}</span></div>` : ""}
  </div>
</body>
</html>`;
}

