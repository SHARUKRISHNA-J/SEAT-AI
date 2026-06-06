from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.employee_routes import employee_bp
from routes.feedback_routes import feedback_bp
from routes.team_routes import team_bp
from routes.project_routes import project_bp
from config import MONGO_URI


app = Flask(__name__)
CORS(
    app,
    origins=["http://localhost:5173"]
)

app.config["MONGO_URI"] = MONGO_URI

mongo = PyMongo(app)

app.mongo = mongo

app.register_blueprint(employee_bp)
app.register_blueprint(feedback_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(team_bp)
app.register_blueprint(project_bp)

@app.route("/")
def home():
    return "SEAT AI Backend Running"

if __name__ == "__main__":
    app.run(debug=True)