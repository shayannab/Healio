from app import create_app

app = create_app()

if __name__ == "__main__":
    # MoodFlow server starts here
    app.run(debug=True, port=5000)