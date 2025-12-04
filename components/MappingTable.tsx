import React from 'react';
import { getJiaziIndexFromYear, JIAZI_CYCLE, getLiuQiColor } from '../utils/jiazi';
import { JiaziYear } from '../types';

const MappingTable: React.FC = () => {
  const startYear = 1977;
  const endYear = 2076;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, k) => startYear + k);

  // Helper to check if a color is hex and convert to rgba for background opacity
  // Or simply rely on the hex color from utility and apply opacity via style
  
  return (
    <div className="w-full h-full overflow-hidden flex flex-col bg-white">
      <div className="p-6 border-b border-slate-100 bg-white">
         <h2 className="text-xl font-bold font-serif-sc text-slate-800">百年气运一览表 (1977 - 2076)</h2>
         <p className="text-sm text-slate-500 mt-1">公历年份与干支、司天之气（六气）的完整对应关系</p>
      </div>
      
      <div className="flex-1 overflow-auto p-0 sm:p-6 bg-slate-50">
        <div className="max-w-5xl mx-auto bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th scope="col" className="py-3.5 px-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">公历</th>
                        <th scope="col" className="py-3.5 px-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">干支</th>
                        <th scope="col" className="py-3.5 px-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">司天 (六气)</th>
                        <th scope="col" className="py-3.5 px-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">气化特征</th>
                        <th scope="col" className="py-3.5 px-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">五行 (运)</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {years.map(year => {
                        const index = getJiaziIndexFromYear(year);
                        const jiazi: JiaziYear = JIAZI_CYCLE[index];
                        const qiColor = getLiuQiColor(jiazi.branch.liuQi.shortName);
                        const isCurrentYear = new Date().getFullYear() === year;

                        return (
                            <tr key={year} className={`hover:bg-slate-50 transition-colors ${isCurrentYear ? 'bg-indigo-50 hover:bg-indigo-100' : ''}`}>
                                <td className="py-3 px-3 text-sm font-medium text-slate-900 font-mono">
                                    {year}
                                    {isCurrentYear && <span className="ml-2 text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded">今</span>}
                                </td>
                                <td className="py-3 px-3 text-sm text-slate-800 font-serif-sc font-bold">
                                    {jiazi.formattedName} ({jiazi.name})
                                </td>
                                <td className="py-3 px-3 text-sm">
                                    <span 
                                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border border-black/5"
                                        style={{ backgroundColor: qiColor, color: '#1e293b' }}
                                    >
                                        {jiazi.branch.liuQi.name}
                                    </span>
                                </td>
                                <td className="py-3 px-3 text-sm text-slate-600 hidden sm:table-cell">
                                    {jiazi.branch.liuQi.description}
                                </td>
                                <td className="py-3 px-3 text-sm text-slate-500 hidden md:table-cell">
                                    <div className="flex gap-2">
                                        <span className="text-xs border px-1 rounded text-slate-600 border-slate-200">干: {jiazi.stem.element}</span>
                                        <span className="text-xs border px-1 rounded text-slate-600 border-slate-200">支: {jiazi.branch.element}</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default MappingTable;