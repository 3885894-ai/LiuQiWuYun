import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from '../constants';
import { JiaziYear } from '../types';

export const generateJiaziCycle = (): JiaziYear[] => {
  const cycle: JiaziYear[] = [];
  for (let i = 0; i < 60; i++) {
    const stemIndex = i % 10;
    const branchIndex = i % 12;
    const stem = HEAVENLY_STEMS[stemIndex];
    const branch = EARTHLY_BRANCHES[branchIndex];
    
    cycle.push({
      index: i,
      stem,
      branch,
      name: `${stem.name}${branch.name}`,
      formattedName: `${stem.char}${branch.char}`,
    });
  }
  return cycle;
};

export const JIAZI_CYCLE = generateJiaziCycle();

export const getLiuQiColor = (liuQiShortName: string): string => {
   switch (liuQiShortName) {
     case '厥阴': return '#8AB89F'; // 豆绿/柳绿 (Muted Jade) - 风木
     case '少阴': return '#E68A86'; // 茜红/桃红 (Soft Cinnabar) - 君火
     case '少阳': return '#F0CF7F'; // 姜黄/杏黄 (Muted Apricot) - 相火
     case '太阴': return '#D1BA74'; // 沉香/土黄 (Muted Ochre) - 湿土
     case '阳明': return '#C2C6CF'; // 铅白/银灰 (Muted Silver) - 燥金
     case '太阳': return '#8FBAD6'; // 缥色/花青 (Muted Azure) - 寒水
     default: return '#cbd5e1';
   }
};

export const getJiaziIndexFromYear = (year: number): number => {
  // 1984 is a JiaZi year (index 0).
  // We calculate the offset. JS modulo can be negative, so we handle that.
  const offset = (year - 1984) % 60;
  return offset >= 0 ? offset : offset + 60;
};