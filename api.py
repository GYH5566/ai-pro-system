from http.server import BaseHTTPRequestHandler
import json
import os
import requests

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/chat':
            try:
                # 1. 读取请求数据
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data)
                
                # 2. 获取用户消息
                user_message = data.get('message', '')
                
                # 3. 获取DeepSeek API密钥
                deepseek_api_key = os.environ.get('DEEPSEEK_API_KEY')
                
                if not deepseek_api_key:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "reply": "AI服务配置中，请稍后重试。"
                    }).encode())
                    return
                
                # 4. 调用DeepSeek API
                headers = {
                    "Authorization": f"Bearer {deepseek_api_key}",
                    "Content-Type": "application/json"
                }
                
                payload = {
                    "model": "deepseek-chat",
                    "messages": [
                        {
                            "role": "system", 
                            "content": "你是NeuraServe AI助手，企业级AI解决方案提供商。"
                        },
                        {
                            "role": "user", 
                            "content": user_message
                        }
                    ],
                    "max_tokens": 300
                }
                
                response = requests.post(
                    "https://api.deepseek.com/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=30
                )
                
                # 5. 返回响应
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                if response.status_code == 200:
                    result = response.json()
                    ai_reply = result['choices'][0]['message']['content']
                    self.wfile.write(json.dumps({
                        "reply": ai_reply,
                        "success": True
                    }).encode())
                else:
                    self.wfile.write(json.dumps({
                        "reply": "AI服务暂时不可用，请稍后重试。",
                        "error": f"API错误: {response.status_code}"
                    }).encode())
                    
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "reply": "服务器内部错误",
                    "error": str(e)
                }).encode())
        
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
