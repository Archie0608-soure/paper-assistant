// 论文写作工作流步骤
export const WORKFLOW_STEPS = [
  {
    id: 'topic',
    title: '确定选题',
    description: '输入你的专业方向或感兴趣的主题，AI帮你头脑风暴3个可行的论文选题',
    icon: 'Lightbulb',
  },
  {
    id: 'outline',
    title: '构建大纲',
    description: '选择选题后，AI生成论文结构框架，你可以调整修改',
    icon: 'Layout',
  },
  {
    id: 'literature',
    title: '文献检索',
    description: 'AI帮你搜索相关文献，整理核心观点',
    icon: 'BookOpen',
  },
  {
    id: 'writing',
    title: '分段写作',
    description: '按章节逐步写作，AI辅助但你主导核心内容',
    icon: 'PenTool',
  },
  {
    id: 'polish',
    title: '润色降AI率',
    description: '多模型交叉改写，加入人工痕迹',
    icon: 'Sparkles',
  },
  {
    id: 'export',
    title: '导出排版',
    description: '生成符合学校格式的Word文档',
    icon: 'FileDown',
  },
];

// 选题生成提示词
export const TOPIC_GENERATION_PROMPT = (field: string, interest?: string) => `
你是一位资深的学术论文指导教师。请为${field}专业的学生，${interest ? `对"${interest}"感兴趣` : ''}，提供3个适合本科毕业论文的选题方向。

要求：
1. 选题要具体、可行，适合本科生在3-4个月内完成
2. 每个选题包含：标题、研究问题、研究方法简述
3. 选题要有一定的创新性，但不要太前沿（本科生驾驭不了）
4. 语言要自然、口语化，像老师在给学生建议

请按以下格式输出：

选题1：[标题]
研究问题：[具体问题]
方法建议：[怎么开展]

选题2：[标题]
研究问题：[具体问题]
方法建议：[怎么开展]

选题3：[标题]
研究问题：[具体问题]
方法建议：[怎么开展]
`;

// 系统提示词（降低AI率）
export const SYSTEM_PROMPT = `你是一位帮助学生写论文的助教。你的任务是提供建议、整理思路，而不是替学生写完。

写作风格要求：
- 用自然的口语化表达，不要太书面
- 可以适当用"我觉得"、"可能"、"一般来说"等模糊表达
- 允许句子长短不一，偶尔有点跳跃
- 像真人一样，不必追求完美
`;
