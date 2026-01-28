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
    
    // 系统提示词
    const SYSTEM_PROMPT = {
        role: 'system',
        content: `你是NeuraServe的专业AI客服助手，专门帮助企业了解和使用NeuraServe AI交互中枢产品。你需要：

1. 专业回答关于NeuraServe产品的所有问题
2. 提供准确的价格和方案建议
3. 展示产品优势和技术细节
4. 保持友好、专业的客服态度
5. 用中文回答，除非用户使用英文提问

产品核心信息：
- 名称：NeuraServe AI交互中枢
- 类型：企业级AI智能解决方案
- 准确率：99.2%意图识别
- 响应：<200ms平均延迟
- 服务：24/7全天候
- 行业：支持50+行业知识库

价格方案：
1. 基础版：¥9,800/年（适合初创团队）
2. 专业版：¥29,800/年（⭐推荐选择）
3. 企业版：定制方案
4. 7天试用：¥500（可抵扣正式版费用）

联系方式：
- 邮箱：1850859427@qq.com
- 微信：Jr_gyh
- 电话：139-5203-6081
- 响应：2小时内获得技术方案`
    };
    
    // 初始化对话历史
    conversationHistory.push(SYSTEM_PROMPT);
    
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
        thinkingMsg.innerHTML = `<strong>AI助手：</strong> <i class="fas fa-spinner fa-spin"></i> 正在思考...`;
        messageArea.appendChild(thinkingMsg);
        messageArea.scrollTop = messageArea.scrollHeight;
        
        try {
            // 调用Netlify Function
            const response = await fetch('/.netlify/functions/deepseek-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: conversationHistory.slice(-10) // 只发送最近的10条消息
                })
            });
            
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
            
        } catch (error) {
            console.error('AI请求错误:', error);
            
            // 移除思考消息
            thinkingMsg.remove();
            
            // 显示错误消息
            const errorMsg = document.createElement('div');
            errorMsg.className = 'ai-message ai-message-left';
            errorMsg.innerHTML = `<strong>AI助手：</strong> ${error.message || '抱歉，服务暂时不可用，请稍后再试。'}`;
            messageArea.appendChild(errorMsg);
            
            // 添加错误处理建议
            const suggestionMsg = document.createElement('div');
            suggestionMsg.className = 'ai-message ai-message-left';
            suggestionMsg.innerHTML = `<strong>提示：</strong> 您也可以直接通过页面下方的联系方式联系我们。`;
            messageArea.appendChild(suggestionMsg);
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
        "产品功能有哪些？",
        "价格是多少？", 
        "如何申请试用？",
        "技术架构是什么？",
        "部署需要多久？",
        "能集成现有系统吗？",
        "有什么成功案例？"
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

// 页面加载完成提示
window.addEventListener('load', function() {
    console.log('✅ NeuraServe AI网站加载完成！');
    console.log('✅ AI聊天：DeepSeek API版本，集成成功');
});
