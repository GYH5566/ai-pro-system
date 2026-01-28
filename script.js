// AI预设回复
const AI_RESPONSES = {
  '你好': '您好！我是NeuraServe AI助手，很高兴为您服务！',
  '价格': '我们提供基础版¥9,800/年、专业版¥29,800/年、企业定制版和7天试用版¥500。',
  '功能': '核心功能：多层感知架构、向量知识库、微服务架构、企业级安全。',
  '联系': '📧 1850859427@qq.com 📱 微信Jr_gyh ☎️ 139-5203-6081',
  '试用': '提供7天深度试用版，¥500，可抵扣正式版费用。'
};

// 修改sendAiMessage函数（大约在80行左右）
async function sendAiMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // 显示用户消息
  const userMsg = document.createElement('div');
  userMsg.className = 'ai-message ai-message-right';
  userMsg.innerHTML = `<strong>您：</strong> ${text}`;
  messageArea.appendChild(userMsg);
  userInput.value = '';
  
  // 显示"思考中"
  const thinkingMsg = document.createElement('div');
  thinkingMsg.className = 'ai-message ai-message-left';
  thinkingMsg.innerHTML = `<strong>AI助手：</strong> <i class="fas fa-spinner fa-spin"></i> 思考中...`;
  messageArea.appendChild(thinkingMsg);
  messageArea.scrollTop = messageArea.scrollHeight;
  
  // 模拟AI思考后回复
  setTimeout(() => {
    thinkingMsg.remove();
    
    // 查找预设回复
    let reply = '感谢咨询！请通过页面下方联系方式获取详细方案。';
    
    for (const [key, value] of Object.entries(AI_RESPONSES)) {
      if (text.includes(key)) {
        reply = value;
        break;
      }
    }
    
    const aiMsg = document.createElement('div');
    aiMsg.className = 'ai-message ai-message-left';
    aiMsg.innerHTML = `<strong>AI助手：</strong> ${reply}`;
    messageArea.appendChild(aiMsg);
    
    messageArea.scrollTop = messageArea.scrollHeight;
  }, 800);
}
