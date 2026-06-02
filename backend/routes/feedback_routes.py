from flask import Blueprint, request, jsonify, current_app

feedback_bp = Blueprint("feedback_bp", __name__)

@feedback_bp.route("/api/feedback", methods=["POST"])
def add_feedback():

    data = request.json

    feedback = {
        "from_employee": data["from_employee"],
        "to_employee": data["to_employee"],
        "rating": data["rating"],
        "comment": data["comment"]
    }

    current_app.mongo.db.feedback.insert_one(feedback)

    return jsonify({
        "message": "Feedback added successfully"
    }), 201

@feedback_bp.route(
    "/api/compatibility/<employee1>/<employee2>",
    methods=["GET"]
)
def get_compatibility(employee1, employee2):

    feedbacks = list(
        current_app.mongo.db.feedback.find({
            "$or": [
                {
                    "from_employee": employee1,
                    "to_employee": employee2
                },
                {
                    "from_employee": employee2,
                    "to_employee": employee1
                }
            ]
        })
    )

    if not feedbacks:
        return jsonify({
            "compatibility_score": 0
        }), 200

    total_rating = sum(
        feedback["rating"]
        for feedback in feedbacks
    )

    avg_rating = total_rating / len(feedbacks)

    compatibility = round(
        (avg_rating / 5) * 100,
        2
    )

    return jsonify({
        "employee1": employee1,
        "employee2": employee2,
        "compatibility_score": compatibility,
        "feedback_count": len(feedbacks)
    }), 200