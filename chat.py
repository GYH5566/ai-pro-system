from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

# 您的DeepSeek API密钥
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")
DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"

# AI的角色
SYSTEM_PROMPT = """你是NeuraServe AI助手，NeuraServe是企业级AI解决方案提供商。

请这样回答：
1. 专业友好
2. 突出99.2%准确率、快速响应
3. 价格问题引导看页面联系方式
4. 联系方式：1850859427@qq.com、微信Jr_gyh、电话139-5203-6081
"""

@app.route('/')
def home():
    return jsonify({
        "status": "运行中",
        "service": "NeuraServe AI",
        "message": "使用POST /api/chat聊天"
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # 获取用户消息
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({"error": "请发送消息"}), 400
        
        # 检查API密钥
        if not DEEPSEEK_API_KEY:
            return jsonify({
                "reply": "AI服务配置中，请直接联系我们。"
            }), 500
        
        # 调用DeepSeek
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
            "max_tokens": 500
        }
        
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            ai_reply = result['choices'][0]['message']['content']
            
            return jsonify({
                "reply": ai_reply,
                "success": True
            })
        else:
            return jsonify({
                "reply": "AI服务暂时不可用。",
                "error": f"API错误: {response.status_code}"
            }), 500
            
    except Exception as e:
        return jsonify({
            "reply": "服务器出错，请重试。",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
