from flask import current_app

def get_compatibility_score(emp1, emp2):

    feedbacks = list(
        current_app.mongo.db.feedback.find({
            "$or": [
                {
                    "from_employee": emp1,
                    "to_employee": emp2
                },
                {
                    "from_employee": emp2,
                    "to_employee": emp1
                }
            ]
        })
    )

    if not feedbacks:
        return 0

    total = sum(
        feedback["rating"]
        for feedback in feedbacks
    )

    avg = total / len(feedbacks)

    return round(
        (avg / 5) * 100,
        2
    )