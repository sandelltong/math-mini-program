# 高中数学辅导小程序 📚

> 一个温柔的 AI 数学老师，陪伴高中生学习数学

---

## ✨ 功能特点

- 🤖 **AI 智能答疑** — 接入通义千问，解答高中数学问题
- 📝 **详细解题步骤** — 不跳步，耐心讲解每一步
- 💬 **温柔语气** — 像大姐姐一样温暖的教学风格
- 📱 **微信小程序** — 随时随地，想问就问
- 💾 **对话历史** — 自动保存，方便复习
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
│       ├── config.js        # 配置（API Key 等）
│       ├── package.json     # 依赖
│       └── .gitignore       # Git 忽略文件
├── pages/
│   ├── chat/                # 聊天页面
│   │   ├── chat.js
│   │   ├── chat.wxml
│   │   ├── chat.wxss
│   │   └── chat.json
│   ├── index/               # 首页
│   └── topics/              # 知识点页面
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
   - 编辑 `cloudfunctions/qwenChat/config.js`
   - 填入你的 API Key

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
module.exports = {
  // 通义千问 API Key
  DASHSCOPE_API_KEY: 'sk-xxxxxxxx',
  
  // 模型选择
  MODEL: 'qwen-plus',  // qwen-turbo | qwen-plus | qwen-max
  
  // AI 人设
  SYSTEM_PROMPT: '...'
}
```

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

编辑 `config.js`：
```javascript
MODEL: 'qwen-turbo'   // 快速、便宜
MODEL: 'qwen-plus'    // 平衡（推荐）
MODEL: 'qwen-max'     // 最强、适合难题
```

---

## 🔐 安全建议

1. **不要提交 API Key 到 Git** — `config.js` 已加入 `.gitignore`
2. **云函数权限** — 设置仅小程序可调用
3. **内容审核** — 可接入阿里云内容安全 API
4. **限流** — 添加调用频率限制

---

## 📝 更新日志

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
