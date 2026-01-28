export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 只接受POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: '只支持POST请求'
    });
  }
  
  try {
    // 解析请求体
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        error: '无效请求',
        message: '消息内容不能为空'
      });
    }
    
    // 获取DeepSeek API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.error('错误: DEEPSEEK_API_KEY 环境变量未设置');
      return res.status(500).json({
        reply: 'AI服务正在配置中，请稍后重试。',
        error: 'API密钥未配置'
      });
    }
    
    console.log('收到消息:', message.substring(0, 50));
    console.log('API密钥前几位:', apiKey.substring(0, 8) + '...');
    
    // 调用DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是NeuraServe AI助手，企业级AI智能交互解决方案提供商。
            
请按照以下要求回答：
1. 专业、友好地介绍NeuraServe产品
2. 突出核心优势：99.2%准确率、24/7服务、多行业支持
3. 如果用户询问具体价格或技术细节，引导他们通过页面下方的联系方式获取定制方案
4. 保持回复简洁、有帮助

联系方式：
- 邮箱：1850859427@qq.com
- 微信：Jr_gyh
- 电话：139-5203-6081`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    console.log('DeepSeek响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API错误:', response.status, errorText);
      
      return res.status(500).json({
        reply: 'AI服务暂时不可用，请直接通过页面下方的联系方式联系我们。',
        error: `API错误: ${response.status}`,
        details: errorText.substring(0, 100)
      });
    }
    
    const data = await response.json();
    console.log('DeepSeek响应成功');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({
        reply: 'AI响应格式错误，请稍后重试。',
        error: '无效的API响应格式'
      });
    }
    
    const aiReply = data.choices[0].message.content;
    
    // 成功响应
    return res.status(200).json({
      reply: aiReply,
      success: true,
      model: data.model || 'deepseek-chat'
    });
    
  } catch (error) {
    console.error('服务器错误:', error);
    
    return res.status(500).json({
      reply: '服务器内部错误，请稍后重试或直接联系我们。',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
