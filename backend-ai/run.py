from app import create_app
from flask_cors import CORS

app = create_app()

# Enable CORS so your React frontend (port 3000) can talk to this API
CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == "__main__":
    # MoodFlow server starts here
    # We explicitly set host to '0.0.0.0' to ensure it's accessible locally
    app.run(debug=True, host='0.0.0.0', port=5000)