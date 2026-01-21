// src/lib/countryRules.ts
// 配送可能国のルール定義（初期対応12カ国）

export interface EnabledCountry {
  code: string;
  name: string;
}

// 初期対応12カ国（enabled=true）
export const ENABLED_COUNTRIES: EnabledCountry[] = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "VN", name: "Vietnam" },
  { code: "JP", name: "Japan" },
];

// 国名でソート
export const ENABLED_COUNTRIES_SORTED = [...ENABLED_COUNTRIES].sort((a, b) =>
  a.name.localeCompare(b.name)
);

