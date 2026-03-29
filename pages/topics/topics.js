// pages/topics/topics.js
const app = getApp()

Page({
  data: {
    currentGrade: '全部',
    grades: ['全部', '高一', '高二', '高三'],
    topicIcons: ['🔢', '📐', '📊', '∫', '∑', 'π', '√', '∞'],
    topics: [],
    filteredTopics: []
  },

  onLoad() {
    this.setData({ 
      topics: app.globalData.mathTopics,
      filteredTopics: app.globalData.mathTopics
    })
  },

  // 选择年级
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

  // 跳转到知识点详情
  goToTopicDetail(e) {
    const topic = e.currentTarget.dataset.topic
    wx.navigateTo({
      url: `/pages/chat/chat?topic=${encodeURIComponent(topic.name)}`
    })
  }
})
