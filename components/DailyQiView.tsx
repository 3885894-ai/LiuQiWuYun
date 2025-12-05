
import React, { useState, useEffect } from 'react';
import { getDailyQiSteps, DailyQiStep } from '../utils/dailyQi';
import DailyQiWheel from './DailyQiWheel';
import { getLiuQiColor } from '../utils/jiazi';
import { Clock, Sun, Moon } from 'lucide-react';

const DailyQiView: React.FC = () => {
  // Use state to trigger re-renders every minute to update the clock
  const [steps, setSteps] = useState<DailyQiStep[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Initial load
    setSteps(getDailyQiSteps());
    
    // Timer
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setSteps(getDailyQiSteps());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const currentStep = steps.find(s => s.isCurrent);

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold font-serif-sc text-slate-800 flex items-center gap-3">
                    <Clock className="text-indigo-600" />
                    日运 · 十二时辰
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    当前时间: <span className="font-mono text-slate-700">{currentTime.toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}</span> · 
                    {currentStep ? ` 正值${currentStep.label} (${currentStep.branch.liuQi.name})` : ''}
                </p>
            </div>
            
            <div className="flex gap-2 text-xs font-medium">
               <div className="px-3 py-1 bg-white border border-slate-200 rounded-full flex items-center gap-1 text-amber-600 shadow-sm">
                 <Sun size={14} />
                 午时 (阳极)
               </div>
               <div className="px-3 py-1 bg-white border border-slate-200 rounded-full flex items-center gap-1 text-slate-600 shadow-sm">
                 <Moon size={14} />
                 子时 (阴极)
               </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left: Visualization */}
            <div className="w-full lg:w-auto flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
                <DailyQiWheel steps={steps} width={360} height={360} />
                <div className="mt-6 text-center text-xs text-slate-400 max-w-[300px]">
                    <p>内圈为十二地支时辰，颜色对应六气属性。<br/>红色指针指示当前时刻。上方为午(正午)，下方为子(半夜)。</p>
                </div>
            </div>

            {/* Right: List */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {steps.map((step) => {
                    const color = getLiuQiColor(step.branch.liuQi.shortName);
                    return (
                        <div 
                            key={step.branch.index}
                            className={`p-4 rounded-xl border transition-all flex items-center justify-between
                                ${step.isCurrent 
                                    ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-200 transform scale-[1.02]' 
                                    : 'bg-white border-slate-100 text-slate-400 opacity-80 hover:opacity-100 hover:border-slate-300'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-serif-sc font-bold shadow-sm"
                                    style={{ backgroundColor: color }}
                                >
                                    {step.branch.char}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-bold ${step.isCurrent ? 'text-slate-800' : 'text-slate-600'}`}>
                                            {step.label}
                                        </h3>
                                        {step.isCurrent && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Current</span>}
                                    </div>
                                    <p className="text-xs font-mono mt-0.5 opacity-80">{step.startTime} - {step.endTime}</p>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <span 
                                    className="text-xs font-medium px-2 py-1 rounded"
                                    style={{ 
                                        color: step.isCurrent ? '#1e293b' : color,
                                        backgroundColor: step.isCurrent ? `${color}33` : 'transparent' // 20% opacity hex roughly
                                    }}
                                >
                                    {step.branch.liuQi.name}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
      </div>
    </div>
  );
};

export default DailyQiView;
