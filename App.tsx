
import React, { useState, useEffect } from 'react';
import JiaziWheel from './components/JiaziWheel';
import InfoPanel from './components/InfoPanel';
import MappingTable from './components/MappingTable';
import YearlyQiView from './components/YearlyQiView';
import DailyQiView from './components/DailyQiView';
import { JiaziYear, AnalysisState } from './types';
import { JIAZI_CYCLE, getJiaziIndexFromYear } from './utils/jiazi';
import { analyzeJiaziWithGemini } from './services/geminiService';
import { Info, Search, PieChart, Table as TableIcon, CalendarRange, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<JiaziYear | null>(null);
  const [searchYearInput, setSearchYearInput] = useState<string>('');
  const [viewMode, setViewMode] = useState<'wheel' | 'table' | 'yearly' | 'daily'>('wheel');
  
  const [analysis, setAnalysis] = useState<AnalysisState>({
    loading: false,
    content: null,
    error: null,
  });

  // Responsive dimensions for the wheel
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      const size = isMobile ? Math.min(window.innerWidth - 40, 500) : 600;
      setDimensions({ width: size, height: size });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Init

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset analysis when year changes
  useEffect(() => {
    setAnalysis({ loading: false, content: null, error: null });
  }, [selectedYear]);

  const handleYearSelect = (year: JiaziYear) => {
    setSelectedYear(year);
    setSearchYearInput('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const yearNum = parseInt(searchYearInput);
    
    if (!isNaN(yearNum)) {
      const index = getJiaziIndexFromYear(yearNum);
      const targetJiazi = JIAZI_CYCLE.find(j => j.index === index);
      if (targetJiazi) {
        setSelectedYear(targetJiazi);
        // Switch to wheel view usually, but if searching while in yearly/table, maybe user wants to see that data
        // For now, if in table, switch to wheel. If in yearly, stay in yearly to see that year's data.
        if (viewMode === 'table' || viewMode === 'daily') {
            setViewMode('wheel');
        }
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedYear) return;

    setAnalysis({ loading: true, content: null, error: null });
    try {
      const result = await analyzeJiaziWithGemini(selectedYear);
      setAnalysis({ loading: false, content: result, error: null });
    } catch (err) {
      setAnalysis({ loading: false, content: null, error: "分析生成失败，请检查 API Key。" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden">
      
      {/* Global Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 z-30 shadow-sm shrink-0 h-auto md:h-20">
        <div className="flex items-center gap-4">
           <div>
             <h1 className="text-xl md:text-2xl font-bold text-slate-800 font-serif-sc">
                甲子 & 三阴三阳
             </h1>
             <p className="text-xs text-slate-500 hidden sm:block">
                六十甲子与六气可视化图谱
             </p>
           </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
             {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 relative">
                <input
                  type="number"
                  value={searchYearInput}
                  onChange={(e) => setSearchYearInput(e.target.value)}
                  placeholder="年份 (如 2024)"
                  className="pl-3 pr-8 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32 sm:w-48 bg-slate-50"
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <Search size={16} />
                </button>
            </form>

            {/* View Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto">
                <button
                    onClick={() => setViewMode('wheel')}
                    className={`p-2 rounded-md transition-all ${
                        viewMode === 'wheel' 
                        ? 'bg-white shadow text-indigo-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    title="圆盘视图"
                >
                    <PieChart size={20} />
                </button>
                <button
                    onClick={() => setViewMode('yearly')}
                    className={`p-2 rounded-md transition-all ${
                        viewMode === 'yearly' 
                        ? 'bg-white shadow text-indigo-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    title="年运视图 (六步气)"
                >
                    <CalendarRange size={20} />
                </button>
                <button
                    onClick={() => setViewMode('daily')}
                    className={`p-2 rounded-md transition-all ${
                        viewMode === 'daily' 
                        ? 'bg-white shadow text-indigo-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    title="日运视图 (十二时辰)"
                >
                    <Clock size={20} />
                </button>
                <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-md transition-all ${
                        viewMode === 'table' 
                        ? 'bg-white shadow text-indigo-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    title="列表视图"
                >
                    <TableIcon size={20} />
                </button>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        
        {viewMode === 'table' ? (
            <div className="h-full w-full animate-in fade-in duration-300">
                <MappingTable />
            </div>
        ) : viewMode === 'yearly' ? (
             <div className="h-full w-full animate-in fade-in duration-300">
                <YearlyQiView selectedYear={selectedYear} />
             </div>
        ) : viewMode === 'daily' ? (
             <div className="h-full w-full animate-in fade-in duration-300">
                <DailyQiView />
             </div>
        ) : (
            <div className="flex flex-col lg:flex-row h-full">
                {/* Left: Wheel */}
                <div className="flex-1 flex justify-center items-center p-4 bg-slate-50/50 overflow-y-auto">
                    <JiaziWheel 
                        selectedYear={selectedYear} 
                        onSelectYear={handleYearSelect}
                        width={dimensions.width}
                        height={dimensions.height}
                    />
                    
                    {/* Mobile Hint */}
                    {!selectedYear && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm text-slate-500 text-sm flex items-center gap-2 lg:hidden pointer-events-none">
                            <Info size={16} />
                            点击圆盘探索
                        </div>
                    )}
                </div>

                {/* Right: Info Panel */}
                <div className="lg:w-[450px] w-full h-[40vh] lg:h-full shadow-2xl z-20 transition-all duration-300 border-t lg:border-t-0 lg:border-l border-slate-200">
                    <InfoPanel 
                        selectedYear={selectedYear} 
                        analysis={analysis} 
                        onAnalyze={handleAnalyze} 
                    />
                </div>
            </div>
        )}

      </div>

    </div>
  );
};

export default App;
