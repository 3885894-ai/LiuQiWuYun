import { GoogleGenAI } from "@google/genai";
import { JiaziYear } from "../types";

export const analyzeJiaziWithGemini = async (year: JiaziYear): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    请分析 ${year.formattedName}年 (${year.name}) 的中医五运六气特征。
    
    请使用 Markdown 格式清晰地构建回复，包含以下部分：
    1. **核心气机**：解释天干 (${year.stem.char} - ${year.stem.element}) 与地支 (${year.branch.char} - ${year.branch.element}) 的组合特征。
    2. **司天之气 (六气)**：具体讨论与地支 ${year.branch.char} 关联的“司天”之气 (${year.branch.liuQi.name})。这意味着什么样的气候特征或健康倾向（例如：风、寒、湿等）？
    3. **养生建议**：基于这些气化特征，提供简短的预防性健康建议。

    保持语气专业、学术但通俗易懂。总长度控制在 300 字左右。请直接用中文回复。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
         thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "暂无分析结果。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gemini 分析失败。");
  }
};