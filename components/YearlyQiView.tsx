import React, { useMemo } from 'react';
import { JiaziYear } from '../types';
import { getYearlyQiSteps } from '../utils/yearlyQi.ts';
import { getLiuQiColor } from '../utils/jiazi';
import { Wind, Sun, CloudRain, Snowflake, AlertCircle, ArrowRight } from 'lucide-react';

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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold font-serif-sc text-slate-800 mb-2">
                {selectedYear.formattedName}年 ({selectedYear.name}) 六气分布
            </h2>
            <p className="text-slate-500">
                主气常驻，客气流变。客主加临，决定了一年中不同时段的气候与健康特征。
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => {
                const mainColor = getLiuQiColor(step.mainQi.shortName);
                const guestColor = getLiuQiColor(step.guestQi.shortName);
                
                return (
                    <div 
                        key={step.index} 
                        className={`relative bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md
                            ${step.isSiTian ? 'border-indigo-300 ring-1 ring-indigo-200' : ''}
                            ${step.isZaiQuan ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'}
                        `}
                    >
                        {/* Header */}
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800 font-serif-sc">{step.name}</h3>
                                <p className="text-xs text-slate-500">{step.period}</p>
                            </div>
                            <div className="flex gap-2">
                                {step.isSiTian && (
                                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                        司天
                                    </span>
                                )}
                                {step.isZaiQuan && (
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                        在泉
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            
                            {/* Comparison Row */}
                            <div className="flex items-center justify-between gap-2">
                                {/* Host */}
                                <div className="flex-1 flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">主气 (地)</span>
                                    <span 
                                        className="w-3 h-3 rounded-full mb-1" 
                                        style={{ backgroundColor: mainColor }}
                                    ></span>
                                    <span className="font-medium text-sm text-slate-700">{step.mainQi.name}</span>
                                </div>
                                
                                <ArrowRight size={16} className="text-slate-300" />

                                {/* Guest */}
                                <div className="flex-1 flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">客气 (天)</span>
                                    <span 
                                        className="w-3 h-3 rounded-full mb-1" 
                                        style={{ backgroundColor: guestColor }}
                                    ></span>
                                    <span className="font-medium text-sm text-slate-700">{step.guestQi.name}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="text-xs text-slate-600 bg-slate-50/50 p-3 rounded-lg leading-relaxed">
                                <p><strong className="text-slate-700">客气特征:</strong> {step.guestQi.description}</p>
                            </div>
                        </div>
                        
                        {/* Footer Bar for Step Index */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50"></div>
                    </div>
                );
            })}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100 flex items-start gap-3">
            <div className="mt-0.5"><Wind size={16} /></div>
            <div>
                <p className="font-bold mb-1">提示：</p>
                <p>
                    <strong>司天之气 (三之气)</strong> 主上半年气候，决定了该年主要的气候基调。<br/>
                    <strong>在泉之气 (终之气)</strong> 主下半年气候。<br/>
                    当客气生主气，或客主同气时，通常气候较平和；当客气克主气（如客火克主金），气候变化可能较剧烈，需注意相应健康防护。
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default YearlyQiView;
