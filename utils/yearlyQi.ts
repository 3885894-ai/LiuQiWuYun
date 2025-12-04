import { LIU_QI, SOLAR_TERMS_STEPS } from '../constants';
import { JiaziYear, YearlyQiStep, LiuQiMapping } from '../types';

// Sequence of Main Qi (Fixed every year)
// 1. Jue Yin (Wood)
// 2. Shao Yin (Monarch Fire)
// 3. Shao Yang (Minister Fire)
// 4. Tai Yin (Earth)
// 5. Yang Ming (Metal)
// 6. Tai Yang (Water)
const MAIN_QI_SEQUENCE: LiuQiMapping[] = [
  LIU_QI.JueYin,
  LIU_QI.ShaoYin,
  LIU_QI.ShaoYang,
  LIU_QI.TaiYin,
  LIU_QI.YangMing,
  LIU_QI.TaiYang,
];

// Sequence of Guest Qi Circulation (Yin -> Yang)
// 1. Jue Yin
// 2. Shao Yin
// 3. Tai Yin
// 4. Shao Yang
// 5. Yang Ming
// 6. Tai Yang
const GUEST_QI_SEQUENCE: LiuQiMapping[] = [
  LIU_QI.JueYin,   // Index 0
  LIU_QI.ShaoYin,  // Index 1
  LIU_QI.TaiYin,   // Index 2
  LIU_QI.ShaoYang, // Index 3
  LIU_QI.YangMing, // Index 4
  LIU_QI.TaiYang,  // Index 5
];

// Helper to find the index of a LiuQi in the GUEST sequence
const getGuestQiIndex = (shortName: string): number => {
  return GUEST_QI_SEQUENCE.findIndex(qi => qi.shortName === shortName);
};

export const getYearlyQiSteps = (year: JiaziYear): YearlyQiStep[] => {
  // 1. Determine Si Tian (Heaven Controlling Qi)
  // This is the Qi associated with the Year's Branch.
  // Si Tian is always the Guest Qi of the 3rd Step.
  const siTianQi = year.branch.liuQi;
  const siTianIndexInGuestSeq = getGuestQiIndex(siTianQi.shortName);

  const steps: YearlyQiStep[] = [];

  for (let i = 0; i < 6; i++) {
    const stepNumber = i + 1; // 1 to 6
    
    // Calculate Guest Qi for this step
    // If Step 3 (index 2) is SiTianIndex,
    // Step i's index is: (SiTianIndex - 2 + i) % 6
    // Because index 2 corresponds to SiTianIndex.
    let guestIndex = (siTianIndexInGuestSeq - 2 + i) % 6;
    if (guestIndex < 0) guestIndex += 6;

    const guestQi = GUEST_QI_SEQUENCE[guestIndex];
    
    // Main Qi is fixed
    const mainQi = MAIN_QI_SEQUENCE[i];

    steps.push({
      index: stepNumber,
      name: getStepName(stepNumber),
      period: SOLAR_TERMS_STEPS[i],
      mainQi,
      guestQi,
      isSiTian: stepNumber === 3,
      isZaiQuan: stepNumber === 6,
    });
  }

  return steps;
};

const getStepName = (index: number): string => {
  const names = ["初之气", "二之气", "三之气", "四之气", "五之气", "终之气"];
  return names[index - 1];
};
