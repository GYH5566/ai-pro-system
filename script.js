// 纯前端AI聊天 - 立即能用
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
    
    // 模拟AI思考
    setTimeout(() => {
        thinkingMsg.remove();
        
        // 本地回复
        let reply = "感谢咨询！NeuraServe提供企业级AI解决方案。请通过下方联系方式获取详细方案。";
        
        if (text.includes("你好") || text.includes("hi") || text.includes("hello")) {
            reply = "您好！我是NeuraServe AI助手，很高兴为您服务！🚀";
        } else if (text.includes("价格") || text.includes("多少钱") || text.includes("收费")) {
            reply = "💰 定价方案：<br>• 基础版：¥9,800/年<br>• 专业版：¥29,800/年（推荐）<br>• 企业版：定制<br>• 试用版：¥500/7天";
        } else if (text.includes("功能") || text.includes("特点") || text.includes("优势")) {
            reply = "🚀 核心功能：<br>• 99.2%意图识别准确率<br>• 24/7毫秒级响应<br>• 支持50+行业知识库<br>• 快速部署，4周上线";
        } else if (text.includes("联系") || text.includes("微信") || text.includes("电话") || text.includes("邮箱")) {
            reply = "📞 联系方式：<br>📧 1850859427@qq.com<br>📱 微信：Jr_gyh<br>☎️ 电话：139-5203-6081";
        } else if (text.includes("试用") || text.includes("demo") || text.includes("测试")) {
            reply = "🎯 7天深度试用：<br>• 仅需¥500<br>• 体验完整专业版功能<br>• 可抵扣正式版费用<br>• 快速申请";
        }
        
        const aiMsg = document.createElement('div');
        aiMsg.className = 'ai-message ai-message-left';
        aiMsg.innerHTML = `<strong>AI助手：</strong> ${reply}`;
        messageArea.appendChild(aiMsg);
        
        messageArea.scrollTop = messageArea.scrollHeight;
    }, 600);
}
