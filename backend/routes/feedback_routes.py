from flask import Blueprint, request, jsonify, current_app

feedback_bp = Blueprint(
    "feedback_bp",
    __name__
)

# -------------------------------
# Add Feedback
# -------------------------------
@feedback_bp.route(
    "/api/feedback",
    methods=["POST"]
)
def add_feedback():

    data = request.json

    feedback = {

        "project_title":
            data["project_title"],

        "from_employee":
            data["from_employee"],

        "to_employee":
            data["to_employee"],

        "rating":
            data["rating"],

        "comment":
            data["comment"]
    }

    current_app.mongo.db.feedback.insert_one(
        feedback
    )

    return jsonify({
        "message":
            "Feedback added successfully"
    }), 201


# -------------------------------
# Compatibility Score
# -------------------------------
@feedback_bp.route(
    "/api/compatibility/<employee1>/<employee2>",
    methods=["GET"]
)
def get_compatibility(
    employee1,
    employee2
):

    feedbacks = list(
        current_app.mongo.db.feedback.find(
            {
                "$or": [
                    {
                        "from_employee":
                            employee1,
                        "to_employee":
                            employee2
                    },
                    {
                        "from_employee":
                            employee2,
                        "to_employee":
                            employee1
                    }
                ]
            }
        )
    )

    if not feedbacks:

        return jsonify({
            "compatibility_score":
                0
        }), 200

    total_rating = sum(
        feedback["rating"]
        for feedback in feedbacks
    )

    avg_rating = (
        total_rating /
        len(feedbacks)
    )

    compatibility = round(
        (avg_rating / 5) * 100,
        2
    )

    return jsonify({

        "employee1":
            employee1,

        "employee2":
            employee2,

        "compatibility_score":
            compatibility,

        "feedback_count":
            len(feedbacks)

    }), 200


# -------------------------------
# Pending Feedback Check
# -------------------------------
@feedback_bp.route(
    "/api/feedback/pending/<employee_name>",
    methods=["GET"]
)
def get_pending_feedback(
    employee_name
):

    completed_projects = list(
        current_app.mongo.db.projects.find(
            {
                "status":
                    "completed",
                "team_members":
                    employee_name
            }
        )
    )

    pending_projects = []

    for project in completed_projects:

        teammates = [

            member

            for member in
            project["team_members"]

            if member != employee_name

        ]

        feedback_count = (
            current_app.mongo.db.feedback.count_documents(
                {
                    "project_title":
                        project["title"],

                    "from_employee":
                        employee_name
                }
            )
        )

        if feedback_count < len(teammates):

            pending_projects.append({

                "project_title":
                    project["title"],

                "teammates":
                    teammates

            })

    return jsonify(
        pending_projects
    ), 200


# -------------------------------
# View Feedback Received
# -------------------------------
@feedback_bp.route(
    "/api/feedback/<employee_name>",
    methods=["GET"]
)
def get_feedback(
    employee_name
):

    feedbacks = list(
        current_app.mongo.db.feedback.find(
            {
                "to_employee":
                    employee_name
            }
        )
    )

    for feedback in feedbacks:

        feedback["_id"] = str(
            feedback["_id"]
        )

    return jsonify(
        feedbacks
    ), 200