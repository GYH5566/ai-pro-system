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

// AI聊天模块
function initAIChatModule() {
    const button = document.getElementById('floatingAiButton');
    const windowEl = document.getElementById('floatingAiWindow');
    const closeBtn = document.getElementById('closeAiWindow');
    const messageArea = document.getElementById('aiMessageArea');
    const userInput = document.getElementById('aiUserInput');
    const sendButton = document.getElementById('aiSendButton');
    
    let isAiWindowOpen = false;
    
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
    
    // 核心：发送消息函数 - 使用真实DeepSeek API
    async function sendAiMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // 1. 显示用户消息
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message ai-message-right';
        userMsg.innerHTML = `<strong>您：</strong> ${text}`;
        messageArea.appendChild(userMsg);
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // 2. 显示"思考中"提示
        const thinkingMsg = document.createElement('div');
        thinkingMsg.className = 'ai-message ai-message-left';
        thinkingMsg.innerHTML = `<strong>AI助手：</strong> <i class="fas fa-spinner fa-spin"></i> 思考中...`;
        messageArea.appendChild(thinkingMsg);
        messageArea.scrollTop = messageArea.scrollHeight;

        try {
            // 3. API地址 - 关键！
            // 当前域名 + /api/chat
            const currentDomain = window.location.origin;
            const apiUrl = `${currentDomain}/api/chat`;
            
            console.log('API地址:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: text
                })
            });
            
            console.log('响应状态:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API错误:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
            const result = await response.json();
            console.log('AI回复:', result);
            
            // 4. 移除"思考中"提示
            thinkingMsg.remove();
            
            // 5. 显示AI回复
            if (result.reply) {
                const aiMsg = document.createElement('div');
                aiMsg.className = 'ai-message ai-message-left';
                aiMsg.innerHTML = `<strong>AI助手：</strong> ${result.reply}`;
                messageArea.appendChild(aiMsg);
            } else if (result.error) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'ai-message ai-message-left';
                errorMsg.innerHTML = `<strong>AI助手：</strong> 抱歉，处理请求时出错：${result.error}`;
                messageArea.appendChild(errorMsg);
            }
            
        } catch (error) {
            console.error('请求失败:', error);
            thinkingMsg.remove();
            
            // 友好的错误提示
            let errorMessage = "网络连接出错，请检查：";
            errorMessage += "<br>1. 网络连接是否正常";
            errorMessage += "<br>2. API服务是否部署成功";
            errorMessage += "<br>3. 或直接通过下方联系方式联系我们";
            
            const errorMsg = document.createElement('div');
            errorMsg.className = 'ai-message ai-message-left';
            errorMsg.innerHTML = `<strong>AI助手：</strong> ${errorMessage}`;
            messageArea.appendChild(errorMsg);
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
}
