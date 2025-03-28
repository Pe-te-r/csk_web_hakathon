from App import create_app
from config import Development


app = create_app(Development)
if __name__ == "__main__":
    app.run()
