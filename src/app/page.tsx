'use client';

import { useState } from 'react';
import { Lightbulb, Loader2, BookOpen, Layout, PenTool, Sparkles, FileDown } from 'lucide-react';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  BookOpen,
  Layout,
  PenTool,
  Sparkles,
  FileDown,
};

export default function Home() {
  const [field, setField] = useState('');
  const [interest, setInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!field.trim()) {
      setError('请填写专业方向');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, interest }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '生成失败');
      }

      setResult(data.topics);
    } catch (err: any) {
      setError(err.message || '出错了，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold text-slate-900">PaperAssist</h1>
          <span className="text-sm text-slate-500 ml-2">低AI率论文助手</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            从选题到成稿，全程辅助
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            人机协作的写作流程，多模型交叉降低AI率，让你的论文既有质量又有个性
          </p>
        </div>

        {/* Step 1: Topic Generation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">第一步：确定选题</h3>
              <p className="text-sm text-slate-500">输入你的专业方向，AI帮你头脑风暴</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                专业方向 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="例如：计算机科学、工商管理、心理学..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                感兴趣的方向（可选）
              </label>
              <input
                type="text"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="例如：人工智能、消费者行为、抑郁症治疗..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  正在生成选题...
                </>
              ) : (
                <>
                  <Lightbulb className="w-5 h-5" />
                  生成选题建议
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-4">选题建议：</h4>
                <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                  {result}
                </pre>
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">
                    选择选题1，继续下一步
                  </button>
                  <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition">
                    重新生成
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Future Steps Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: 'Layout', title: '构建大纲', desc: 'AI生成论文结构' },
            { icon: 'PenTool', title: '分段写作', desc: '人机协作撰写' },
            { icon: 'Sparkles', title: '润色降AI率', desc: '多模型交叉优化' },
          ].map((step, i) => {
            const Icon = icons[step.icon];
            return (
              <div key={i} className="bg-white/50 rounded-xl p-6 border border-slate-200 opacity-60">
                <Icon className="w-8 h-8 text-slate-400 mb-3" />
                <h4 className="font-medium text-slate-700">{step.title}</h4>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
