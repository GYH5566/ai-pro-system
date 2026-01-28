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

// ============= AI聊天模块（纯前端版本）=============
function initAIChatModule() {
    const button = document.getElementById('floatingAiButton');
    const windowEl = document.getElementById('floatingAiWindow');
    const closeBtn = document.getElementById('closeAiWindow');
    const messageArea = document.getElementById('aiMessageArea');
    const userInput = document.getElementById('aiUserInput');
    const sendButton = document.getElementById('aiSendButton');
    
    let isAiWindowOpen = false;
    
    // AI知识库 - 预设回复
    const AI_KNOWLEDGE = {
        // 问候
        '你好': '您好！我是NeuraServe AI助手，很高兴为您服务！😊',
        'hello': 'Hello! I\'m NeuraServe AI assistant. Welcome!',
        'hi': 'Hi there! How can I help you today?',
        
        // 产品介绍
        'neuraserve': 'NeuraServe是企业级AI智能交互中枢，基于多模态大语言模型，提供99.2%意图识别准确率和24/7毫秒级响应。',
        '介绍': 'NeuraServe是专业的企业级AI解决方案，帮助企业实现智能化客服、销售支持、内部咨询等场景。',
        '产品': '我们的产品包含：多层感知架构、向量知识库、微服务架构、企业级安全四大核心技术模块。',
        
        // 功能特点
        '功能': '🚀 核心功能：<br>• 多层感知架构（99.2%准确率）<br>• 向量知识库（1000万+容量）<br>• 微服务架构（5000+ QPS）<br>• 企业级安全（AES-256加密）',
        '优势': '💪 核心优势：<br>• 降低成本85%<br>• 2.1个月回本周期<br>• 24/7全天候服务<br>• 支持50+行业知识库',
        '特点': '⭐ 产品特点：<br>• 高准确率：99.2%意图识别<br>• 快速响应：平均延迟<200ms<br>• 多行业：支持50+行业知识库<br>• 易集成：标准API接口',
        
        // 价格方案
        '价格': '💰 定价方案：<br>• 基础版：¥9,800/年（适合初创团队）<br>• 专业版：¥29,800/年（⭐ 推荐选择）<br>• 企业版：定制方案<br>• 试用版：¥500/7天',
        '多少钱': '我们提供多种方案：基础版¥9,800/年，专业版¥29,800/年（推荐），企业版可定制，7天试用版¥500。',
        '收费': '按年订阅收费，具体根据您的需求选择合适方案。',
        '定价': '基础版¥9,800/年，专业版¥29,800/年，企业版定制，7天试用¥500。',
        
        // 联系方式
        '联系': '📞 联系方式：<br>📧 邮箱：1850859427@qq.com<br>📱 微信：Jr_gyh<br>☎️ 电话：139-5203-6081',
        '微信': '我们的微信是：Jr_gyh，添加后获取案例资料和行业解决方案。',
        '电话': '客服电话：139-5203-6081，工作日9:00-22:00接听。',
        '邮箱': '商务邮箱：1850859427@qq.com，发送需求后2小时内获得完整技术方案。',
        
        // 试用部署
        '试用': '🎯 7天深度试用：<br>• 仅需¥500<br>• 体验完整专业版功能<br>• 可抵扣正式版费用<br>• 快速申请',
        'demo': '我们提供7天深度试用版，包含专业版核心功能，¥500/7天，可抵扣正式版费用。',
        '部署': '📅 实施流程（4周上线）：<br>第1周：需求诊断<br>第2周：系统配置<br>第3周：测试优化<br>第4周：上线支持',
        
        // 技术相关
        '技术': '💻 技术架构：<br>• 后端：Python/Flask<br>• 前端：React<br>• 部署：Docker/K8s<br>• 云平台：AWS/Azure<br>• AI模型：GPT/LLaMA',
        'api': '提供标准RESTful API接口，支持JSON格式，易于与CRM、ERP等现有系统集成。',
        '集成': '支持与主流业务系统集成，包括CRM、ERP、工单系统等，提供完整的API文档和技术支持。',
        
        // 默认回复
        'default': '感谢您的咨询！我是NeuraServe AI助手，可以为您解答关于产品功能、价格方案、技术优势等问题。如果您有特定需求，请通过页面下方的联系方式获取专属技术方案。'
    };
    
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
    
    // 发送消息函数（纯前端）
    function sendAiMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // 显示用户消息
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message ai-message-right';
        userMsg.innerHTML = `<strong>您：</strong> ${text}`;
        messageArea.appendChild(userMsg);
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // 显示"思考中"提示
        const thinkingMsg = document.createElement('div');
        thinkingMsg.className = 'ai-message ai-message-left';
        thinkingMsg.innerHTML = `<strong>AI助手：</strong> <i class="fas fa-spinner fa-spin"></i> 思考中...`;
        messageArea.appendChild(thinkingMsg);
        messageArea.scrollTop = messageArea.scrollHeight;
        
        // 模拟AI思考后回复
        setTimeout(() => {
            thinkingMsg.remove();
            
            // 获取AI回复
            let reply = getAIResponse(text);
            
            // 显示AI回复
            const aiMsg = document.createElement('div');
            aiMsg.className = 'ai-message ai-message-left';
            aiMsg.innerHTML = `<strong>AI助手：</strong> ${reply}`;
            messageArea.appendChild(aiMsg);
            
            // 滚动到底部
            messageArea.scrollTop = messageArea.scrollHeight;
            
        }, 600 + Math.random() * 400); // 随机延迟600-1000ms，模拟AI思考
    }
    
    // AI回复逻辑
    function getAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // 检查关键词匹配
        for (const [keyword, response] of Object.entries(AI_KNOWLEDGE)) {
            if (keyword !== 'default' && lowerMessage.includes(keyword.toLowerCase())) {
                return response;
            }
        }
        
        // 英文关键词匹配
        if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            return AI_KNOWLEDGE['价格'];
        }
        if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
            return AI_KNOWLEDGE['联系'];
        }
        if (lowerMessage.includes('trial') || lowerMessage.includes('demo')) {
            return AI_KNOWLEDGE['试用'];
        }
        if (lowerMessage.includes('feature') || lowerMessage.includes('function')) {
            return AI_KNOWLEDGE['功能'];
        }
        if (lowerMessage.includes('advantage') || lowerMessage.includes('benefit')) {
            return AI_KNOWLEDGE['优势'];
        }
        
        // 默认回复
        return AI_KNOWLEDGE['default'];
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
        "产品功能",
        "价格方案", 
        "申请试用",
        "技术支持",
        "部署时间"
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
    console.log('✅ AI聊天：纯前端版本，稳定可靠');
});
