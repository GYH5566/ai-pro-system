// ============= 页面控制逻辑 =============
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    // 修复移动端100vh问题
    function fixMobileHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    fixMobileHeight();
    window.addEventListener('resize', fixMobileHeight);
    window.addEventListener('orientationchange', fixMobileHeight);
    
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) event.preventDefault();
        lastTouchEnd = now;
    }, false);
    
    // 页面元素
    const pagesWrapper = document.getElementById('pagesWrapper');
    const indicators = document.querySelectorAll('.indicator-dot');
    const scrollHint = document.getElementById('scrollHint');
    const pages = document.querySelectorAll('.page');
    const totalPages = pages.length;
    
    let currentPage = 0;
    let isAnimating = false;
    let touchStartY = 0;
    
    // 更新页面显示
    function updatePage() {
        const translateY = -currentPage * 100;
        pagesWrapper.style.transform = `translateY(${translateY}vh)`;
        
        pages.forEach((page, index) => {
            index === currentPage ? page.classList.add('active') : page.classList.remove('active');
        });
        
        indicators.forEach((dot, index) => {
            index === currentPage ? dot.classList.add('active') : dot.classList.remove('active');
        });
        
        scrollHint.style.opacity = currentPage === 0 ? '1' : '0';
        scrollHint.style.pointerEvents = currentPage === 0 ? 'auto' : 'none';
    }
    
    // 切换到指定页面
    function goToPage(pageIndex) {
        if (isAnimating || pageIndex < 0 || pageIndex >= totalPages || pageIndex === currentPage) return;
        currentPage = pageIndex;
        isAnimating = true;
        updatePage();
        setTimeout(() => { isAnimating = false; }, 800);
    }
    
    // 鼠标滚轮事件
    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (isAnimating) return;
        if (e.deltaY > 0 && currentPage < totalPages - 1) goToPage(currentPage + 1);
        else if (e.deltaY < 0 && currentPage > 0) goToPage(currentPage - 1);
    }, { passive: false });
    
    // 触摸滑动事件
    window.addEventListener('touchstart', function(e) { touchStartY = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchend', function(e) {
        if (isAnimating) return;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        if (Math.abs(deltaY) > 255) {
            if (deltaY > 0 && currentPage < totalPages - 1) goToPage(currentPage + 1);
            else if (deltaY < 0 && currentPage > 0) goToPage(currentPage - 1);
        }
    }, { passive: false });
    
    // 指示器点击事件
    indicators.forEach((dot, index) => { dot.addEventListener('click', () => goToPage(index)); });
    
    // 键盘导航
    window.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' && currentPage < totalPages - 1) goToPage(currentPage + 1);
        else if (e.key === 'ArrowUp' && currentPage > 0) goToPage(currentPage - 1);
    });
    
    // 禁止页面滚动
    window.addEventListener('scroll', () => window.scrollTo(0, 0));
    
    // 初始化
    updatePage();
    
    // 添加卡片悬停效果
    setTimeout(() => {
        document.querySelectorAll('.card-item').forEach(card => card.classList.add('enhanced-card'));
    }, 100);
    
    // AI聊天模块初始化
    initAIChatModule();
    console.log('页面初始化完成！');
});

// ============= AI聊天模块（DeepSeek API版本）=============
function initAIChatModule() {
    const button = document.getElementById('floatingAiButton');
    const windowEl = document.getElementById('floatingAiWindow');
    const closeBtn = document.getElementById('closeAiWindow');
    const messageArea = document.getElementById('aiMessageArea');
    const userInput = document.getElementById('aiUserInput');
    const sendButton = document.getElementById('aiSendButton');
    
    let isAiWindowOpen = false;
    let conversationHistory = [];
    
    // 系统提示词（业务顾问"赵经理"版本）
    const SYSTEM_PROMPT = {
        role: 'system',
        content: `# 角色：NeuraServe资深业务顾问（赵经理）
# 风格：专业、务实、有人情味、对话式

## 【我的定位】
我是你的业务顾问，不是机器人。我的目标不是推销，而是帮你找到最适合的方案。

## 【核心理念】
1. **AI不是替代人**，而是帮人做得更好。
2. **关键数据**：通常AI能处理70-80%的重复咨询，但复杂/情感化问题仍需人工。
3. **最佳模式**：AI处理常见问题 → 人工专注高价值沟通。
4. **真实价值**：不是裁员，而是让现有团队效率提升3-5倍。

## 【产品信息】
- 我们叫NeuraServe，做企业AI客服方案。
- 准确率行业领先（99.2%），响应<200ms。
- 价格透明：基础版¥9800/年，专业版¥29800/年（最受欢迎），定制方案看需求。
- 可以¥500试用7天，满意再升级。

## 【联系方式】
- 邮箱：1850859427@qq.com
- 微信：Jr_gyh（加我发案例资料）
- 电话：139-5203-6081（工作时间接）

## 【对话风格】
用自然对话方式，先理解客户具体需求，再给出个性化建议。不要一次性列出所有信息，而是根据客户问题逐步提供。`
    };
    
    // 加载对话历史
    function loadConversation() {
        try {
            const saved = localStorage.getItem('ai_conversation');
            if (saved) {
                const parsed = JSON.parse(saved);
                // 确保系统提示词在第一位
                conversationHistory = [SYSTEM_PROMPT];
                // 只保留最近的用户和助手消息
                const recentMessages = parsed.filter(msg => 
                    msg.role === 'user' || msg.role === 'assistant'
                ).slice(-10);
                conversationHistory.push(...recentMessages);
            } else {
                conversationHistory = [SYSTEM_PROMPT];
            }
        } catch (e) {
            console.error('加载对话历史失败:', e);
            conversationHistory = [SYSTEM_PROMPT];
        }
        displayHistoryMessages();
    }
    
    // 显示历史消息
    function displayHistoryMessages() {
        messageArea.innerHTML = '';
        const displayMessages = conversationHistory.filter(msg => 
            msg.role === 'user' || msg.role === 'assistant'
        ).slice(-5);
        
        displayMessages.forEach(msg => {
            const msgElement = document.createElement('div');
            if (msg.role === 'user') {
                msgElement.className = 'ai-message ai-message-right';
                msgElement.innerHTML = `<strong>您：</strong> ${msg.content}`;
            } else {
                msgElement.className = 'ai-message ai-message-left';
                msgElement.innerHTML = `<strong>AI助手：</strong> ${msg.content}`;
            }
            messageArea.appendChild(msgElement);
        });
        
        setTimeout(() => { 
            messageArea.scrollTop = messageArea.scrollHeight; 
        }, 100);
    }
    
    // 保存对话历史
    function saveConversation() {
        try {
            // 只保存最近的15条消息（包括系统提示词）
            const toSave = conversationHistory.slice(-15);
            localStorage.setItem('ai_conversation', JSON.stringify(toSave));
        } catch (e) { 
            console.error('保存对话历史失败:', e); 
        }
    }
    
    // 首次打开聊天窗口显示欢迎语
    function showWelcomeMessage() {
        if (!localStorage.getItem('ai_welcome_shown')) {
            setTimeout(() => {
                const welcomeMsg = document.createElement('div');
                welcomeMsg.className = 'ai-message ai-message-left';
                welcomeMsg.innerHTML = `<strong>AI助手：</strong> 您好！我是NeuraServe的业务顾问赵经理，可以帮您分析AI客服方案，优化团队效率。有什么我可以帮您的？`;
                messageArea.appendChild(welcomeMsg);
                
                conversationHistory.push({ 
                    role: 'assistant', 
                    content: '您好！我是NeuraServe的业务顾问赵经理，可以帮您分析AI客服方案，优化团队效率。有什么我可以帮您的？' 
                });
                saveConversation();
                localStorage.setItem('ai_welcome_shown', 'true');
            }, 500);
        }
    }
    
    // 打开/关闭聊天窗口
    function toggleAiWindow() {
        isAiWindowOpen = !isAiWindowOpen;
        windowEl.style.display = isAiWindowOpen ? 'flex' : 'none';
        if (isAiWindowOpen) {
            setTimeout(() => {
                userInput.focus();
                messageArea.scrollTop = messageArea.scrollHeight;
            }, 100);
        }
    }
    
    // 初始化
    loadConversation();
    showWelcomeMessage();
    
    // 绑定窗口开关事件
    button.addEventListener('click', function(e) { 
        e.stopPropagation(); 
        toggleAiWindow(); 
    });
    closeBtn.addEventListener('click', toggleAiWindow);
    
    // 绑定发送事件
    sendButton.addEventListener('click', sendAiMessage);
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) { 
            e.preventDefault(); 
            sendAiMessage(); 
        }
    });
    
    // 发送消息到DeepSeek API
    async function sendAiMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // 显示用户消息
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message ai-message-right';
        userMsg.innerHTML = `<strong>您：</strong> ${text}`;
        messageArea.appendChild(userMsg);
        
        // 添加到对话历史
        conversationHistory.push({ 
            role: 'user', 
            content: text 
        });
        
        // 清空输入框
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // 显示"思考中"提示
        const thinkingMsg = document.createElement('div');
        thinkingMsg.className = 'ai-message ai-message-left';
        thinkingMsg.innerHTML = `<strong>AI助手：</strong> <i class="fas fa-spinner fa-spin"></i> 正在思考...`;
        messageArea.appendChild(thinkingMsg);
        messageArea.scrollTop = messageArea.scrollHeight;
        
        try {
            // 准备发送的消息（系统提示词 + 最近8条对话）
            const messagesToSend = conversationHistory.slice(-9); // 系统提示词 + 最近8条
            
            console.log('发送到API的消息:', messagesToSend);
            
            // 调用Netlify Function
            const response = await fetch('/.netlify/functions/deepseek-chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    messages: messagesToSend 
                }),
                signal: AbortSignal.timeout(25000) // 25秒超时
            });
            
            // 移除思考消息
            thinkingMsg.remove();
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API返回错误:', errorData);
                throw new Error(errorData.error || `请求失败: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API返回数据:', data);
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('API返回数据格式错误');
            }
            
            const aiResponse = data.choices[0].message.content;
            
            // 显示AI回复
            const aiMsg = document.createElement('div');
            aiMsg.className = 'ai-message ai-message-left';
            aiMsg.innerHTML = `<strong>AI助手：</strong> ${aiResponse}`;
            messageArea.appendChild(aiMsg);
            
            // 添加到对话历史
            conversationHistory.push({ 
                role: 'assistant', 
                content: aiResponse 
            });
            
            // 保存对话历史
            saveConversation();
            
        } catch (error) {
            console.error('AI请求错误:', error);
            thinkingMsg.remove();
            
            const errorMsg = document.createElement('div');
            errorMsg.className = 'ai-message ai-message-left';
            
            if (error.name === 'AbortError' || error.message.includes('timeout')) {
                errorMsg.innerHTML = `<strong>AI助手：</strong> 思考超时，您的问题可能比较复杂。请简化问题或直接添加微信 Jr_gyh 详聊。`;
            } else if (error.message.includes('API密钥') || error.message.includes('401')) {
                errorMsg.innerHTML = `<strong>AI助手：</strong> 服务配置错误，请联系管理员。`;
            } else {
                errorMsg.innerHTML = `<strong>AI助手：</strong> 服务暂时繁忙，请稍后再试。紧急问题可联系邮箱 1850859427@qq.com`;
            }
            
            messageArea.appendChild(errorMsg);
            
            // 添加到对话历史
            conversationHistory.push({ 
                role: 'assistant', 
                content: '抱歉，服务暂时不可用。请稍后再试或直接联系我们。' 
            });
            saveConversation();
        }
        
        messageArea.scrollTop = messageArea.scrollHeight;
    }
    
    // 输入框自动增高
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
    
    // 添加预设问题
    addPresetQuestions();
}

// 添加预设问题按钮（业务顾问风格）
function addPresetQuestions() {
    const presetQuestions = [
        "我有15个客服，能省多少钱？",
        "人机协作的具体方案？",
        "真实能提升多少效率？",
        "实施周期要多久？",
        "有没有我们行业的案例？",
        "AI会不会很死板？",
        "如何开始试用？",
        "和赵经理详细聊聊？"
    ];
    
    const inputArea = document.querySelector('.ai-input-area');
    if (!inputArea) return;
    
    // 创建容器
    const presetContainer = document.createElement('div');
    presetContainer.className = 'preset-questions';
    presetContainer.style.marginBottom = '10px';
    presetContainer.style.display = 'flex';
    presetContainer.style.flexWrap = 'wrap';
    presetContainer.style.gap = '8px';
    presetContainer.style.justifyContent = 'center';
    
    // 添加标题
    const title = document.createElement('div');
    title.textContent = '快捷提问：';
    title.style.fontSize = '0.8rem';
    title.style.color = '#94a3b8';
    title.style.width = '100%';
    title.style.textAlign = 'center';
    title.style.marginBottom = '5px';
    presetContainer.appendChild(title);
    
    // 添加按钮
    presetQuestions.forEach(question => {
        const btn = document.createElement('button');
        btn.textContent = question;
        btn.style.padding = '6px 12px';
        btn.style.background = 'rgba(58, 134, 255, 0.1)';
        btn.style.border = '1px solid rgba(58, 134, 255, 0.3)';
        btn.style.borderRadius = '6px';
        btn.style.color = '#94a3b8';
        btn.style.fontSize = '0.8rem';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.2s ease';
        
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(58, 134, 255, 0.2)';
            btn.style.color = '#f1f5f9';
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(58, 134, 255, 0.1)';
            btn.style.color = '#94a3b8';
            btn.style.transform = 'translateY(0)';
        });
        
        btn.addEventListener('click', () => {
            document.getElementById('aiUserInput').value = question;
            document.getElementById('aiUserInput').focus();
            setTimeout(() => { 
                document.getElementById('aiSendButton').click(); 
            }, 100);
        });
        
        presetContainer.appendChild(btn);
    });
    
    // 插入到输入区域上方
    inputArea.parentNode.insertBefore(presetContainer, inputArea);
}

// 页面加载完成提示
window.addEventListener('load', function() {
    console.log('✅ NeuraServe AI网站加载完成！');
    console.log('✅ AI聊天：业务顾问"赵经理"模式已激活');
});
