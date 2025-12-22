
import React from 'react';
import { Wind, Sun, CloudRain, Zap, Thermometer, Umbrella, ArrowRight, CircleDot, BookOpen } from 'lucide-react';
import { ELEMENT_COLORS } from '../constants';
import { Element } from '../types';

const GuideView: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        
        {/* Hero Header */}
        <div className="bg-indigo-600 text-white p-8 md:p-12 text-center">
          <BookOpen size={48} className="mx-auto mb-4 opacity-80" />
          <h1 className="text-3xl md:text-4xl font-bold font-serif-sc mb-4">五运六气 · 入门指南</h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto leading-relaxed">
            用通俗的语言，带你读懂古老的中医气象学。探索天地气候变化如何影响人体健康。
          </p>
        </div>

        <div className="p-6 md:p-12 space-y-12">

          {/* Section 1: Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">1</span>
              到底什么是“五运六气”？
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
              <p className="mb-4">
                简单来说，<strong>五运六气</strong>就是中国古人的一套<strong>“超级天气预报”</strong>系统。
              </p>
              <p>
                它认为，每一年、每一个季节的气候变化都是有规律的，而这种气候变化会直接影响人体，导致某些特定的疾病更容易发生。
                这就好比我们知道“冬天冷容易感冒”，“夏天热容易中暑”一样，五运六气只是把这种规律推演得更加精细，精确到每一年、每一个节气。
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <li className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <strong className="text-indigo-600 block mb-1">五运 (Wu Yun)</strong>
                  指金、木、水、火、土五行的运行。它主要管一整年的大趋势（比如今年总体是偏热还是偏冷）。
                </li>
                <li className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <strong className="text-indigo-600 block mb-1">六气 (Liu Qi)</strong>
                  指风、寒、暑、湿、燥、火六种气候特征。它主要管季节性的具体天气变化。
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2: The Core Elements */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">2</span>
              六气：大自然的六种表情
            </h2>
            <p className="text-slate-600 mb-6">
              在中医看来，自然界的气候主要由六种力量主导，我们可以把它们看作大自然的六种“脾气”。
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FeatureCard 
                icon={<Wind size={24} />} 
                title="厥阴风木" 
                subtitle="风" 
                color={ELEMENT_COLORS[Element.Wood]} 
                desc="春天的气息，流动、生发，但也容易导致眩晕、动摇。"
              />
              <FeatureCard 
                icon={<Zap size={24} />} 
                title="少阴君火" 
                subtitle="热" 
                color={ELEMENT_COLORS[Element.Fire]} 
                desc="温暖明亮，像心脏一样提供动力，过头则为热病。"
              />
              <FeatureCard 
                icon={<Sun size={24} />} 
                title="少阳相火" 
                subtitle="暑" 
                color="#F0CF7F" 
                desc="初夏的炎热，像火苗上蹿，容易让人心烦急躁。"
              />
              <FeatureCard 
                icon={<CloudRain size={24} />} 
                title="太阴湿土" 
                subtitle="湿" 
                color={ELEMENT_COLORS[Element.Earth]} 
                desc="长夏的闷热潮湿，黏腻沉重，容易困住脾胃。"
              />
              <FeatureCard 
                icon={<Thermometer size={24} />} 
                title="阳明燥金" 
                subtitle="燥" 
                color={ELEMENT_COLORS[Element.Metal]} 
                desc="秋天的干燥凉爽，收敛肃杀，容易伤肺津。"
              />
              <FeatureCard 
                icon={<Umbrella size={24} />} 
                title="太阳寒水" 
                subtitle="寒" 
                color={ELEMENT_COLORS[Element.Water]} 
                desc="冬天的严寒，封藏凝固，容易伤人体阳气。"
              />
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3: Host and Guest */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">3</span>
              主气与客气：主人与客人的博弈
            </h2>
            <div className="bg-indigo-50 rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <h3 className="font-bold text-indigo-900 text-lg">谁在掌管天气？</h3>
                  <p className="text-indigo-800 leading-relaxed">
                    在“年运视图”中，你会看到两个圈。这就是<strong>主气</strong>和<strong>客气</strong>。
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs">主</div>
                      <p className="text-sm text-indigo-900">
                        <strong>主气 (Host Qi)</strong>：是常驻的主人。它每年都一样，比如春天永远多风，夏天永远炎热。这是季节的底色。
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs">客</div>
                      <p className="text-sm text-indigo-900">
                        <strong>客气 (Guest Qi)</strong>：是每年轮值的客人。它由当年的干支决定，每年不同。比如某年如果是“寒水”来做客，那么这一年就会比往年更冷。
                      </p>
                    </li>
                  </ul>
                </div>
                
                {/* Visual Metaphor */}
                <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-sm border border-indigo-100 flex flex-col items-center text-center">
                    <div className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">Metaphor</div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="p-2 bg-indigo-100 rounded-lg">🏠 主人</span>
                        <ArrowRight size={16} className="text-slate-300"/>
                        <span className="p-2 bg-amber-100 rounded-lg">👤 客人</span>
                    </div>
                    <p className="text-xs text-slate-500">
                        真正的天气 = 主人的性格 + 客人的脾气。<br/>
                        如果“客气”克制“主气”（如客是冷，主是热），气候变化就会剧烈，人容易生病。
                    </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Key Roles */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">4</span>
              年度大BOSS：司天与在泉
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-colors">
                    <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                        <CircleDot size={20} className="text-indigo-600" />
                        司天 (Si Tian)
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-2">
                        <strong>掌管上半年</strong>（大寒到小暑）。
                    </p>
                    <p className="text-sm text-slate-500">
                        它是全年的总指挥。如果今年是“太阴湿土司天”，那么上半年雨水就会比较多，湿气重。
                    </p>
                </div>
                <div className="border border-slate-200 rounded-xl p-5 hover:border-emerald-300 transition-colors">
                    <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                        <CircleDot size={20} className="text-emerald-600" />
                        在泉 (Zai Quan)
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-2">
                        <strong>掌管下半年</strong>（大暑到大寒）。
                    </p>
                    <p className="text-sm text-slate-500">
                        它是下半年的执行官。决定了秋冬季节的气候收尾特征。
                    </p>
                </div>
            </div>
          </section>

           {/* Section 5: Usage */}
           <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">5</span>
              如何使用这个工具？
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-slate-600 ml-2">
                <li>在首页圆盘上，<strong>点击你出生的年份</strong>或<strong>当前年份</strong>。</li>
                <li>查看右侧面板，了解该年份的<strong>司天之气</strong>（年度基调）。</li>
                <li>切换到<strong>“年运视图”</strong>，查看更详细的六步气变化，看看现在正处于哪一步气，注意相应的健康防护。</li>
                <li>切换到<strong>“日运视图”</strong>，了解一天中十二时辰的阴阳消长，顺应天时作息。</li>
            </ol>
          </section>

        </div>
      </div>
    </div>
  );
};

// Helper Component for Feature Cards
const FeatureCard = ({ icon, title, subtitle, color, desc }: any) => (
  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-2 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg text-white" style={{backgroundColor: color}}>
            {icon}
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded bg-white text-slate-600 border border-slate-200">
            {subtitle}
        </span>
    </div>
    <h3 className="font-bold text-slate-800 mt-1">{title}</h3>
    <p className="text-xs text-slate-500 leading-snug">{desc}</p>
  </div>
);

export default GuideView;
