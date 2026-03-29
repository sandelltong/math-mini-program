// pages/index/index.js
const app = getApp()

Page({
  data: {
    dailyQuote: '数学不是关于数字，而是关于理解。—— 佚名'
  },

  onLoad() {
    // 随机每日名言
    const quotes = [
      '数学不是关于数字，而是关于理解。—— 佚名',
      '数学是科学的皇后。—— 高斯',
      '每一次错误都是学习的机会哦~',
      '相信自己，你比想象中更聪明！',
      '数学就像游戏，越玩越有趣~'
    ]
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    this.setData({ dailyQuote: randomQuote })
  },

  // 跳转到聊天页面
  goToChat(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/chat/chat?type=${type || 'general'}`
    })
  },

  // 跳转到知识点页面
  goToTopics() {
    wx.navigateTo({
      url: '/pages/topics/topics'
    })
  },

  // 跳转到练习页面
  goToPractice() {
    wx.navigateTo({
      url: '/pages/practice/practice'
    })
  },

  // 跳转到历史记录
  goToHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    })
  }
})
