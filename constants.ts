import { Element, YinYang, HeavenlyStem, EarthlyBranch, LiuQiMapping } from './types';

export const HEAVENLY_STEMS: HeavenlyStem[] = [
  { index: 0, char: '甲', name: 'Jia', element: Element.Wood, yinYang: YinYang.Yang },
  { index: 1, char: '乙', name: 'Yi', element: Element.Wood, yinYang: YinYang.Yin },
  { index: 2, char: '丙', name: 'Bing', element: Element.Fire, yinYang: YinYang.Yang },
  { index: 3, char: '丁', name: 'Ding', element: Element.Fire, yinYang: YinYang.Yin },
  { index: 4, char: '戊', name: 'Wu', element: Element.Earth, yinYang: YinYang.Yang },
  { index: 5, char: '己', name: 'Ji', element: Element.Earth, yinYang: YinYang.Yin },
  { index: 6, char: '庚', name: 'Geng', element: Element.Metal, yinYang: YinYang.Yang },
  { index: 7, char: '辛', name: 'Xin', element: Element.Metal, yinYang: YinYang.Yin },
  { index: 8, char: '壬', name: 'Ren', element: Element.Water, yinYang: YinYang.Yang },
  { index: 9, char: '癸', name: 'Gui', element: Element.Water, yinYang: YinYang.Yin },
];

// Three Yin Three Yang Mappings (Sitian - Heaven Controlling Qi)
export const LIU_QI: Record<string, LiuQiMapping> = {
  JueYin: { name: '厥阴风木', shortName: '厥阴', energy: '风木', description: '风气，疏泄，动荡' },
  ShaoYin: { name: '少阴君火', shortName: '少阴', energy: '君火', description: '热气，明亮，温煦' },
  ShaoYang: { name: '少阳相火', shortName: '少阳', energy: '相火', description: '暑热，炎上，生发' },
  TaiYin: { name: '太阴湿土', shortName: '太阴', energy: '湿土', description: '湿气，滋润，重浊' },
  YangMing: { name: '阳明燥金', shortName: '阳明', energy: '燥金', description: '燥气，收敛，清凉' },
  TaiYang: { name: '太阳寒水', shortName: '太阳', energy: '寒水', description: '寒气，闭藏，凝肃' },
};

export const EARTHLY_BRANCHES: EarthlyBranch[] = [
  { index: 0, char: '子', name: 'Zi', element: Element.Water, yinYang: YinYang.Yang, animal: '鼠', liuQi: LIU_QI.ShaoYin },
  { index: 1, char: '丑', name: 'Chou', element: Element.Earth, yinYang: YinYang.Yin, animal: '牛', liuQi: LIU_QI.TaiYin },
  { index: 2, char: '寅', name: 'Yin', element: Element.Wood, yinYang: YinYang.Yang, animal: '虎', liuQi: LIU_QI.ShaoYang },
  { index: 3, char: '卯', name: 'Mao', element: Element.Wood, yinYang: YinYang.Yin, animal: '兔', liuQi: LIU_QI.YangMing },
  { index: 4, char: '辰', name: 'Chen', element: Element.Earth, yinYang: YinYang.Yang, animal: '龙', liuQi: LIU_QI.TaiYang },
  { index: 5, char: '巳', name: 'Si', element: Element.Fire, yinYang: YinYang.Yin, animal: '蛇', liuQi: LIU_QI.JueYin },
  { index: 6, char: '午', name: 'Wu', element: Element.Fire, yinYang: YinYang.Yang, animal: '马', liuQi: LIU_QI.ShaoYin },
  { index: 7, char: '未', name: 'Wei', element: Element.Earth, yinYang: YinYang.Yin, animal: '羊', liuQi: LIU_QI.TaiYin },
  { index: 8, char: '申', name: 'Shen', element: Element.Metal, yinYang: YinYang.Yang, animal: '猴', liuQi: LIU_QI.ShaoYang },
  { index: 9, char: '酉', name: 'You', element: Element.Metal, yinYang: YinYang.Yin, animal: '鸡', liuQi: LIU_QI.YangMing },
  { index: 10, char: '戌', name: 'Xu', element: Element.Earth, yinYang: YinYang.Yang, animal: '狗', liuQi: LIU_QI.TaiYang },
  { index: 11, char: '亥', name: 'Hai', element: Element.Water, yinYang: YinYang.Yin, animal: '猪', liuQi: LIU_QI.JueYin },
];

export const ELEMENT_COLORS: Record<Element, string> = {
  [Element.Wood]: '#10b981', // Emerald 500
  [Element.Fire]: '#ef4444', // Red 500
  [Element.Earth]: '#d97706', // Amber 600
  [Element.Metal]: '#94a3b8', // Slate 400
  [Element.Water]: '#3b82f6', // Blue 500
};

export const SOLAR_TERMS_STEPS = [
  "大寒 - 春分", // Step 1
  "春分 - 小满", // Step 2
  "小满 - 大暑", // Step 3
  "大暑 - 秋分", // Step 4
  "秋分 - 小雪", // Step 5
  "小雪 - 大寒", // Step 6
];
