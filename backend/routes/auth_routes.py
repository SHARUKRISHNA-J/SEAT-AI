from flask import Blueprint, request, jsonify, current_app

auth_bp = Blueprint(
    "auth_bp",
    __name__
)

@auth_bp.route(
    "/api/login",
    methods=["POST"]
)
def login():

    data = request.json

    username = data["username"]
    password = data["password"]

    user = current_app.mongo.db.users.find_one(
        {
            "username": username,
            "password": password
        }
    )

    if not user:

        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

    return jsonify({
    "success": True,
    "username": user["username"],
    "name": user["name"],
    "role": user["role"]
}), 200