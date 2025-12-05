import React, { useMemo } from 'react';
import { JiaziYear } from '../types';
import { getYearlyQiSteps } from '../utils/yearlyQi.ts';
import { getLiuQiColor } from '../utils/jiazi';
import YearlyQiWheel from './YearlyQiWheel';
import { Wind, ArrowRight, AlertCircle } from 'lucide-react';

interface YearlyQiViewProps {
  selectedYear: JiaziYear | null;
}

const YearlyQiView: React.FC<YearlyQiViewProps> = ({ selectedYear }) => {
  const steps = useMemo(() => {
    if (!selectedYear) return [];
    return getYearlyQiSteps(selectedYear);
  }, [selectedYear]);

  if (!selectedYear) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-slate-400 bg-white">
        <AlertCircle size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">未选择年份</h2>
        <p>请先在搜索栏输入年份或在首页圆盘选择一个年份。</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col xl:flex-row gap-8">
        
        {/* Left Column: Visualization & Summary */}
        <div className="xl:w-1/3 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
                <div className="mb-4 text-center">
                    <h2 className="text-2xl font-bold font-serif-sc text-slate-800">
                        {selectedYear.formattedName}年
                    </h2>
                    <p className="text-sm text-slate-500">
                        {selectedYear.name} · 六气圆运动
                    </p>
                </div>
                
                <YearlyQiWheel steps={steps} width={320} height={320} />
                
                <div className="mt-6 text-xs text-slate-500 text-center leading-relaxed max-w-xs">
                    <p>
                        图示说明：<br/>
                        <strong>外环</strong>代表客气（随年运变化）<br/>
                        <strong>内环</strong>代表主气（季节固定常数）<br/>
                        <span className="text-indigo-600 font-bold">★ 司天</span>主上半年，
                        <span className="text-emerald-600 font-bold">● 在泉</span>主下半年。
                    </p>
                </div>
            </div>

            <div className="bg-blue-50 text-blue-800 rounded-xl p-6 border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <Wind size={20} />
                    <h3 className="font-bold">气化总纲</h3>
                </div>
                <p className="text-sm leading-relaxed mb-3">
                    <strong>司天 ({steps[2].guestQi.name}):</strong> 决定了本年度上半年的气候基调与主要的病机倾向。
                </p>
                <p className="text-sm leading-relaxed">
                    <strong>在泉 ({steps[5].guestQi.name}):</strong> 决定了本年度下半年的气候特征。
                </p>
            </div>
        </div>

        {/* Right Column: Detailed Steps Grid */}
        <div className="xl:w-2/3">
             <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                六步气详解 (主客加临)
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {steps.map((step) => {
                    const mainColor = getLiuQiColor(step.mainQi.shortName);
                    const guestColor = getLiuQiColor(step.guestQi.shortName);
                    
                    return (
                        <div 
                            key={step.index} 
                            className={`relative bg-white rounded-xl shadow-sm border transition-all hover:shadow-md
                                ${step.isSiTian ? 'border-indigo-300 ring-1 ring-indigo-200' : ''}
                                ${step.isZaiQuan ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'}
                            `}
                        >
                            {/* Card Header */}
                            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-800 font-serif-sc">{step.name}</h3>
                                        <span className="text-xs text-slate-400 font-mono">Step {step.index}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{step.period}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    {step.isSiTian && (
                                        <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                            ★ 司天
                                        </span>
                                    )}
                                    {step.isZaiQuan && (
                                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                            ● 在泉
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    {/* Main Qi */}
                                    <div className="flex-1 bg-slate-50 p-2 rounded border border-slate-100 flex flex-col items-center">
                                        <span className="text-[10px] text-slate-400 mb-1">主气 (地)</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: mainColor}}></span>
                                            <span className="text-sm font-medium text-slate-700">{step.mainQi.shortName}</span>
                                        </div>
                                    </div>

                                    <ArrowRight size={14} className="text-slate-300" />

                                    {/* Guest Qi */}
                                    <div className="flex-1 bg-slate-50 p-2 rounded border border-slate-100 flex flex-col items-center">
                                        <span className="text-[10px] text-slate-400 mb-1">客气 (天)</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: guestColor}}></span>
                                            <span className="text-sm font-medium text-slate-700">{step.guestQi.shortName}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs text-slate-600 leading-relaxed">
                                    <span className="font-bold text-slate-700">特征：</span>
                                    {step.guestQi.description}
                                </div>
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

export default YearlyQiView;