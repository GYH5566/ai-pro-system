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

    // 添加超时配置
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8秒超时

    try {
      const response = await axios.post(
        'https://api.deepseek.com/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `【指令】NeuraServe AI客服。回复要求：
1. 简洁直接，不超过150字
2. 不说客套话，只讲关键信息
3. 结构：要点+行动建议
4. 语气：专业、高效、务实

【产品信息】
• 名称：NeuraServe AI交互中枢
• 核心：企业级AI客服解决方案
• 性能：99.2%准确率，<200ms响应
• 价格：基础¥9800/年，专业¥29800/年（推荐），定制方案，试用¥500/7天
• 联系：1850859427@qq.com（微信Jr_gyh），139-5203-6081

【回复示例】
用户：价格？
AI：¥9800/年起，推荐专业版¥29800。具体根据需求定。发邮件获取报价。

用户：试用？
AI：¥500/7天试用专业版，可抵扣正式费用。发需求到1850859427@qq.com。

用户：技术？
AI：多层感知+向量知识库+微服务架构。支持50+行业，24/7稳定。`
            },
            ...messages
          ],
          max_tokens: 300,  // 大幅减少输出长度！
          temperature: 0.6, // 降低随机性，更稳定
          presence_penalty: -0.5, // 减少重复内容
          frequency_penalty: 0.3, // 避免啰嗦
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 8000,
          signal: controller.signal
        }
      );

      clearTimeout(timeout);

      return {
        statusCode: 200,
        body: JSON.stringify(response.data),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      };
      
    } catch (axiosError) {
      clearTimeout(timeout);
      throw axiosError;
    }
    
  } catch (error) {
    console.error('API Error:', error.message);
    
    let errorMessage = '服务繁忙，请稍后';
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: errorMessage
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
