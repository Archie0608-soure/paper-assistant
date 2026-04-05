import { NextRequest, NextResponse } from 'next/server';
import { crossModelGenerate } from '@/lib/ai-models';
import { TOPIC_GENERATION_PROMPT, SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { field, interest } = await req.json();
    
    if (!field) {
      return NextResponse.json(
        { error: '请填写专业方向' },
        { status: 400 }
      );
    }

    // 从环境变量获取API Keys
    const apiKeys = {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      moonshot: process.env.MOONSHOT_API_KEY,
    };

    // 检查至少有一个模型可用
    if (!apiKeys.openai && !apiKeys.anthropic && !apiKeys.moonshot) {
      return NextResponse.json(
        { error: '未配置任何AI模型，请联系管理员' },
        { status: 500 }
      );
    }

    const prompt = TOPIC_GENERATION_PROMPT(field, interest);
    
    const result = await crossModelGenerate(prompt, apiKeys, {
      system: SYSTEM_PROMPT,
      modelOrder: ['moonshot', 'openai', 'anthropic'], // 优先用Kimi
    });

    return NextResponse.json({
      topics: result.text,
      modelsUsed: result.modelsUsed,
    });
  } catch (error) {
    console.error('Generate topics error:', error);
    return NextResponse.json(
      { error: '生成选题失败，请稍后重试' },
      { status: 500 }
    );
  }
}
