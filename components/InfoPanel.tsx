import React from 'react';
import { JiaziYear, AnalysisState } from '../types';
import { ELEMENT_COLORS } from '../constants';
import { Sparkles, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface InfoPanelProps {
  selectedYear: JiaziYear | null;
  analysis: AnalysisState;
  onAnalyze: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ selectedYear, analysis, onAnalyze }) => {
  if (!selectedYear) {
    return (
      <div className="h-full flex flex-col justify-center items-center text-slate-400 p-8 border-l border-slate-200 bg-white/50 backdrop-blur-sm">
        <BookOpen size={48} className="mb-4 opacity-50" />
        <p className="text-lg">请在圆盘上选择一个甲子组合以查看详情。</p>
      </div>
    );
  }

  const { stem, branch } = selectedYear;

  return (
    <div className="h-full flex flex-col p-6 bg-white border-l border-slate-200 overflow-y-auto shadow-lg">
      
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h2 className="text-5xl font-bold font-serif-sc text-slate-800 mb-2">{selectedYear.formattedName}</h2>
        <div className="flex justify-center gap-2 mt-4">
           <span className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm" style={{ backgroundColor: ELEMENT_COLORS[stem.element] }}>
              天干: {stem.char} ({stem.element})
           </span>
           <span className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm" style={{ backgroundColor: ELEMENT_COLORS[branch.element] }}>
              地支: {branch.char} ({branch.element})
           </span>
        </div>
      </div>

      {/* Wu Yun Liu Qi Section */}
      <div className="bg-slate-50 rounded-xl p-6 mb-6 border border-slate-100">
        <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            三阴三阳映射
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">地支生肖</span>
                <span className="font-serif-sc font-bold text-lg">{branch.char} ({branch.animal})</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">司天之气</span>
                <span className="font-bold text-indigo-700">{branch.liuQi.name}</span>
            </div>
             <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">气化特征</span>
                <span className="font-medium text-slate-800 text-right">{branch.liuQi.description}</span>
            </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles size={20} className="text-purple-500" />
                AI 气化分析
            </h3>
            {!analysis.content && !analysis.loading && (
                <button 
                    onClick={onAnalyze}
                    className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    解读 {selectedYear.formattedName}年
                </button>
            )}
         </div>

         <div className="flex-1 bg-purple-50 rounded-xl p-6 border border-purple-100 relative min-h-[200px]">
            {analysis.loading ? (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-purple-600">
                    <Loader2 size={32} className="animate-spin mb-2" />
                    <span className="text-sm font-medium">正在查询典籍...</span>
                </div>
            ) : analysis.error ? (
                <div className="flex flex-col items-center justify-center h-full text-red-500">
                    <AlertCircle size={32} className="mb-2" />
                    <p className="text-center text-sm">{analysis.error}</p>
                    <button onClick={onAnalyze} className="mt-4 text-xs underline">重试</button>
                </div>
            ) : analysis.content ? (
                <div className="prose prose-sm prose-purple max-w-none font-serif-sc leading-relaxed">
                    <ReactMarkdown>{analysis.content}</ReactMarkdown>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center h-full text-purple-300">
                    <p className="text-center italic">点击“解读”以生成该年份的详细中医气化分析。</p>
                </div>
            )}
         </div>
      </div>

    </div>
  );
};

export default InfoPanel;