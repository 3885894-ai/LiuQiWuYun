export enum Element {
  Wood = '木',
  Fire = '火',
  Earth = '土',
  Metal = '金',
  Water = '水',
}

export enum YinYang {
  Yin = '阴',
  Yang = '阳',
}

export interface HeavenlyStem {
  index: number;
  char: string;
  name: string;
  element: Element;
  yinYang: YinYang;
}

export interface EarthlyBranch {
  index: number;
  char: string;
  name: string;
  element: Element;
  yinYang: YinYang;
  animal: string;
  liuQi: LiuQiMapping; // The connection to 3 Yin 3 Yang
}

export interface LiuQiMapping {
  name: string; // e.g., Tai Yang Cold Water
  shortName: string; // e.g., Tai Yang
  energy: string; // e.g., Cold Water
  description: string;
}

export interface JiaziYear {
  index: number; // 0-59
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  name: string; // e.g., JiaZi
  formattedName: string; // e.g., 甲子
}

export interface YearlyQiStep {
  index: number; // 1-6
  name: string; // e.g., 初之气
  period: string; // e.g., 大寒 - 春分
  mainQi: LiuQiMapping; // 主气
  guestQi: LiuQiMapping; // 客气
  isSiTian: boolean;
  isZaiQuan: boolean;
}

// Gemini Types
export interface AnalysisState {
  loading: boolean;
  content: string | null;
  error: string | null;
}
