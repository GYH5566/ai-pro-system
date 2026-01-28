from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

# 创建Flask应用
app = Flask(__name__)

# 允许网页访问这个API
CORS(app)

# DeepSeek配置
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")  # 从Vercel获取密钥
DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"

# AI的角色设定
SYSTEM_PROMPT = """你是NeuraServe AI的官方助手，NeuraServe是企业级AI解决方案提供商。

请这样回答问题：
1. 专业友好地介绍产品
2. 如果问具体价格，引导用户看页面下方联系方式
3. 突出99.2%准确率、快速响应、多行业支持

产品信息：
- 准确率：99.2%
- 响应：<200ms延迟
- 方案：基础版¥9,800/年、专业版¥29,800/年、企业定制版
- 试用：7天试用¥500
- 联系：1850859427@qq.com、微信Jr_gyh、电话139-5203-6081
"""

# 网站首页，测试用
@app.route('/')
def home():
    return jsonify({
        "status": "运行正常",
        "service": "NeuraServe AI API",
        "version": "1.0.0"
    })

# AI聊天接口
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # 1. 获取用户消息
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "消息不能为空"}), 400
        
        user_message = data['message'].strip()
        
        # 2. 检查API密钥
        if not DEEPSEEK_API_KEY:
            return jsonify({
                "reply": "AI服务配置中，请稍后重试。"
            }), 500
        
        # 3. 准备请求DeepSeek
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            "max_tokens": 500,
            "temperature": 0.7
        }
        
        # 4. 调用DeepSeek API
        response = requests.post(
            DEEPSEEK_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        # 5. 处理回复
        if response.status_code == 200:
            result = response.json()
            ai_reply = result['choices'][0]['message']['content']
            
            return jsonify({
                "reply": ai_reply,
                "success": True
            })
        else:
            return jsonify({
                "reply": "AI服务暂时不可用，请直接联系我们。",
                "error": f"API错误: {response.status_code}"
            }), 500
            
    except Exception as e:
        return jsonify({
            "reply": "服务器出错了，请稍后重试。",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
