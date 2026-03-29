# 高中数学辅导小程序 📚

> 一个温柔的 AI 数学老师，陪伴高中生学习数学

---

## ✨ 功能特点

- 🤖 **AI 智能答疑** — 接入通义千问，解答高中数学问题
- 📝 **详细解题步骤** — 不跳步，耐心讲解每一步
- 💬 **温柔语气** — 像大姐姐一样温暖的教学风格
- 📱 **微信小程序** — 随时随地，想问就问
- 💾 **对话历史** — 自动保存，方便复习
- 🎤 **语音输入** — 长按录音，自动转文字提问
- 📖 **知识点学习** — 按章节选择，自动讲解核心概念
- ✏️ **随堂练习** — 按知识点出题，帮助巩固
- ⚡ **快速响应** — 云函数部署，秒级回复

---

## 🎯 适用场景

- 高中数学作业辅导
- 考前复习答疑
- 知识点讲解
- 解题思路引导
- 数学概念理解

---

## 📁 项目结构

```
math-tutor-miniprogram/
├── cloudfunctions/           # 云函数目录
│   └── qwenChat/            # AI 对话云函数
│       ├── index.js         # 云函数入口
│       ├── config.js        # 配置入口（从环境变量/本地私有配置读取）
│       ├── config.local.example.js  # 本地私有配置示例（复制为 config.local.js）
│       ├── systemPrompt.js  # AI 人设提示词（可提交）
│       ├── package.json     # 依赖
│       └── .gitignore       # Git 忽略文件
├── pages/
│   ├── chat/                # 聊天页面
│   │   ├── chat.js
│   │   ├── chat.wxml
│   │   ├── chat.wxss
│   │   └── chat.json
│   ├── index/               # 首页
│   ├── topics/              # 知识点页面
│   ├── practice/            # 练习题页面
│   └── history/             # 学习记录页面
├── docs/                    # 文档目录
│   ├── 接入指南.md          # 完整接入文档
│   └── 快速开始.md          # 5 分钟快速上手
├── app.js                   # 全局配置
├── app.json                 # 小程序配置
├── project.config.json      # 项目配置
└── README.md                # 本文档
```

---

## 🚀 快速开始

### 前置要求

- 微信开发者工具（最新版）
- 阿里云账号（获取 API Key）
- 微信小程序账号（开发用）

### 5 分钟部署

1. **获取 API Key**
   - 访问 https://bailian.console.aliyun.com/
   - 创建 API Key 并复制

2. **配置云函数**
   - 在 `cloudfunctions/qwenChat/` 下复制 `config.local.example.js` 为 `config.local.js`
   - 在 `config.local.js` 中填入你的 API Key（不要提交到 Git）
   - 或者在云端给云函数配置环境变量 `DASHSCOPE_API_KEY`

3. **配置云环境**
   - 编辑 `app.js`
   - 填入你的云环境 ID

4. **上传云函数**
   - 右键 `cloudfunctions/qwenChat`
   - 选择「上传并部署：云端安装依赖」

5. **编译运行**
   - 点击「编译」
   - 测试 AI 对话

详细步骤见：[`docs/快速开始.md`](docs/快速开始.md)

---

## 🔧 配置说明

### 云函数配置 (`cloudfunctions/qwenChat/config.js`)

```javascript
// config.js 只负责“读取配置”，不应包含真实密钥
module.exports = {
  DASHSCOPE_API_KEY: process.env.DASHSCOPE_API_KEY || '',
  MODEL: process.env.QWEN_MODEL || 'qwen-math',
  SYSTEM_PROMPT: '...'
}
```

### 本地私有配置（推荐）(`cloudfunctions/qwenChat/config.local.js`)

复制示例文件：

```javascript
module.exports = {
  DASHSCOPE_API_KEY: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
  MODEL: 'qwen-math'
}
```

### AI 提示词（可提交）(`cloudfunctions/qwenChat/systemPrompt.js`)

`systemPrompt.js` 存放 AI 老师人设/教学策略，适合提交到代码库做版本管理与评审。

### 小程序配置 (`app.js`)

```javascript
globalData: {
  // 云环境 ID
  cloudEnvId: 'cloud1-xxx-xxx',
  
  // AI 配置
  aiConfig: {
    cloudFunctionName: 'qwenChat',
    timeout: 30000
  }
}
```

---

## 💰 成本估算

| 项目 | 价格 | 说明 |
|------|------|------|
| 通义千问 API | ¥0.004/次 | 按 token 计费 |
| 微信云函数 | 免费 | 每月 500 万次额度 |
| **合计** | **≈¥12/月** | 每天 100 次问答 |

新用户有免费额度，测试完全免费！

---

## 📚 文档

- [📖 快速开始](docs/快速开始.md) — 5 分钟上手
- [📖 完整接入指南](docs/接入指南.md) — 详细配置说明
- [📖 通义千问 API 文档](https://help.aliyun.com/zh/dashscope/developer-reference/api-details)
- [📖 微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

---

## 🛠️ 开发

### 安装云函数依赖

```bash
cd cloudfunctions/qwenChat
npm install
```

### 调试云函数

1. 微信开发者工具 → 云开发控制台
2. 云函数 → qwenChat → 测试
3. 输入测试事件查看日志

### 切换模型

优先使用 `config.local.js`（本地）或云函数环境变量：
```javascript
MODEL: 'qwen-turbo'   // 快速、便宜
MODEL: 'qwen-plus'    // 平衡
MODEL: 'qwen-max'     // 最强、适合难题
MODEL: 'qwen-math'    // 数学优化（推荐）
```

---

## 🔐 安全建议

1. **不要提交 API Key 到 Git** — `config.local.js` 已加入 `.gitignore`
2. **云函数权限** — 设置仅小程序可调用
3. **内容审核** — 可接入阿里云内容安全 API
4. **限流** — 添加调用频率限制
5. **密钥泄漏处理** — 若示例/历史文件中出现过真实 `sk-...`，请立即作废并重新生成

---

## 📝 更新日志

### v1.2.0 (2026-03-29)
- ✅ 新增语音输入（录音转文字）
- ✅ 新增练习题页面与学习记录页面
- ✅ system prompt 独立为可提交文件，密钥改为环境变量/本地私有配置读取
- ✅ 知识点学习支持自动讲解

### v1.1.0 (2026-03-14)
- ✅ 接入通义千问 AI
- ✅ 云函数部署
- ✅ 温柔语气优化
- ✅ 对话历史保存
- ✅ 快捷问题标签
- ✅ 复制答案功能

### v1.0.0 (之前版本)
- 基础聊天功能
- 本地模拟回复
- 知识点列表

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

_用 AI 让数学学习更温暖~_ 💕
