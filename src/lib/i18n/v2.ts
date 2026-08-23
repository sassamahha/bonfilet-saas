// src/lib/i18n/v2.ts — v2 で追加した文言（en をベースに各言語で上書き）
const EN = {
  nav: { design: "Design yours", shipsTo: "Ships to", admin: "Admin" },
  hero: {
    eyebrow: "Bands for your fans",
    title: "A band for every fan.\nThin enough to mail.",
    subtitle:
      "Bonfilet is a reversible fabric band teams and creators hand out to their fans. It weighs almost nothing and ships flat — so even a thousand pieces travel in one small parcel.",
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
      { t: "Shipped flat, shipped cheap", d: "Thin and light, so shipping is a flat rate by quantity — not by weight." },
    ],
  },
  shipsTo: {
    title: "Ships to",
    subtitle: "Flat-rate shipping, all import costs included. What you see is what you pay.",
    more: "More destinations are added as we confirm shipping with our factory.",
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
  mail: {
    eyebrow: "Thin enough to mail",
    title: "A thousand bands. One small parcel.",
    body: "Each band is a few millimetres thick and weighs a few grams. Orders ship flat from our factory, so shipping stays a flat rate by quantity — the same whether it is 30 pieces or 300.",
    alt: "A flat stack of Bonfilet bands next to a small shipping box",
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
    shipping: "Shipping (flat rate, all-in)",
    duties: "Import costs",
    bands: "Flat rate by quantity",
    total: "Total",
    noSurprise: "Ships flat in one small parcel. Nothing more to pay on delivery.",
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
    eyebrow: "ファンに配るバンド",
    title: "ファンに配れる、\n郵送できる薄さのバンド。",
    subtitle:
      "Bonfilet はチームやクリエイターがファンに配るためのリバーシブル布バンド。薄くて軽く、平らに梱包できるので、1000 個でも小さな一箱で届きます。",
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
      { t: "薄いから、送料が安い", d: "軽くて平らなので送料は重さではなく数量帯で一律。" },
    ],
  },
  shipsTo: {
    title: "配送対象国",
    subtitle: "送料は数量帯で一律、輸入時の費用もすべて込み。表示額がそのままお支払い額です。",
    more: "工場と配送の確認が取れた国から順次追加しています。",
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
  mail: {
    eyebrow: "郵送できる薄さ",
    title: "1000 本でも、小さな一箱。",
    body: "1 本の厚みは数ミリ、重さは数グラム。工場から平らに梱包して出荷するので、送料は数量帯で一律。30 本でも 300 本でも同じ送料です。",
    alt: "平らに積まれた Bonfilet と小さな配送箱",
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
    shipping: "送料（数量帯一律・諸費用込み）",
    duties: "輸入諸費用",
    bands: "数量帯ごとの一律送料",
    total: "合計",
    noSurprise: "平らに梱包して小さな一箱でお届け。受け取り時のお支払いはありません。",
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
