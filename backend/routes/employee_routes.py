from flask import Blueprint, request, jsonify, current_app

employee_bp = Blueprint("employee_bp", __name__)

@employee_bp.route("/api/employees", methods=["POST"])
def create_employee():

    employee = request.json

    current_app.mongo.db.employees.insert_one(employee)

    return jsonify({
        "message": "Employee created successfully"
    }), 201

from bson import ObjectId

@employee_bp.route("/api/employees", methods=["GET"])
def get_employees():

    employees = list(
        current_app.mongo.db.employees.find()
    )

    for employee in employees:
        employee["_id"] = str(employee["_id"])

    return jsonify(employees), 200

from bson import ObjectId

@employee_bp.route("/api/employees/<employee_id>", methods=["GET"])
def get_employee(employee_id):

    employee = current_app.mongo.db.employees.find_one(
        {"_id": ObjectId(employee_id)}
    )

    if not employee:
        return jsonify({
            "message": "Employee not found"
        }), 404

    employee["_id"] = str(employee["_id"])

    return jsonify(employee), 200

@employee_bp.route("/api/employees/<employee_id>", methods=["PUT"])
def update_employee(employee_id):

    updated_data = request.json

    result = current_app.mongo.db.employees.update_one(
        {"_id": ObjectId(employee_id)},
        {"$set": updated_data}
    )

    if result.matched_count == 0:
        return jsonify({
            "message": "Employee not found"
        }), 404

    return jsonify({
        "message": "Employee updated successfully"
    }), 200

@employee_bp.route("/api/employees/<employee_id>", methods=["DELETE"])
def delete_employee(employee_id):

    result = current_app.mongo.db.employees.delete_one(
        {"_id": ObjectId(employee_id)}
    )

    if result.deleted_count == 0:
        return jsonify({
            "message": "Employee not found"
        }), 404

    return jsonify({
        "message": "Employee deleted successfully"
    }), 200

@employee_bp.route(
    "/api/employees/skills",
    methods=["PUT"]
)
def update_skill():

    data = request.json

    employee_name = data["employee_name"]
    skill_name = data["skill_name"]
    rating = data["rating"]

    employee = current_app.mongo.db.employees.find_one(
        {"name": employee_name}
    )

    if not employee:

        return jsonify({
            "message": "Employee not found"
        }), 404

    skills = employee.get(
        "skills",
        []
    )

    skill_found = False

    for skill in skills:

        if skill["name"].lower() == skill_name.lower():

            skill["rating"] = rating

            skill_found = True

            break

    if not skill_found:

        skills.append({
            "name": skill_name,
            "rating": rating
        })

    current_app.mongo.db.employees.update_one(
        {"name": employee_name},
        {
            "$set": {
                "skills": skills
            }
        }
    )

    return jsonify({
        "message":
        "Skill updated successfully"
    }), 200

@employee_bp.route(
    "/api/employees/<employee_name>/skills",
    methods=["GET"]
)
def get_skills(employee_name):

    employee = current_app.mongo.db.employees.find_one(
        {"name": employee_name}
    )

    if not employee:

        return jsonify({
            "message": "Employee not found"
        }), 404

    return jsonify(
        employee.get(
            "skills",
            []
        )
    ), 200

@employee_bp.route(
    "/api/employees/skills",
    methods=["DELETE"]
)
def delete_skill():

    data = request.json

    employee_name = data["employee_name"]

    skill_name = data["skill_name"]

    employee = current_app.mongo.db.employees.find_one(
        {"name": employee_name}
    )

    if not employee:

        return jsonify({
            "message": "Employee not found"
        }), 404

    updated_skills = [

        skill

        for skill in employee.get(
            "skills",
            []
        )

        if skill["name"].lower()
        != skill_name.lower()

    ]

    current_app.mongo.db.employees.update_one(
        {"name": employee_name},
        {
            "$set": {
                "skills": updated_skills
            }
        }
    )

    return jsonify({
        "message":
        "Skill deleted successfully"
    }), 200