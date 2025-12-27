from flask import render_template, request, jsonify
from .chatbot_logic import get_response

def configure_routes(app):
    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/chat', methods=['POST'])
    def chat():
        user_msg = request.json.get('message')
        if not user_msg:
            return jsonify({"error": "No message"}), 400
        
        response = get_response(user_msg)
        return jsonify({"response": response})