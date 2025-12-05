
import { EARTHLY_BRANCHES } from '../constants';
import { EarthlyBranch } from '../types';

export interface DailyQiStep {
  branch: EarthlyBranch;
  startTime: string; // e.g., "23:00"
  endTime: string;   // e.g., "01:00"
  label: string;     // e.g., "子时"
  isCurrent: boolean;
}

export const getDailyQiSteps = (): DailyQiStep[] => {
  const currentHour = new Date().getHours();
  
  // Earthly Branches 0-11.
  // Index 0 (Zi) is 23:00 - 01:00
  // Index 1 (Chou) is 01:00 - 03:00
  // ...
  
  const steps: DailyQiStep[] = EARTHLY_BRANCHES.map((branch) => {
    // Calculate start hour for this branch
    // Zi (0) starts at 23.
    // Others start at (index * 2) - 1.
    // Let's normalize to 0-23 range.
    
    // Branch 0 (Zi): 23
    // Branch 1 (Chou): 1
    // Branch 2 (Yin): 3
    // ...
    // Formula: (branch.index * 2 + 23) % 24
    
    const startHour = (branch.index * 2 + 23) % 24;
    const endHour = (startHour + 2) % 24;
    
    // Check if current
    // Special case for Zi (23:00 - 01:00)
    let isCurrent = false;
    if (branch.index === 0) {
       isCurrent = currentHour >= 23 || currentHour < 1;
    } else {
       isCurrent = currentHour >= startHour && currentHour < (startHour + 2); 
       // Note: simple comparison works because periods don't cross midnight except Zi
    }

    const formatHour = (h: number) => h.toString().padStart(2, '0') + ":00";

    return {
      branch,
      startTime: formatHour(startHour),
      endTime: formatHour(endHour),
      label: `${branch.char}时`,
      isCurrent
    };
  });

  return steps;
};
