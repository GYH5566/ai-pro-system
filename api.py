from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

# 创建Flask应用
app = Flask(__name__)

# 允许所有网站访问（生产环境可以限制）
CORS(app)

# 获取DeepSeek API密钥
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")

# 如果没设置API密钥，打印错误
if not DEEPSEEK_API_KEY:
    print("⚠️ 警告：DEEPSEEK_API_KEY环境变量未设置！")

# AI系统提示
SYSTEM_PROMPT = """你是NeuraServe AI助手，专业的企业级AI解决方案提供商。

请这样回答问题：
1. 专业友好地介绍NeuraServe产品
2. 如果用户问具体价格，引导他们看页面下方的联系方式
3. 突出99.2%准确率、24/7服务、快速部署

记住的联系方式：
- 邮箱：1850859427@qq.com
- 微信：Jr_gyh
- 电话：139-5203-6081
"""

# 测试页面
@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "service": "NeuraServe AI API",
        "version": "1.0.0",
        "message": "POST /api/chat 与AI对话"
    })

# AI聊天接口
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # 1. 获取用户消息
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "需要消息内容"}), 400
        
        user_message = data['message'].strip()
        
        # 2. 检查API密钥
        if not DEEPSEEK_API_KEY:
            return jsonify({
                "reply": "AI服务正在配置，请稍后重试或直接联系我们。",
                "error": "DEEPSEEK_API_KEY未设置"
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
            "https://api.deepseek.com/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        # 5. 处理响应
        if response.status_code == 200:
            result = response.json()
            ai_reply = result['choices'][0]['message']['content']
            
            return jsonify({
                "reply": ai_reply,
                "success": True
            })
        else:
            return jsonify({
                "reply": "AI服务暂时不可用，请直接联系我们获取帮助。",
                "error": f"DeepSeek API错误: {response.status_code}"
            }), 500
            
    except Exception as e:
        return jsonify({
            "reply": "服务器错误，请稍后重试。",
            "error": str(e)
        }), 500

# 启动服务器
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
