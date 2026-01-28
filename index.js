export default async function handler(req, res) {
  // CORS设置
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 只接受POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }
  
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: '消息不能为空' });
    }
    
    // 获取API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        reply: 'AI服务配置中，请联系管理员。',
        error: 'API密钥未设置'
      });
    }
    
    // 调用DeepSeek
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是NeuraServe AI助手，企业级AI解决方案提供商。'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 300
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({ 
        reply: data.choices[0].message.content 
      });
    } else {
      return res.status(500).json({ 
        reply: 'AI服务暂时不可用',
        error: 'API请求失败'
      });
    }
    
  } catch (error) {
    return res.status(500).json({ 
      reply: '服务器错误',
      error: error.message 
    });
  }
}
