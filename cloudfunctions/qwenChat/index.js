// cloudfunctions/qwenChat/index.js
const axios = require('axios')
const config = require('./config')

/**
 * 通义千问 AI 对话云函数（修复兼容模式参数格式）
 */
exports.main = async (event, context) => {
  const { question, conversationHistory = [] } = event
  
  // 1. 基础输入验证
  if (!question || typeof question !== 'string' || question.trim() === '') {
    return {
      success: false,
      error: '请输入有效的问题'
    }
  }

  // 2. 配置校验
  if (!config.DASHSCOPE_API_KEY || !config.MODEL) {
    console.error('配置错误：缺少API Key或模型名称');
    return {
      success: false,
      error: '服务配置异常，请联系管理员',
      debugInfo: 'Missing API Key or Model config'
    }
  }

  // 3. 严格校验并构建合法的messages数组（核心修复）
  const validMessages = [];
  // 系统消息（可选，但需保证格式正确）
  if (config.SYSTEM_PROMPT && typeof config.SYSTEM_PROMPT === 'string') {
    validMessages.push({
      role: 'system',
      content: config.SYSTEM_PROMPT.trim()
    });
  }

  // 对话历史（过滤非法数据）
  for (const msg of conversationHistory.slice(-10)) {
    if (
      msg && 
      ['user', 'assistant'].includes(msg.role) && 
      msg.content && 
      typeof msg.content === 'string' && 
      msg.content.trim() !== ''
    ) {
      validMessages.push({
        role: msg.role,
        content: msg.content.trim()
      });
    }
  }

  // 当前用户问题（必须存在，且格式正确）
  validMessages.push({
    role: 'user',
    content: question.trim()
  });

  // 打印最终发送的messages，方便排查
  console.log('最终发送的messages:', JSON.stringify(validMessages, null, 2));
  console.log('调用通义千问 API，模型:', config.MODEL);
  
  try {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      // 兼容模式的核心参数（严格对齐OpenAI格式）
      {
        model: config.MODEL,          // 模型名称
        messages: validMessages,      // 必须的messages参数（非空数组）
        temperature: 0.7,             // 创造性
        max_tokens: 1000,             // 最大输出长度
        stream: false                 // 非流式
      },
      {
        headers: {
          'Authorization': `Bearer ${config.DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );
    
    const result = response.data;

    // 校验返回结果
    if (!result || !result.choices || result.choices.length === 0) {
      throw new Error('API返回结果异常，无有效回复内容');
    }

    return {
      success: true,
      answer: result.choices[0].message.content,
      model: config.MODEL,
      usage: {
        promptTokens: result.usage?.prompt_tokens || 0,
        completionTokens: result.usage?.completion_tokens || 0,
        totalTokens: result.usage?.total_tokens || 0
      },
      finishReason: result.choices[0].finish_reason,
      requestId: result.id || ''
    };
    
  } catch (error) {
    // 完善错误日志
    const statusCode = error.response?.status;
    const errorData = error.response?.data;
    const errorMsg = error.message || '未知错误';
    
    console.error('AI 调用失败:', {
      statusCode,
      errorMsg,
      errorDetails: errorData,
      requestId: errorData?.request_id || errorData?.id
    });

    // 更精准的错误提示
    let friendlyError = '哎呀，老师现在有点累，稍后再试试吧~';
    if (statusCode === 400) {
      friendlyError = '提问格式有误，请检查后重试~';
    } else if (statusCode === 401) {
      friendlyError = 'API 密钥无效，请联系管理员哦~';
    } else if (statusCode === 403) {
      friendlyError = '暂无权限使用该模型，请联系管理员检查权限配置~';
    } else if (statusCode === 429) {
      friendlyError = '问的人太多啦，请稍等一下再试~';
    } else if (error.code === 'ECONNABORTED') {
      friendlyError = '网络有点慢，再试一次吧~';
    }
    
    return {
      success: false,
      error: friendlyError,
      debugInfo: `${errorMsg} (status: ${statusCode})`,
      requestId: errorData?.request_id || errorData?.id
    };
  }
}