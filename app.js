// app.js
App({
  onLaunch() {
    console.log('数学小助手启动啦~')
    
    // 初始化云开发环境
    if (this.globalData.cloudEnvId) {
      wx.cloud.init({
        env: this.globalData.cloudEnvId,
        traceUser: true
      })
      console.log('云开发环境已初始化:', this.globalData.cloudEnvId)
    } else {
      console.warn('未配置云环境 ID，请在 app.js 中设置 cloudEnvId')
    }
    
    // 初始化本地存储
    if (!wx.getStorageSync('chatHistory')) {
      wx.setStorageSync('chatHistory', [])
    }
  },

  globalData: {
    // ==================== 云开发配置 ====================
    // ⚠️ 替换为你的云环境 ID（在微信开发者工具 → 云开发控制台查看）
    cloudEnvId: 'cloud1-9g0wp3q37e8f4df9',
    
    // ==================== 温柔的语气配置 ====================
    toneConfig: {
      greeting: ['你好呀~', '小朋友好！', '欢迎来到数学乐园~', '嗨，今天想学什么呢？'],
      encouragement: ['你真棒！', '这个思路很好哦~', '继续加油！', '我相信你可以的！'],
      comfort: ['没关系，我们慢慢来~', '这道题确实有点难，一起看看', '别着急，老师陪你一起思考']
    },
    
    // ==================== 高中数学知识点 ====================
    mathTopics: [
      { id: 1, name: '集合与函数', grade: '高一' },
      { id: 2, name: '三角函数', grade: '高一' },
      { id: 3, name: '数列', grade: '高二' },
      { id: 4, name: '不等式', grade: '高一' },
      { id: 5, name: '立体几何', grade: '高二' },
      { id: 6, name: '解析几何', grade: '高二' },
      { id: 7, name: '概率统计', grade: '高三' },
      { id: 8, name: '导数与应用', grade: '高三' }
    ],
    
    // ==================== AI 配置 ====================
    aiConfig: {
      // 云函数名称（与 cloudfunctions 目录名一致）
      cloudFunctionName: 'qwenChat',
      
      // 默认模型（与云函数 config.js 中的一致）
      defaultModel: 'qwen-turbo',
      
      // 请求超时时间（毫秒）
      timeout: 30000
    }
  }
})
