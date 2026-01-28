const axios = require('axios');

exports.handler = async function(event, context) {
  // 处理预检请求（OPTIONS）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }

  // 只处理POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('收到AI聊天请求');
    
    const { messages } = JSON.parse(event.body || '{}');
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.error('❌ API密钥未配置');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: '服务器配置错误，请联系管理员',
          details: 'DEEPSEEK_API_KEY环境变量未设置'
        })
      };
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: '请求参数错误',
          details: 'messages参数为空或格式错误'
        })
      };
    }

    console.log('开始调用DeepSeek API，消息数量:', messages.length);
    console.log('最后一条消息内容:', messages[messages.length - 1]?.content?.substring(0, 50) + '...');

    // 调用DeepSeek API
    const response = await axios({
      method: 'POST',
      url: 'https://api.deepseek.com/chat/completions',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        model: 'deepseek-chat',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7,
        stream: false
      },
      timeout: 30000  // 30秒超时
    });

    console.log('✅ DeepSeek API调用成功，返回数据:', {
      hasChoices: !!response.data?.choices,
      choiceCount: response.data?.choices?.length || 0
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response.data)
    };
    
  } catch (error) {
    console.error('❌ DeepSeek API错误:');
    console.error('错误消息:', error.message);
    console.error('错误代码:', error.code);
    console.error('状态码:', error.response?.status);
    
    let userMessage = 'AI服务暂时繁忙，请稍后再试';
    let statusCode = 500;
    
    if (error.code === 'ECONNABORTED') {
      userMessage = '请求超时，请简化问题或稍后重试';
      statusCode = 408;
    } else if (error.response?.status === 401) {
      userMessage = 'API密钥错误，请联系管理员';
      statusCode = 401;
    } else if (error.response?.status === 429) {
      userMessage = '请求过于频繁，请稍后再试';
      statusCode = 429;
    } else if (error.response?.status === 400) {
      userMessage = '请求参数错误，请稍后重试';
      statusCode = 400;
    }

    return {
      statusCode: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: userMessage,
        details: error.message,
        status: error.response?.status
      })
    };
  }
};
