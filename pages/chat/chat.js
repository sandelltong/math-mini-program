// pages/chat/chat.js
const app = getApp()

Page({
  data: {
    messages: [],
    inputValue: '',
    isThinking: false,
    isRecording: false,
    scrollToView: '',
    chatType: 'chat',
    currentTopic: '',
    quickQuestions: [
      '什么是函数？',
      '三角函数公式',
      '等差数列求和',
      '导数是什么？',
      '立体几何体积',
      '概率怎么算？'
    ]
  },

  onLoad(options) {
    // 初始化录音管理器
    this.recorderManager = wx.getRecorderManager()
    this.setupRecorder()

    // 处理页面参数
    const { type = 'chat', topic = '' } = options
    this.setData({ chatType: type, currentTopic: topic })

    // 初始化欢迎消息
    let welcomeContent = '你好呀！我是你的数学小助手小 Q~ 有什么数学问题都可以问我意哦！不管是函数、几何还是概率统计，我都会耐心地帮你解答的！(◍•ᴗ•◍)'
    
    if (type === 'practice' && topic) {
      welcomeContent = `嘿！让我们开始关于【${topic}】的练习吧~ 准备好了吗？(◍•ᴗ•◍) 我先给你出一道基础题试试看？`
    } else if (topic) {
      welcomeContent = `你好呀！关于【${topic}】这个知识点，你有什么特别想了解的吗？我们可以一起探讨概念，也可以看例题哦~ ✨`
    }

    const welcomeMsg = {
      id: Date.now(),
      type: 'assistant',
      content: welcomeContent,
      time: this.formatTime(new Date())
    }
    this.setData({ messages: [welcomeMsg] })
    
    // 如果是练习或特定知识点，自动触发一次 AI
    if (topic) {
      const prompt = type === 'practice' ? `请出一道关于${topic}的数学练习题` : `请讲解一下${topic}这个知识点的核心概念`
      this.setData({ isThinking: true })
      this.callAIChat(prompt, true) // true 表示自动生成的静默请求
    } else {
      // 只有自由提问才加载历史对话
      this.loadHistory()
    }
  },

  // 设置录音监听器
  setupRecorder() {
    this.recorderManager.onStart(() => {
      console.log('录音开始')
      wx.vibrateShort()
    })

    this.recorderManager.onStop((res) => {
      console.log('录音结束', res)
      const { tempFilePath } = res
      this.setData({ isRecording: false })
      
      // 开始转换语音
      this.translateVoice(tempFilePath)
    })

    this.recorderManager.onError((err) => {
      console.error('录音失败', err)
      this.setData({ isRecording: false })
      wx.showToast({
        title: '录音失败，请重试',
        icon: 'none'
      })
    })
  },

  // 开始录音
  startRecording() {
    const options = {
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'aac',
      frameSize: 50
    }
    this.setData({ isRecording: true })
    this.recorderManager.start(options)
  },

  // 停止录音
  stopRecording() {
    this.recorderManager.stop()
  },

  // 转换语音为文字
  translateVoice(filePath) {
    wx.showLoading({ title: '听取中...' })
    
    // 使用微信原生语音识别
    wx.translateVoice({
      filePath: filePath,
      isShowProgressTips: false,
      success: (res) => {
        console.log('转换成功:', res.result)
        if (res.result) {
          this.setData({ inputValue: res.result })
          // 自动发送
          this.sendMessage()
        } else {
          wx.showToast({
            title: '没听清哦，再试一次吧~',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.error('转换失败:', err)
        wx.showToast({
          title: '识别失败，请重试',
          icon: 'none'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  // 格式化时间
  formatTime(date) {
    const h = date.getHours().toString().padStart(2, '0')
    const m = date.getMinutes().toString().padStart(2, '0')
    return `${h}:${m}`
  },

  // 输入框变化
  onInput(e) {
    this.setData({ inputValue: e.detail.value })
  },

  // 调用 AI 云函数
  async callAIChat(question, isSilent = false) {
    // 如果是静默请求，不需要更新 messages 列表
    if (!isSilent) {
      this.setData({ isThinking: true })
    }

    return new Promise((resolve, reject) => {
      // 构建对话历史（转换为 API 格式）
      const conversationHistory = this.data.messages
        .filter(msg => msg.type === 'user' || msg.type === 'assistant')
        .slice(-10) // 保留最近 10 条
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))

      // 调用云函数
      wx.cloud.callFunction({
        name: app.globalData.aiConfig.cloudFunctionName,
        data: {
          question: question,
          conversationHistory: conversationHistory,
          type: this.data.chatType || 'chat',
          topic: this.data.currentTopic || ''
        },
        timeout: app.globalData.aiConfig.timeout,
        success: (res) => {
          console.log('云函数调用成功:', res.result)
          
          if (res.result.success) {
            const assistantMsg = {
              id: Date.now(),
              type: 'assistant',
              content: res.result.answer,
              time: this.formatTime(new Date()),
              model: res.result.model
            }

            this.setData({
              messages: [...this.data.messages, assistantMsg],
              isThinking: false,
              scrollToView: `msg-${assistantMsg.id}`
            })

            // 只有普通提问才保存到历史记录
            if (this.data.chatType === 'chat') {
              // 这里的 saveToHistory 需要两个参数，稍微调整逻辑
              const userMsg = isSilent ? { content: question } : this.data.messages[this.data.messages.length - 2]
              this.saveToHistory(userMsg, assistantMsg)
            }
            
            resolve(res.result)
          } else {
            this.handleError(res.result.error || 'AI 服务暂时不可用')
            reject(new Error(res.result.error || 'AI 服务暂时不可用'))
          }
        },
        fail: (err) => {
          console.error('云函数调用失败:', err)
          this.handleError('网络开小差了，请重试吧~')
          reject(err)
        }
      })
    })
  },

  // 统一错误处理
  handleError(msg) {
    const errorMsg = {
      id: Date.now(),
      type: 'system',
      content: msg,
      time: this.formatTime(new Date())
    }
    this.setData({
      messages: [...this.data.messages, errorMsg],
      isThinking: false,
      scrollToView: `msg-${errorMsg.id}`
    })
  },

  // 发送消息
  async sendMessage() {
    const content = this.data.inputValue.trim()
    if (!content) return

    // 添加用户消息
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: content,
      time: this.formatTime(new Date())
    }

    this.setData({
      messages: [...this.data.messages, userMsg],
      inputValue: '',
      isThinking: true,
      scrollToView: `msg-${userMsg.id}`
    })

    try {
      await this.callAIChat(content, true) // 这里传 true 是因为已经在 setData 中处理了状态
    } catch (error) {
      console.error('发送失败:', error)
    }
  },

  // 发送快捷问题
  sendQuickQuestion(e) {
    const question = e.currentTarget.dataset.question
    this.setData({ inputValue: question })
    this.sendMessage()
  },

  // 清空对话历史
  clearHistory() {
    wx.showModal({
      title: '清空对话',
      content: '确定要清空所有对话记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('chatHistory')
          // 重置为欢迎消息
          const welcomeMsg = {
            id: Date.now(),
            type: 'assistant',
            content: '对话已清空~ 有什么新的数学问题想问我吗？(◍•ᴗ•◍)',
            time: this.formatTime(new Date())
          }
          this.setData({ messages: [welcomeMsg] })
          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        }
      }
    })
  },

  // 加载历史对话
  loadHistory() {
    const history = wx.getStorageSync('chatHistory') || []
    if (history.length > 0) {
      // 加载最近一次会话
      const lastSession = history[history.length - 1]
      const messages = [
        {
          id: Date.now(),
          type: 'system',
          content: '—— 以上是之前的对话 ——',
          time: this.formatTime(new Date())
        },
        lastSession.userMsg,
        lastSession.assistantMsg
      ]
      this.setData({ messages })
    }
  },

  // 保存到历史记录
  saveToHistory(userMsg, assistantMsg) {
    const history = wx.getStorageSync('chatHistory') || []
    history.push({
      userMsg,
      assistantMsg,
      timestamp: Date.now()
    })
    
    // 只保留最近 50 条记录
    if (history.length > 50) {
      history.shift()
    }
    
    wx.setStorageSync('chatHistory', history)
  },

  // 复制答案
  copyAnswer(e) {
    const content = e.currentTarget.dataset.content
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        })
      }
    })
  }
})
