// 页面控制逻辑
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    // 修复移动端100vh问题
    function fixMobileHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        console.log('修复移动端高度，vh值为:', vh);
    }
    
    // 初始化移动端高度
    fixMobileHeight();
    window.addEventListener('resize', fixMobileHeight);
    window.addEventListener('orientationchange', fixMobileHeight);
    
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // 页面元素
    const pagesWrapper = document.getElementById('pagesWrapper');
    const indicators = document.querySelectorAll('.indicator-dot');
    const scrollHint = document.getElementById('scrollHint');
    const pages = document.querySelectorAll('.page');
    const totalPages = pages.length;
    
    console.log('总页面数:', totalPages, '当前页面:', pages);
    
    let currentPage = 0;
    let isAnimating = false;
    let touchStartY = 0;
    
    // 更新页面显示
    function updatePage() {
        console.log('切换到页面:', currentPage);
        
        // 移动页面容器
        const translateY = -currentPage * 100;
        pagesWrapper.style.transform = `translateY(${translateY}vh)`;
        console.log('移动页面容器到:', translateY + 'vh');
        
        // 更新页面激活状态
        pages.forEach((page, index) => {
            if (index === currentPage) {
                page.classList.add('active');
                console.log('激活页面:', index);
            } else {
                page.classList.remove('active');
            }
        });
        
        // 更新指示器
        indicators.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 更新滚动提示
        if (currentPage === 0) {
            scrollHint.style.opacity = '1';
            scrollHint.style.pointerEvents = 'auto';
        } else {
            scrollHint.style.opacity = '0';
            scrollHint.style.pointerEvents = 'none';
        }
    }
    
    // 切换到指定页面
    function goToPage(pageIndex) {
        if (isAnimating || pageIndex < 0 || pageIndex >= totalPages || pageIndex === currentPage) return;
        
        console.log('正在切换到页面:', pageIndex);
        currentPage = pageIndex;
        isAnimating = true;
        updatePage();
        
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }
    
    // 鼠标滚轮事件
    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (isAnimating) return;
        
        if (e.deltaY > 0 && currentPage < totalPages - 1) {
            goToPage(currentPage + 1);
        } else if (e.deltaY < 0 && currentPage > 0) {
            goToPage(currentPage - 1);
        }
    }, { passive: false });
    
    // 触摸滑动事件
    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    window.addEventListener('touchend', function(e) {
        if (isAnimating) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        
        if (Math.abs(deltaY) > 255) {
            if (deltaY > 0 && currentPage < totalPages - 1) {
                goToPage(currentPage + 1);
            } else if (deltaY < 0 && currentPage > 0) {
                goToPage(currentPage - 1);
            }
        }
    }, { passive: false });
    
    // 指示器点击事件
    indicators.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToPage(index);
        });
    });
    
    // 键盘导航
    window.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' && currentPage < totalPages - 1) {
            goToPage(currentPage + 1);
        } else if (e.key === 'ArrowUp' && currentPage > 0) {
            goToPage(currentPage - 1);
        }
    });
    
    // 禁止页面滚动
    window.addEventListener('scroll', function(e) {
        window.scrollTo(0, 0);
    });
    
    // 初始化
    updatePage();
    
    // 添加卡片悬停效果
    setTimeout(() => {
        const enhancedCards = document.querySelectorAll('.card-item');
        enhancedCards.forEach(card => {
            card.classList.add('enhanced-card');
        });
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
    
    // 系统提示词（极致简洁版 - 减少废话，降低成本）
    const SYSTEM_PROMPT = {
        role: 'system',
        content: `NeuraServe AI客服助手。产品：企业级AI客服解决方案，99.2%准确率，<200ms响应，支持50+行业。价格：基础¥9800/年，专业¥29800/年（推荐），定制方案，试用¥500/7天。联系：1850859427@qq.com（微信Jr_gyh），139-5203-6081。回复要求：简洁直接，不超过150字，不说客套话，只讲关键信息，专业高效。`
    };
    
    // 加载对话历史
    function loadConversation() {
        const saved = localStorage.getItem('ai_conversation');
        if (saved) {
            try {
                conversationHistory = JSON.parse(saved);
                // 确保系统提示词在首位
                if (conversationHistory.length > 0 && conversationHistory[0].role === 'system') {
                    // 已经有系统提示词，不做处理
                } else {
                    // 重新添加系统提示词
                    conversationHistory = [SYSTEM_PROMPT, ...conversationHistory];
                }
            } catch (e) {
                console.error('加载对话历史失败:', e);
                conversationHistory = [SYSTEM_PROMPT];
            }
        } else {
            conversationHistory = [SYSTEM_PROMPT];
        }
        
        // 限制历史记录长度
        if (conversationHistory.length > 15) {
            conversationHistory = [
                SYSTEM_PROMPT,
                ...conversationHistory.slice(-14)
            ];
        }
        
        // 恢复显示历史消息（前5条）
        displayHistoryMessages();
    }
    
    // 保存对话历史
    function saveConversation() {
        try {
            // 只保存最近15条对话
            const toSave = conversationHistory.length > 15 ? 
                [SYSTEM_PROMPT, ...conversationHistory.slice(-14)] : 
                conversationHistory;
            localStorage.setItem('ai_conversation', JSON.stringify(toSave));
        } catch (e) {
            console.error('保存对话历史失败:', e);
        }
    }
    
    // 显示历史消息
    function displayHistoryMessages() {
        // 清空消息区域
        messageArea.innerHTML = '';
        
        // 只显示用户和AI的对话（跳过系统提示词）
        const displayHistory = conversationHistory.filter(msg => 
            msg.role === 'user' || msg.role === 'assistant'
        );
        
        // 显示最后5条消息
        const recentMessages = displayHistory.slice(-5);
        
        recentMessages.forEach(msg => {
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
        
        // 滚动到底部
        setTimeout(() => {
            messageArea.scrollTop = messageArea.scrollHeight;
        }, 100);
    }
    
    // 加载对话历史
    loadConversation();
    
    // 首次打开聊天窗口显示欢迎语
    if (!localStorage.getItem('ai_welcome_shown')) {
        setTimeout(() => {
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'ai-message ai-message-left';
            welcomeMsg.innerHTML = `<strong>AI助手：</strong> 我是NeuraServe AI助手，可解答产品、价格、技术等问题。有什么需要？`;
            messageArea.appendChild(welcomeMsg);
            localStorage.setItem('ai_welcome_shown', 'true');
            
            // 保存到对话历史
            conversationHistory.push({
                role: 'assistant',
                content: '我是NeuraServe AI助手，可解答产品、价格、技术等问题。有什么需要？'
            });
            saveConversation();
        }, 500);
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
        thinkingMsg.innerHTML = `<strong>AI助手：</strong> <span class="typing-indicator"><span>.</span><span>.</span><span>.</span></span>`;
        messageArea.appendChild(thinkingMsg);
        messageArea.scrollTop = messageArea.scrollHeight;
        
        try {
            // 调用Netlify Function
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时
            
            const response = await fetch('/.netlify/functions/deepseek-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: conversationHistory.slice(-8) // 只发送最近的8条消息
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // 移除思考消息
            thinkingMsg.remove();
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '请求失败');
            }
            
            const data = await response.json();
            
            // 获取AI回复
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
            
            // 保持对话历史长度，避免太长
            if (conversationHistory.length > 20) {
                conversationHistory = [
                    SYSTEM_PROMPT,
                    ...conversationHistory.slice(-18)
                ];
            }
            
            // 保存对话历史
            saveConversation();
            
        } catch (error) {
            console.error('AI请求错误:', error);
            
            // 移除思考消息
            thinkingMsg.remove();
            
            // 显示错误消息
            const errorMsg = document.createElement('div');
            errorMsg.className = 'ai-message ai-message-left';
            
            if (error.name === 'AbortError') {
                errorMsg.innerHTML = `<strong>AI助手：</strong> 请求超时，请简化问题重试。`;
            } else {
                errorMsg.innerHTML = `<strong>AI助手：</strong> 服务繁忙，请稍后。`;
            }
            
            messageArea.appendChild(errorMsg);
            
            // 保存错误信息到历史
            conversationHistory.push({
                role: 'assistant',
                content: '服务繁忙，请稍后重试或直接联系我们。'
            });
            saveConversation();
        }
        
        // 滚动到底部
        messageArea.scrollTop = messageArea.scrollHeight;
    }
    
    // 输入框自动增高
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        const newHeight = Math.min(this.scrollHeight, 100);
        this.style.height = newHeight + 'px';
    });
    
    // 添加预设问题
    addPresetQuestions();
}

// 添加预设问题按钮
function addPresetQuestions() {
    const presetQuestions = [
        "价格多少？",
        "如何试用？", 
        "技术架构？",
        "部署时间？",
        "集成方案？",
        "安全措施？",
        "行业案例？",
        "联系方式？"
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
    title.textContent = '快速提问：';
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
            // 自动发送
            setTimeout(() => {
                document.getElementById('aiSendButton').click();
            }, 100);
        });
        
        presetContainer.appendChild(btn);
    });
    
    // 插入到输入区域上方
    inputArea.parentNode.insertBefore(presetContainer, inputArea);
}

// 添加打字动画CSS
const typingStyle = document.createElement('style');
typingStyle.textContent = `
  .typing-indicator {
    display: inline-flex;
    align-items: center;
    height: 20px;
  }
  .typing-indicator span {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #3a86ff;
    margin: 0 2px;
    animation: typing 1.4s infinite ease-in-out;
  }
  .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
  .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
  @keyframes typing {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(typingStyle);

// 页面加载完成提示
window.addEventListener('load', function() {
    console.log('✅ NeuraServe AI网站加载完成！');
    console.log('✅ AI聊天：DeepSeek API版本，极致优化完成');
    console.log('✅ 功能：对话历史保存、预设问题、欢迎语、打字动画');
    console.log('✅ 优化：简洁回复，降低成本，快速响应');
});
