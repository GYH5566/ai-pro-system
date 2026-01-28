export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { message } = req.body;
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ reply: 'API密钥未配置' });
    }
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
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
        reply: 'AI服务暂时不可用' 
      });
    }
    
  } catch (error) {
    return res.status(500).json({ 
      reply: '服务器错误',
      error: error.message 
    });
  }
}
