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