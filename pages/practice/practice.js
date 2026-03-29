// pages/practice/practice.js
const app = getApp()

Page({
  data: {
    currentGrade: '全部',
    grades: ['全部', '高一', '高二', '高三'],
    topicIcons: ['📝', '🧪', '📐', '🔢', '📉', '📈'],
    topics: [],
    filteredTopics: []
  },

  onLoad() {
    this.setData({ 
      topics: app.globalData.mathTopics,
      filteredTopics: app.globalData.mathTopics
    })
  },

  selectGrade(e) {
    const grade = e.currentTarget.dataset.grade
    const { topics } = this.data
    
    let filteredTopics = topics
    if (grade !== '全部') {
      filteredTopics = topics.filter(t => t.grade === grade)
    }

    this.setData({ 
      currentGrade: grade,
      filteredTopics
    })
  },

  startPractice(e) {
    const topic = e.currentTarget.dataset.topic
    wx.navigateTo({
      url: `/pages/chat/chat?type=practice&topic=${encodeURIComponent(topic.name)}`
    })
  }
})