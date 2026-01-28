const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    const { messages } = JSON.parse(event.body);
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是NeuraServe的专业AI客服助手，专门帮助企业了解和使用NeuraServe AI交互中枢产品。`
          },
          ...messages
        ],
        max_tokens: 2000,
        temperature: 0.7,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
    
  } catch (error) {
    console.error('DeepSeek API Error:', error.message);
    
    let errorMessage = 'AI服务暂时不可用，请稍后再试';
    if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时，请稍后重试';
    } else if (error.response?.status === 401) {
      errorMessage = 'API密钥错误，请联系管理员';
    } else if (error.response?.status === 429) {
      errorMessage = '请求过于频繁，请稍后再试';
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
