from App import create_app
from config import Development
if __name__ == "__main__":
    app = create_app(Development)

    app.run(debug=True)
