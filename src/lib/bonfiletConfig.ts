// src/lib/bonfiletConfig.ts
export const BAND_RECT_RATIO = { x: 0.072, y: 0.452, width: 0.855, height: 0.12 } as const;
export const BONFILET_BASE_IMAGE_PATH = "/bonfilet/bonfilet_base.png";

/** プリセットの帯色（デザインサンプル集より） */
export const BAND_PRESETS = [
  "#0A0A0A", "#333333", "#808080", "#E0E0E0", "#FFFFFF", "#F5F5DC",
  "#001F3F", "#0047AB", "#4169E1", "#87CEFA", "#008080", "#40E0D0",
  "#2E8B57", "#228B22", "#556B2F", "#FFD700", "#FF8C00", "#FF5A1F",
  "#E63946", "#7B0000", "#800080", "#B57EDC", "#FF7F50", "#8B4513",
] as const;

export const TEXT_PRESETS = ["#FFFFFF", "#0A0A0A", "#FFD700", "#E60012", "#3399FF", "#39FF14"] as const;
