// pages/history/history.js
const app = getApp()

Page({
  data: {
    historyItems: [],
    historyCount: 0,
    lastStudyDate: ''
  },

  onShow() {
    this.loadHistory()
  },

  loadHistory() {
    const history = wx.getStorageSync('chatHistory') || []
    
    // 处理历史数据
    const processedHistory = history.map(item => {
      const date = new Date(item.timestamp)
      const displayTime = `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      return {
        ...item,
        displayTime
      }
    }).reverse() // 最新的在前面

    this.setData({
      historyItems: processedHistory,
      historyCount: history.length,
      lastStudyDate: history.length > 0 ? processedHistory[0].displayTime.split(' ')[0] : ''
    })
  },

  viewDetail(e) {
    const item = e.currentTarget.dataset.item
    // 可以在这里跳转到详情页，或者直接跳转回聊天页并加载特定记录
    wx.showToast({
      title: '正在加载详情...',
      icon: 'none'
    })
    // 暂时不做详情跳转，或者可以跳转到 chat 并传参
  }
})