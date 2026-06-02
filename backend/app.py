from flask import Flask
from flask_pymongo import PyMongo
from routes.employee_routes import employee_bp
from config import MONGO_URI

app = Flask(__name__)

app.config["MONGO_URI"] = MONGO_URI

mongo = PyMongo(app)

app.mongo = mongo

app.register_blueprint(employee_bp)

@app.route("/")
def home():
    return "SEAT AI Backend Running"

if __name__ == "__main__":
    app.run(debug=True)