// 页面控制逻辑
document.addEventListener('DOMContentLoaded', function() {
    const pagesWrapper = document.getElementById('pagesWrapper');
    const indicators = document.querySelectorAll('.indicator-dot');
    const scrollHint = document.getElementById('scrollHint');
    const totalPages = 7;
    
    let currentPage = 0;
    let isAnimating = false;
    let touchStartY = 0;
    
    // 创建后续页面
    createPages();
    
    // 更新页面显示
    function updatePage() {
        pagesWrapper.style.transform = `translateY(-${currentPage * 100}vh)`;
        
        document.querySelectorAll('.page').forEach((page, index) => {
            page.classList.toggle('active', index === currentPage);
        });
        
        indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
        
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
        
        if (Math.abs(deltaY) > 50) {
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
    setTimeout(addCardHoverEffects, 100);
    
    // AI聊天模块初始化
    initAIChatModule();
});

// 创建动态页面
function createPages() {
    const pagesWrapper = document.getElementById('pagesWrapper');
    
    // 页面2：痛点分析
    const page2 = createPage2();
    pagesWrapper.appendChild(page2);
    
    // 页面3：技术架构
    const page3 = createPage3();
    pagesWrapper.appendChild(page3);
    
    // 页面4：经济性分析
    const page4 = createPage4();
    pagesWrapper.appendChild(page4);
    
    // 页面5：实施方案
    const page5 = createPage5();
    pagesWrapper.appendChild(page5);
    
    // 页面6：价格方案
    const page6 = createPage6();
    pagesWrapper.appendChild(page6);
    
    // 页面7：联系页面
    const page7 = createPage7();
    pagesWrapper.appendChild(page7);
}

// 页面2：痛点分析
function createPage2() {
    const page = document.createElement('div');
    page.className = 'page page-2';
    page.id = 'page2';
    
    const content = `
        <div class="page-content">
            <div class="card-common">
                <div class="card-header">
                    <h2 class="card-title">传统客服系统面临的挑战</h2>
                    <p class="card-subtitle">传统规则引擎已无法满足现代企业的智能化需求，以下核心痛点亟需解决</p>
                </div>
                
                <div class="card-grid-2x2">
                    <div class="card-item enhanced-card">
                        <div class="card-icon"><i class="fas fa-brain"></i></div>
                        <h3 class="card-item-title">认知局限</h3>
                        <p class="card-item-content">传统规则引擎无法理解自然语言中的上下文、意图和情感，导致大量误判和用户挫败感。</p>
                        <div class="card-footer">
                            <div><i class="fas fa-exclamation-circle" style="color: #ef4444; margin-right: 8px;"></i>
                            <strong>影响：</strong>客户满意度下降30%，重复咨询率增加45%</div>
                        </div>
                    </div>
                    
                    <div class="card-item enhanced-card">
                        <div class="card-icon"><i class="fas fa-clock"></i></div>
                        <h3 class="card-item-title">维护成本指数增长</h3>
                        <p class="card-item-content">每增加一个新业务场景，需要人工编写和维护大量规则，维护成本随业务复杂度指数级上升。</p>
                        <div class="card-footer">
                            <div><i class="fas fa-exclamation-circle" style="color: #ef4444; margin-right: 8px;"></i>
                            <strong>数据：</strong>规则库每扩大100%，维护成本增加300%</div>
                        </div>
                    </div>
                    
                    <div class="card-item enhanced-card">
                        <div class="card-icon"><i class="fas fa-chart-line"></i></div>
                        <h3 class="card-item-title">无法规模化学习</h3>
                        <p class="card-item-content">系统无法从历史对话中自主学习优化，相同问题需要人工反复调整，缺乏进化能力。</p>
                        <div class="card-footer">
                            <div><i class="fas fa-exclamation-circle" style="color: #ef4444; margin-right: 8px;"></i>
                            <strong>现状：</strong>知识更新依赖人工，响应速度跟不上业务变化</div>
                        </div>
                    </div>
                    
                    <div class="card-item enhanced-card">
                        <div class="card-icon"><i class="fas fa-plug"></i></div>
                        <h3 class="card-item-title">集成复杂度高</h3>
                        <p class="card-item-content">与现有业务系统（CRM、ERP、工单系统）对接困难，数据孤岛问题严重。</p>
                        <div class="card-footer">
                            <div><i class="fas fa-exclamation-circle" style="color: #ef4444; margin-right: 8px;"></i>
                            <strong>成本：</strong>API接口不统一，二次开发成本高昂</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 40px; padding: 30px; 
                          background: rgba(239, 68, 68, 0.08);
                          border-radius: 16px;
                          border: 1px solid rgba(239, 68, 68, 0.25);">
                    <div style="display: flex; align-items: flex-start; gap: 20px;">
                        <div style="font-size: 2.2rem; color: #ef4444; flex-shrink: 0; margin-top: 5px;">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div style="flex-grow: 1;">
                            <h4 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 12px; color: #ef4444;">
                                传统系统核心问题总结
                            </h4>
                            <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin-bottom: 20px;">
                                以上痛点导致传统客服系统无法满足现代企业智能化转型需求，急需基于AI的新一代解决方案打破技术壁垒。
                            </p>
                            
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(239, 68, 68, 0.05); border-radius: 10px;">
                                    <div style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%; flex-shrink: 0;"></div>
                                    <span style="font-size: 0.9rem; color: var(--text-secondary); font-weight: 500;">智能程度低，语义理解差</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(239, 68, 68, 0.05); border-radius: 10px;">
                                    <div style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%; flex-shrink: 0;"></div>
                                    <span style="font-size: 0.9rem; color: var(--text-secondary); font-weight: 500;">维护成本指数级增长</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(239, 68, 68, 0.05); border-radius: 10px;">
                                    <div style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%; flex-shrink: 0;"></div>
                                    <span style="font-size: 0.9rem; color: var(--text-secondary); font-weight: 500;">无法自主学习与进化</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(239, 68, 68, 0.05); border-radius: 10px;">
                                    <div style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%; flex-shrink: 0;"></div>
                                    <span style="font-size: 0.9rem; color: var(--text-secondary); font-weight: 500;">系统集成复杂昂贵</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(239, 68, 68, 0.2); text-align: center;">
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">
                            <i class="fas fa-lightbulb" style="color: var(--primary); margin-right: 8px;"></i>
                            NeuraServe AI解决方案针对以上痛点提供完整的智能化升级方案
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    page.innerHTML = content;
    return page;
}

// 页面3：技术架构
function createPage3() {
    const page = document.createElement('div');
    page.className = 'page page-3';
    page.id = 'page3';
    
    const content = `
        <div class="page-content">
            <div class="card-common">
                <div class="card-header">
                    <h2 class="card-title">核心技术架构</h2>
                    <p class="card-subtitle">基于最先进的AI技术栈，构建稳定、高效、可扩展的企业级智能交互平台</p>
                </div>
                
                <div class="card-grid-2x2">
                    <div class="card-item enhanced-card">
                        <div class="card-icon"><i class="fas fa-layer-group"></i></div>
                        <h3 class="card-item-title">多层感知架构</h3>
                        <p class="card-item-content">意图识别 → 实体提取 → 上下文管理 → 知识检索 → 响应生成的多层处理流水线。</p>
                        <div class="card-footer">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                <span style="color: var(--text-secondary);">准确率: <strong style="color: var(--primary);">99.2%</strong></span>
                                <span style="color: var(--text-secondary);">记忆深度: <strong style="color: var(--primary);">15轮</strong></span>
                                <span style="color: var(--text-secondary);">多模态支持</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-item enhanced-card">
                        <div class="card-icon"><i class="fas fa-database"></i></div>
                        <h3 class="card-item-title">向量知识库</h3>
                        <p class="card-item-content">基于BERT和Sentence Transformers的语义检索，支持百万级知识点的毫秒级匹配。</p>
                        <div class="card-footer">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                <span style="color: var(--text-secondary);">容量: <strong style="color: var(--primary);">1000万+</strong></span>
                                <span style="color: var(--text-secondary);">延迟: <strong style="color: var(--primary);">&lt;50ms</strong></span>
                                <span style="color: var(--text-secondary);">语义匹配</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-item enhanced-card">
                        <div class="card-icon"><i class="fas fa-network-wired"></i></div>
                        <h3 class="card-item-title">微服务架构</h3>
                        <p class="card-item-content">容器化部署，弹性伸缩，支持每秒千级并发请求，99.95%服务可用性保障。</p>
                        <div class="card-footer">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                <span style="color: var(--text-secondary);">并发: <strong style="color: var(--primary);">5000+ QPS</strong></span>
                                <span style="color: var(--text-secondary);">自动扩缩容</span>
                                <span style="color: var(--text-secondary);">多可用区</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-item enhanced-card">
                        <div class="card-icon"><i class="fas fa-shield-alt"></i></div>
                        <h3 class="card-item-title">企业级安全</h3>
                        <p class="card-item-content">端到端加密传输，私有化部署选项，SOC2合规，完整审计日志。</p>
                        <div class="card-footer">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                <span style="color: var(--text-secondary);">AES-256加密</span>
                                <span style="color: var(--text-secondary);">GDPR合规</span>
                                <span style="color: var(--text-secondary);">完整审计</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 40px; padding: 30px 25px; 
                          background: rgba(15, 23, 42, 0.5);
                          border-radius: 16px;
                          border: 1px solid rgba(58, 134, 255, 0.1);">
                    <h4 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 25px; 
                             text-align: center; color: var(--text-primary);">
                        技术栈支持
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; justify-items: center;">
                        <div style="text-align: center;">
                            <div style="font-size: 1.8rem; color: var(--primary); margin-bottom: 8px;">
                                <i class="fab fa-python"></i>
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Python/Flask</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.8rem; color: var(--primary); margin-bottom: 8px;">
                                <i class="fab fa-react"></i>
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">React前端</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.8rem; color: var(--primary); margin-bottom: 8px;">
                                <i class="fab fa-docker"></i>
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Docker/K8s</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.8rem; color: var(--primary); margin-bottom: 8px;">
                                <i class="fas fa-cloud"></i>
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">AWS/Azure</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.8rem; color: var(--primary); margin-bottom: 8px;">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">GPT/LLaMA</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    page.innerHTML = content;
    return page;
}

// 页面4：经济性分析
function createPage4() {
    const page = document.createElement('div');
    page.className = 'page page-4';
    page.id = 'page4';
    
    const content = `
        <div class="page-content">
            <div class="card-common">
                <div class="card-header">
                    <h2 class="card-title">经济性分析</h2>
                    <p class="card-subtitle">与传统人工客服团队对比，显著降低运营成本，实现快速投资回报</p>
                </div>
                
                <div class="card-grid-2x2">
                    <div class="card-item enhanced-card">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <div style="font-size: 1.8rem; margin-right: 12px; color: #ef4444;">
                                <i class="fas fa-users"></i>
                            </div>
                            <div>
                                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 3px; color: #ef4444;">传统人工团队</h3>
                                <p style="color: rgba(239, 68, 68, 0.7); font-size: 0.85rem;">5人客服团队 · 年度成本</p>
                            </div>
                        </div>
                        
                        <div style="font-size: 2rem; font-weight: 800; color: #ef4444; margin: 10px 0 15px; text-align: center;">¥640,000</div>
                        
                        <div style="flex-grow: 1;">
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="margin-bottom: 10px; padding-left: 22px; position: relative;">
                                    <i class="fas fa-times" style="color: #ef4444; position: absolute; left: 0; top: 2px; font-size: 0.9rem;"></i>
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;">人力成本：¥500,000</span>
                                </li>
                                <li style="margin-bottom: 10px; padding-left: 22px; position: relative;">
                                    <i class="fas fa-times" style="color: #ef4444; position: absolute; left: 0; top: 2px; font-size: 0.9rem;"></i>
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;">培训与管理：¥80,000</span>
                                </li>
                                <li style="margin-bottom: 10px; padding-left: 22px; position: relative;">
                                    <i class="fas fa-times" style="color: #ef4444; position: absolute; left: 0; top: 2px; font-size: 0.9rem;"></i>
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;">系统工具：¥60,000</span>
                                </li>
                                <li style="padding-left: 22px; position: relative;">
                                    <i class="fas fa-times" style="color: #ef4444; position: absolute; left: 0; top: 2px; font-size: 0.9rem;"></i>
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;">仅支持8小时/天</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="card-item enhanced-card">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <div style="font-size: 1.8rem; margin-right: 12px; color: #10b981;">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div>
                                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 3px; color: #10b981;">AI智能中枢</h3>
                                <p style="color: rgba(16, 185, 129, 0.7); font-size: 0.85rem;">企业版 · 年度服务</p>
                            </div>
                        </div>
                        
                        <div style="font-size: 2rem; font-weight: 800; color: #10b981; margin: 10px 0 15px; text-align: center;">¥98,000</div>
                        
                        <div style="flex-grow: 1;">
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="margin-bottom: 10px; padding-left: 22px; position: relative;">
                                    <i class="fas fa-check" style="color: #10b981; position: absolute; left: 0; top: 2px; font-size: 0.9rem;"></i>
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;">全功能AI + 5坐席</span>
                                </li>
                                <li style="margin-bottom: 10px; padding-left: 22px; position: relative;">
                                    <i class="fas fa-check" style="color: #10b981; position: absolute; left: 0; top: 2px; font-size: 0.9rem;"></i>
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;">全年技术维护</span>
                                </li>
                                <li style="margin-bottom: 10px; padding-left: 22px; position: relative;">
                                    <i class="fas fa-check" style="color: #10b981; position: absolute; left: 0; top: 2px; font-size: 0.9rem;"></i>
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;">专属模型训练</span>
                                </li>
                                <li style="padding-left: 22px; position: relative;">
                                    <i class="fas fa-check" style="color: #10b981; position: absolute; left: 0; top: 2px; font-size: 0.9rem;"></i>
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;">7×24小时服务</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="background: rgba(16, 185, 129, 0.08);
                              border-radius: 16px;
                              padding: 25px;
                              border: 1px solid rgba(16, 185, 129, 0.3);
                              grid-column: span 2;">
                        
                        <div style="text-align: center; margin-bottom: 20px;">
                            <div style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 8px;">
                                年度净节省
                            </div>
                            <div style="font-size: 2.5rem; font-weight: 800; color: #10b981; margin-bottom: 10px;">
                                ¥542,000
                            </div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">
                                相当于<span style="color: #10b981; font-weight: 700;">85%的成本削减</span>，投资回报周期仅<span style="color: #10b981; font-weight: 700;">2.1个月</span>
                            </div>
                        </div>
                        
                        <div style="margin-top: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary); font-size: 0.85rem;">投资回报率</span>
                                <span style="color: #10b981; font-weight: 700; font-size: 0.85rem;">553%</span>
                            </div>
                            <div style="height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden;">
                                <div style="height: 100%; width: 85%; background: linear-gradient(90deg, #10b981, #0ea5e9); border-radius: 4px;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                                <div style="text-align: center; flex: 1;">
                                    <div style="font-size: 1.5rem; font-weight: 800; color: #10b981;">2.1</div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary);">月回本周期</div>
                                </div>
                                <div style="text-align: center; flex: 1;">
                                    <div style="font-size: 1.5rem; font-weight: 800; color: #10b981;">553%</div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary);">年ROI</div>
                                </div>
                                <div style="text-align: center; flex: 1;">
                                    <div style="font-size: 1.5rem; font-weight: 800; color: #10b981;">5.4倍</div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary);">效率提升</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    page.innerHTML = content;
    return page;
}

// 页面5：实施方案
function createPage5() {
    const page = document.createElement('div');
    page.className = 'page page-5';
    page.id = 'page5';
    
    const content = `
        <div class="page-content">
            <div class="card-common">
                <div class="card-header">
                    <h2 class="card-title">实施流程</h2>
                    <p class="card-subtitle">四周快速上线，标准化实施流程确保项目成功交付</p>
                </div>
                
                <div style="position: relative; margin: 30px 0 25px; padding: 0 8px;">
                    <div style="position: absolute; left: 100px; top: 0; bottom: 0; width: 2px; 
                              background: linear-gradient(to bottom, var(--primary), var(--secondary)); 
                              border-radius: 1px;">
                    </div>
                    
                    <div style="display: flex; margin-bottom: 35px; position: relative;">
                        <div style="width: 100px; flex-shrink: 0; padding-right: 20px; text-align: right;">
                            <div style="color: var(--primary); font-weight: 700; font-size: 0.85rem; margin-bottom: 3px;">第1周</div>
                            <div style="color: var(--text-secondary); font-size: 0.8rem;">需求诊断</div>
                        </div>
                        <div style="position: absolute; left: 98px; top: 0; width: 12px; height: 12px; 
                                  background: var(--primary); border-radius: 50%; border: 2px solid #0f172a;">
                        </div>
                        <div style="flex-grow: 1; padding-left: 30px;">
                            <div style="background: rgba(58, 134, 255, 0.1); border-radius: 10px; padding: 16px; 
                                      border: 1px solid rgba(58, 134, 255, 0.2);">
                                <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; color: var(--primary);">
                                    <i class="fas fa-clipboard-list" style="margin-right: 8px; font-size: 0.9rem;"></i>
                                    需求诊断阶段
                                </h3>
                                <ul style="color: var(--text-secondary); padding-left: 18px; font-size: 0.85rem; margin: 0;">
                                    <li style="margin-bottom: 6px;">• 业务场景分析与梳理</li>
                                    <li style="margin-bottom: 6px;">• 历史对话数据收集与清洗</li>
                                    <li>• 成功指标定义与KPI设定</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; margin-bottom: 35px; position: relative;">
                        <div style="width: 100px; flex-shrink: 0; padding-right: 20px; text-align: right;">
                            <div style="color: var(--primary); font-weight: 700; font-size: 0.85rem; margin-bottom: 3px;">第2周</div>
                            <div style="color: var(--text-secondary); font-size: 0.8rem;">系统配置</div>
                        </div>
                        <div style="position: absolute; left: 98px; top: 0; width: 12px; height: 12px; 
                                  background: var(--primary); border-radius: 50%; border: 2px solid #0f172a;">
                        </div>
                        <div style="flex-grow: 1; padding-left: 30px;">
                            <div style="background: rgba(58, 134, 255, 0.1); border-radius: 10px; padding: 16px; 
                                      border: 1px solid rgba(58, 134, 255, 0.2);">
                                <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; color: var(--primary);">
                                    <i class="fas fa-cogs" style="margin-right: 8px; font-size: 0.9rem;"></i>
                                    系统配置阶段
                                </h3>
                                <ul style="color: var(--text-secondary); padding-left: 18px; font-size: 0.85rem; margin: 0;">
                                    <li style="margin-bottom: 6px;">• 知识库构建与语义标注</li>
                                    <li style="margin-bottom: 6px;">• 业务流程映射与工作流设计</li>
                                    <li>• 领域模型微调与参数优化</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; margin-bottom: 35px; position: relative;">
                        <div style="width: 100px; flex-shrink: 0; padding-right: 20px; text-align: right;">
                            <div style="color: var(--primary); font-weight: 700; font-size: 0.85rem; margin-bottom: 3px;">第3周</div>
                            <div style="color: var(--text-secondary); font-size: 0.8rem;">测试优化</div>
                        </div>
                        <div style="position: absolute; left: 98px; top: 0; width: 12px; height: 12px; 
                                  background: var(--primary); border-radius: 50%; border: 2px solid #0f172a;">
                        </div>
                        <div style="flex-grow: 1; padding-left: 30px;">
                            <div style="background: rgba(58, 134, 255, 0.1); border-radius: 10px; padding: 16px; 
                                      border: 1px solid rgba(58, 134, 255, 0.2);">
                                <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; color: var(--primary);">
                                    <i class="fas fa-vial" style="margin-right: 8px; font-size: 0.9rem;"></i>
                                    测试优化阶段
                                </h3>
                                <ul style="color: var(--text-secondary); padding-left: 18px; font-size: 0.85rem; margin: 0;">
                                    <li style="margin-bottom: 6px;">• 多轮对话场景测试</li>
                                    <li style="margin-bottom: 6px;">• 意图识别准确率优化</li>
                                    <li>• 系统性能调优与压力测试</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; margin-bottom: 30px; position: relative;">
                        <div style="width: 100px; flex-shrink: 0; padding-right: 20px; text-align: right;">
                            <div style="color: var(--primary); font-weight: 700; font-size: 0.85rem; margin-bottom: 3px;">第4周</div>
                            <div style="color: var(--text-secondary); font-size: 0.8rem;">上线支持</div>
                        </div>
                        <div style="position: absolute; left: 98px; top: 0; width: 12px; height: 12px; 
                                  background: var(--primary); border-radius: 50%; border: 2px solid #0f172a;">
                        </div>
                        <div style="flex-grow: 1; padding-left: 30px;">
                            <div style="background: rgba(58, 134, 255, 0.1); border-radius: 10px; padding: 16px; 
                                      border: 1px solid rgba(58, 134, 255, 0.2);">
                                <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; color: var(--primary);">
                                    <i class="fas fa-rocket" style="margin-right: 8px; font-size: 0.9rem;"></i>
                                    上线支持阶段
                                </h3>
                                <ul style="color: var(--text-secondary); padding-left: 18px; font-size: 0.85rem; margin: 0;">
                                    <li style="margin-bottom: 6px;">• 生产环境部署与监控</li>
                                    <li style="margin-bottom: 6px;">• 运营团队培训与文档交付</li>
                                    <li>• 监控体系建立与告警配置</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; 
                          background: rgba(15, 23, 42, 0.5);
                          border-radius: 14px;
                          border: 1px solid rgba(58, 134, 255, 0.1);">
                    <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 18px; 
                             text-align: center; color: var(--text-primary);">
                        成功实施保障
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;">
                        <div style="text-align: center;">
                            <div style="font-size: 1.8rem; color: var(--primary); margin-bottom: 8px;">
                                <i class="fas fa-user-tie"></i>
                            </div>
                            <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                                专属项目经理
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.3;">
                                全程跟进，确保按时交付
                            </div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.8rem; color: var(--primary); margin-bottom: 8px;">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                                100%成功交付
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.3;">
                                承诺项目成功，否则退款
                            </div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.8rem; color: var(--primary); margin-bottom: 8px;">
                                <i class="fas fa-headset"></i>
                            </div>
                            <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                                7×24技术支持
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.3;">
                                上线后持续优化支持
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    page.innerHTML = content;
    return page;
}

// 页面6：价格方案
function createPage6() {
    const page = document.createElement('div');
    page.className = 'page page-6';
    page.id = 'page6';
    
    const content = `
        <div class="page-content">
            <div class="card-common">
                <div class="card-header">
                    <h2 class="card-title">服务方案</h2>
                    <p class="card-subtitle">三种版本满足不同规模企业的需求，高性价比AI智能解决方案</p>
                </div>
                
                <div style="display: grid; 
                          grid-template-columns: repeat(3, 1fr);
                          gap: 25px;
                          margin-top: 30px;">
                    
                    <div class="price-card enhanced-card">
                        <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 15px; color: var(--text-primary);">
                            基础版
                        </h3>
                        
                        <div class="price-amount">¥9,800</div>
                        
                        <div class="price-period">
                            年度订阅 · 适合初创团队
                        </div>
                        
                        <ul class="price-features">
                            <li><i class="fas fa-check"></i><span>标准AI客服核心功能</span></li>
                            <li><i class="fas fa-check"></i><span>支持3个平台接入</span></li>
                            <li><i class="fas fa-check"></i><span>基础知识库管理</span></li>
                            <li><i class="fas fa-check"></i><span>工作日技术支持</span></li>
                            <li><i class="fas fa-check"></i><span>基础数据分析报告</span></li>
                        </ul>
                        
                        <a href="mailto:1850859427@qq.com?subject=NeuraServe基础版咨询&body=咨询方案：基础版（¥9,800/年）%0D%0A%0D%0A公司名称：%0D%0A联系人：%0D%0A电话：%0D%0AJr_gyh具体需求：" 
                           style="text-decoration: none; display: block;">
                            <button class="price-button">咨询方案</button>
                        </a>
                    </div>
                    
                    <div class="price-card enhanced-card featured">
                        <div class="price-recommended">⭐ 推荐选择</div>
                        
                        <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 15px; color: var(--primary);">
                            专业版
                        </h3>
                        
                        <div class="price-amount">¥29,800</div>
                        
                        <div class="price-period">
                            年度订阅 · 适合成长型企业
                        </div>
                        
                        <ul class="price-features">
                            <li><i class="fas fa-check"></i><span>高级AI + 自定义工作流</span></li>
                            <li><i class="fas fa-check"></i><span>无限平台接入</span></li>
                            <li><i class="fas fa-check"></i><span>专属模型训练</span></li>
                            <li><i class="fas fa-check"></i><span>7×24小时优先支持</span></li>
                            <li><i class="fas fa-check"></i><span>高级数据分析与洞察</span></li>
                        </ul>
                        
                        <a href="mailto:1850859427@qq.com?subject=NeuraServe专业版咨询&body=咨询方案：专业版（¥29,800/年）%0D%0A%0D%0A公司名称：%0D%0A联系人：%0D%0A电话：%0D%0AJr_gyh具体需求：" 
                           style="text-decoration: none; display: block;">
                            <button class="price-button">立即咨询</button>
                        </a>
                    </div>
                    
                    <div class="price-card enhanced-card">
                        <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 15px; color: var(--text-primary);">
                            企业版
                        </h3>
                        
                        <div class="price-amount">定制</div>
                        
                        <div class="price-period">
                            按需定价 · 适合大型企业
                        </div>
                        
                        <ul class="price-features">
                            <li><i class="fas fa-check"></i><span>全功能私有化部署</span></li>
                            <li><i class="fas fa-check"></i><span>API深度集成支持</span></li>
                            <li><i class="fas fa-check"></i><span>专属客户成功团队</span></li>
                            <li><i class="fas fa-check"></i><span>SLA服务等级保障</span></li>
                            <li><i class="fas fa-check"></i><span>定制化开发支持</span></li>
                        </ul>
                        
                        <a href="mailto:1850859427@qq.com?subject=NeuraServe企业版定制&body=咨询方案：企业定制版%0D%0A%0D%0A公司名称：%0D%0A联系人：%0D%0A电话：%0D%0AJr_gyh定制需求：" 
                           style="text-decoration: none; display: block;">
                            <button class="price-button">联系定制</button>
                        </a>
                    </div>
                </div>
                
                <div style="margin-top: 35px; padding: 25px; 
                          background: rgba(58, 134, 255, 0.08);
                          border-radius: 16px;
                          border: 1px solid rgba(58, 134, 255, 0.2);">
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
                        <div style="flex: 1; min-width: 300px;">
                            <h4 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 10px; color: var(--primary);">
                                7天深度试用版
                            </h4>
                            <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 15px; line-height: 1.5;">
                                体验完整功能，包含专业版核心能力，7天试用期结束后可无缝升级为正式版
                            </p>
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">
                                    ¥500
                                </div>
                                <div style="font-size: 0.9rem; color: var(--text-secondary);">
                                    / 7天试用 · 可抵扣正式版费用
                                </div>
                            </div>
                        </div>
                        <div style="flex-shrink: 0;">
                            <a href="mailto:1850859427@qq.com?subject=NeuraServe7天试用申请&body=申请7天深度试用版（¥500）%0D%0A%0D%0A公司名称：%0D%0A联系人：%0D%0A电话：%0D%0AJr_gyh试用需求：" 
                               style="text-decoration: none;">
                                <button style="padding: 14px 30px; background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                                            color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 1rem;
                                            cursor: pointer; transition: transform 0.3s ease; white-space: nowrap;">
                                    申请试用
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    page.innerHTML = content;
    return page;
}

// 页面7：联系页面
function createPage7() {
    const page = document.createElement('div');
    page.className = 'page page-7';
    page.id = 'page7';
    
    const content = `
        <div class="page-content">
            <div class="card-common">
                <div class="card-header">
                    <h2 class="card-title">获取专属技术方案</h2>
                    <p class="card-subtitle">选择最适合您的联系方式，2小时内获得定制化技术方案</p>
                </div>
                
                <div style="display: grid; 
                          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                          gap: 20px;
                          margin-top: 25px;">
                    
                    <div class="card-item enhanced-card">
                        <div class="card-icon"><i class="fas fa-envelope"></i></div>
                        <h3 class="card-item-title">邮件咨询</h3>
                        
                        <div style="font-size: 1rem; color: var(--primary); margin-bottom: 15px; font-weight: 600;">
                            1850859427@qq.com
                        </div>
                        
                        <p class="card-item-content">
                            发送需求后获得完整的ROI分析和技术方案文档
                        </p>
                        
                        <a href="mailto:1850859427@qq.com?subject=NeuraServe技术方案咨询&body=公司名称：%0D%0A联系人：%0D%0A电话：%0D%0AJr_gyh所属行业：%0D%0A公司规模：%0D%0A具体需求：" 
                           style="text-decoration: none; display: block; width: 100%;">
                            <button class="price-button">发送邮件</button>
                        </a>
                    </div>
                    
                    <div class="card-item enhanced-card">
                        <div class="card-icon"><i class="fab fa-weixin"></i></div>
                        <h3 class="card-item-title">微信咨询</h3>
                        
                        <div style="font-size: 1rem; color: var(--primary); margin-bottom: 15px; font-weight: 600;">
                            Jr_gyh
                        </div>
                        
                        <p class="card-item-content">
                            添加微信获取案例资料和行业解决方案
                        </p>
                        
                        <div style="background: rgba(16, 185, 129, 0.1); border-radius: 8px; padding: 12px; width: 100%;">
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 6px;">
                                <i class="fas fa-clock" style="color: var(--primary); margin-right: 6px; font-size: 0.8rem;"></i>
                                响应：工作日9:00-22:00
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">
                                <i class="fas fa-file-alt" style="color: var(--primary); margin-right: 6px; font-size: 0.8rem;"></i>
                                提供：案例资料+实施方案
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-item enhanced-card" style="grid-column: span 2;">
                        <div class="card-icon"><i class="fas fa-phone-alt"></i></div>
                        <h3 class="card-item-title">电话咨询</h3>
                        
                        <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary); margin-bottom: 15px;">
                            <a href="tel:13952036081" style="color: var(--primary); text-decoration: none;">
                                139-5203-6081
                            </a>
                        </div>
                        
                        <p class="card-item-content">
                            适合紧急需求，直接与技术顾问对话，15分钟内回拨
                        </p>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; width: 100%; max-width: 500px;">
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary); margin-bottom: 6px;">
                                    <i class="far fa-clock"></i>
                                </div>
                                <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                                    服务时间
                                </div>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">
                                    9:00-22:00
                                </div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary); margin-bottom: 6px;">
                                    <i class="fas fa-bolt"></i>
                                </div>
                                <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                                    紧急支持
                                </div>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">
                                    7×24响应
                                </div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary); margin-bottom: 6px;">
                                    <i class="fas fa-history"></i>
                                </div>
                                <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                                    响应承诺
                                </div>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">
                                    15分钟回拨
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; 
                          background: rgba(16, 185, 129, 0.08);
                          border-radius: 14px;
                          border: 1px solid rgba(16, 185, 129, 0.2);
                          text-align: center;">
                    <h4 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 12px; color: var(--primary);">
                        📋 快速需求提交
                    </h4>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 18px; line-height: 1.4; max-width: 650px; margin-left: auto; margin-right: auto;">
                        点击下方按钮发送邮件，获得个性化的技术方案演示和ROI分析
                    </p>
                    
                    <a href="mailto:1850859427@qq.com?subject=NeuraServe技术方案咨询&body=公司名称：%0D%0A联系人：%0D%0A电话：%0D%0AJr_gyh所属行业：%0D%0A公司规模：%0D%0A具体需求：" 
                       style="text-decoration: none; display: inline-block;">
                        <button style="padding: 15px 35px; background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                                    color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 1rem;
                                    cursor: pointer; transition: transform 0.3s ease; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-paper-plane"></i>
                            提交需求，获取技术方案
                        </button>
                    </a>
                    
                    <p style="color: var(--text-secondary); margin-top: 15px; font-size: 0.8rem;">
                        <i class="fas fa-info-circle" style="margin-right: 6px; font-size: 0.8rem;"></i>
                        提交即表示同意准备方案，信息严格保密
                    </p>
                </div>
            </div>
        </div>
    `;
    
    page.innerHTML = content;
    return page;
}

// 添加卡片悬停效果
function addCardHoverEffects() {
    const enhancedCards = document.querySelectorAll('.card-item, .price-card');
    enhancedCards.forEach(card => {
        card.classList.add('enhanced-card');
    });
}

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
            setTimeout(() => userInput.focus(), 100);
        }
    }
    
    // 绑定按钮事件
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleAiWindow();
    });
    
    closeBtn.addEventListener('click', toggleAiWindow);
    
    // 阻止聊天窗口的滚动事件冒泡到页面
    windowEl.addEventListener('wheel', function(e) {
        e.stopPropagation();
    });
    
    windowEl.addEventListener('touchstart', function(e) {
        e.stopPropagation();
    }, { passive: true });
    
    // 发送消息函数
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
        thinkingMsg.innerHTML = `<strong>AI助手：</strong> <i class="fas fa-cog fa-spin"></i> 思考中...`;
        messageArea.appendChild(thinkingMsg);
        messageArea.scrollTop = messageArea.scrollHeight;
        
        // 模拟API响应
        setTimeout(() => {
            thinkingMsg.remove();
            const aiMsg = document.createElement('div');
            aiMsg.className = 'ai-message ai-message-left';
            aiMsg.innerHTML = `<strong>AI助手：</strong> 已收到您的提问："${text}"。请配置DeepSeek API Key以获取真实回复。`;
            messageArea.appendChild(aiMsg);
            messageArea.scrollTop = messageArea.scrollHeight;
        }, 1000);
    }
    
    // 绑定发送事件
    sendButton.addEventListener('click', sendAiMessage);
    
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendAiMessage();
        }
    });
    
    // 输入框自动增高
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}