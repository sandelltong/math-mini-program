const systemPrompt = require('./systemPrompt')

let local = {}
try {
  local = require('./config.local')
} catch (e) {}

module.exports = {
  DASHSCOPE_API_KEY: local.DASHSCOPE_API_KEY || process.env.DASHSCOPE_API_KEY || '',
  MODEL: local.MODEL || process.env.QWEN_MODEL || 'qwen-math',
  SYSTEM_PROMPT: local.SYSTEM_PROMPT || systemPrompt
}
