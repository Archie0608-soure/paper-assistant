import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

// Moonshot (Kimi) 配置
const moonshot = (apiKey: string) => ({
  id: 'moonshot',
  name: 'Moonshot Kimi',
  async generateText({ prompt, system }: { prompt: string; system?: string }) {
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'kimi-k2.5',
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Moonshot API error: ${response.status}`);
    }
    
    const data = await response.json();
    return { text: data.choices[0].message.content };
  },
});

// 模型配置
export function getModels(apiKeys: { openai?: string; anthropic?: string; moonshot?: string }) {
  const models: Record<string, any> = {};
  
  if (apiKeys.openai) {
    models.openai = openai('gpt-4o');
  }
  
  if (apiKeys.anthropic) {
    models.anthropic = anthropic('claude-3-5-sonnet-20241022');
  }
  
  if (apiKeys.moonshot) {
    models.moonshot = moonshot(apiKeys.moonshot);
  }
  
  return models;
}

// 多模型交叉生成（降低AI率策略）
export async function crossModelGenerate(
  prompt: string,
  apiKeys: { openai?: string; anthropic?: string; moonshot?: string },
  options?: { system?: string; modelOrder?: string[] }
) {
  const models = getModels(apiKeys);
  const order = options?.modelOrder || ['moonshot', 'openai', 'anthropic'];
  
  // 过滤掉没有配置的模型
  const availableModels = order.filter(m => models[m]);
  
  if (availableModels.length === 0) {
    throw new Error('No models configured');
  }
  
  // 先用第一个模型生成
  const primaryModel = availableModels[0];
  let result: string;
  
  if (primaryModel === 'moonshot') {
    const res = await models.moonshot.generateText({ 
      prompt, 
      system: options?.system 
    });
    result = res.text;
  } else {
    const { text } = await generateText({
      model: models[primaryModel],
      prompt,
      system: options?.system,
    });
    result = text;
  }
  
  // 如果有第二个模型，用来润色/改写
  if (availableModels.length > 1) {
    const secondModel = availableModels[1];
    const polishPrompt = `请用更自然、口语化的方式改写以下内容，保持原意但让它读起来更像真人写的（可以有一些不那么完美的表达）：\n\n${result}`;
    
    if (secondModel === 'moonshot') {
      const res = await models.moonshot.generateText({ prompt: polishPrompt });
      result = res.text;
    } else {
      const { text } = await generateText({
        model: models[secondModel],
        prompt: polishPrompt,
      });
      result = text;
    }
  }
  
  return {
    text: result,
    modelsUsed: availableModels.slice(0, 2),
  };
}
