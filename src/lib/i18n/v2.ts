// src/lib/i18n/v2.ts — v2 で追加した文言（en をベースに各言語で上書き）
const EN = {
  nav: { design: "Design yours", shipsTo: "Ships to", admin: "Admin" },
  hero: {
    eyebrow: "Custom team bands",
    title: "One band. Your words. Your colors.",
    subtitle:
      "Bonfilet is a reversible fabric band for teams, clubs and events. Design it in a minute — we make it and FedEx delivers it, duties prepaid.",
    cta: "Start designing",
    secondary: "See how it works",
    alt: "Close-up of two Bonfilet bands with black clasps, navy side out and yellow reverse showing",
  },
  how: {
    title: "How it works",
    steps: [
      { t: "Type your message", d: "Up to 40 characters. Pick a font." },
      { t: "Choose colors", d: "Front, back, and text — any combination." },
      { t: "Order for the team", d: "From 30 pieces. Price drops with quantity." },
      { t: "Delivered, duties prepaid", d: "Made to order and shipped by FedEx. No surprise fees at the door." },
    ],
  },
  shipsTo: {
    title: "Ships to",
    subtitle: "Duties and taxes are included in the price for these destinations.",
    more: "More destinations are added as we confirm duties with our factory.",
    empty: "Destinations are being confirmed. Check back soon.",
  },
  gallery: {
    eyebrow: "Made to order",
    title: "Every band is woven with your words.",
    alt: "Rows of Bonfilet bands in many colors, each with its own message",
  },
  reversible: {
    eyebrow: "Reversible",
    title: "Two sides. One band.",
    body: "Flip it to switch between a quiet side and a loud one. Front and back are woven separately, so each can carry its own colors and message.",
    alt1: "Three Bonfilet bands showing the navy side and the yellow reverse side",
    alt2: "A single Bonfilet band twisted to reveal both sides",
  },
  finalCta: {
    title: "Ready when your team is.",
    body: "Design in a minute, order from 30 pieces, and we handle the rest.",
  },
  designer: {
    frontLabel: "Front",
    backLabel: "Back",
    band: "Band color",
    text: "Text color",
    message: "Message",
    font: "Font",
    addBack: "Add a back side",
    backAdd: "+¥120 / piece",
    destination: "Ship to",
    quantity: "Quantity",
    min: "min",
    summary: "Summary",
    unit: "Unit price",
    product: "Product",
    shipping: "Shipping (FedEx)",
    duties: "Duties & taxes (prepaid)",
    total: "Total",
    noSurprise: "No additional charges on delivery",
    checkout: "Continue to payment",
    preparing: "Preparing…",
    noCountries: "No destinations available right now.",
    campaignClosed: "This order page is closed.",
    rateNote: "Charged in USD at ¥{rate}/USD. Amounts shown are approximate.",
  },
  success: {
    title: "Thank you — your order is in.",
    body: "We've received your payment and sent a receipt by email. Production starts now; you'll get a tracking number when it ships.",
    dutiesNote: "Duties and taxes were prepaid. Nothing more to pay on delivery.",
    back: "Back to top",
  },
  footer: {
    madeBy: "Planned & manufactured by",
    legal: { tokushoho: "Legal notice", privacy: "Privacy", terms: "Terms" },
    rights: "All rights reserved.",
  },
};

type Texts = typeof EN;

const JA: Texts = {
  nav: { design: "デザインする", shipsTo: "配送対象国", admin: "管理" },
  hero: {
    eyebrow: "チームのためのカスタムバンド",
    title: "ひとつのバンドに、\nあなたの言葉と色を。",
    subtitle:
      "Bonfilet はチーム・部活・イベントのためのリバーシブル布バンド。1分でデザインしたら、あとは製造から FedEx 配送まで関税込みでお届けします。",
    cta: "デザインを始める",
    secondary: "仕組みを見る",
    alt: "黒いバックルの Bonfilet バンド2本のクローズアップ。ネイビーの表面と黄色の裏面が見える",
  },
  how: {
    title: "仕組み",
    steps: [
      { t: "メッセージを入力", d: "最大40文字。フォントを選べます。" },
      { t: "色を選ぶ", d: "表・裏・文字、自由な組み合わせ。" },
      { t: "チーム分まとめて注文", d: "30個から。数量が増えるほど単価が下がります。" },
      { t: "関税込みでお届け", d: "受注生産して FedEx で配送。玄関先での追加請求はありません。" },
    ],
  },
  shipsTo: {
    title: "配送対象国",
    subtitle: "これらの国への関税・税金は価格に含まれています。",
    more: "工場と関税の確認が取れた国から順次追加しています。",
    empty: "配送先を確認中です。しばらくお待ちください。",
  },
  gallery: {
    eyebrow: "受注生産",
    title: "すべてのバンドに、あなたの言葉を織り込む。",
    alt: "色とりどりの Bonfilet バンドが並び、それぞれに異なるメッセージが入っている",
  },
  reversible: {
    eyebrow: "リバーシブル",
    title: "ふたつの面、ひとつのバンド。",
    body: "裏返せば、静かな面と主張する面を切り替えられます。表と裏は別々に織り上げるので、それぞれに色とメッセージを持たせられます。",
    alt1: "ネイビー面と黄色の裏面を見せる3本の Bonfilet バンド",
    alt2: "ねじって両面が見える1本の Bonfilet バンド",
  },
  finalCta: {
    title: "チームの準備ができたら、いつでも。",
    body: "1分でデザイン、30個から注文。あとはおまかせください。",
  },
  designer: {
    frontLabel: "表",
    backLabel: "裏",
    band: "バンドの色",
    text: "文字の色",
    message: "メッセージ",
    font: "フォント",
    addBack: "裏面も入れる",
    backAdd: "+¥120 / 個",
    destination: "配送先",
    quantity: "数量",
    min: "最低",
    summary: "お見積り",
    unit: "単価",
    product: "商品代",
    shipping: "送料（FedEx）",
    duties: "関税・税金（前払い）",
    total: "合計",
    noSurprise: "お届け時の追加請求はありません",
    checkout: "お支払いへ進む",
    preparing: "準備中…",
    noCountries: "現在ご注文いただける配送先がありません。",
    campaignClosed: "この注文ページは受付を終了しました。",
    rateNote: "決済は USD（¥{rate}/USD 換算）。表示額は目安です。",
  },
  success: {
    title: "ご注文ありがとうございます。",
    body: "お支払いを確認し、領収書をメールでお送りしました。これより製造に入ります。発送時に追跡番号をお知らせします。",
    dutiesNote: "関税・税金は前払い済みです。お届け時のお支払いはありません。",
    back: "トップへ戻る",
  },
  footer: {
    madeBy: "企画・製造",
    legal: { tokushoho: "特定商取引法に基づく表記", privacy: "プライバシーポリシー", terms: "利用規約" },
    rights: "All rights reserved.",
  },
};

const MAP: Record<string, Texts> = { en: EN, ja: JA };

export function getV2Texts(locale: string): Texts {
  return MAP[locale] ?? EN;
}
export type V2Texts = Texts;
