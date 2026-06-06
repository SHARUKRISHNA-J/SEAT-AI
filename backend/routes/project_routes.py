from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from bson import ObjectId

project_bp = Blueprint(
    "project_bp",
    __name__
)

# Create Project
@project_bp.route(
    "/api/projects",
    methods=["POST"]
)
def create_project():

    data = request.json

    project = {

        "title":
            data["title"],

        "duration":
            data["duration"],

        "team_members":
            data["team_members"],

        "start_date":
            datetime.now(),

        "status":
            "ongoing"

    }

    result = (
        current_app.mongo.db.projects.insert_one(
            project
        )
    )

    # Mark employees as busy

    current_app.mongo.db.employees.update_many(

        {
            "name": {
                "$in":
                data["team_members"]
            }
        },

        {
            "$set": {
                "availability":
                False
            }
        }

    )

    return jsonify({

        "message":
            "Project created",

        "project_id":
            str(
                result.inserted_id
            )

    }), 201


# Get All Projects
@project_bp.route(
    "/api/projects",
    methods=["GET"]
)
def get_projects():

    projects = list(
        current_app.mongo.db.projects.find()
    )

    for project in projects:

        project["_id"] = str(
            project["_id"]
        )

        if "start_date" in project:

            project["start_date"] = (
                project["start_date"]
                .strftime("%Y-%m-%d")
            )

    return jsonify(projects), 200


# Mark Project Completed
@project_bp.route(
    "/api/projects/<project_id>/complete",
    methods=["PUT"]
)
def complete_project(project_id):

    project = (
        current_app.mongo.db.projects.find_one(
            {
                "_id":
                ObjectId(project_id)
            }
        )
    )

    if not project:

        return jsonify({
            "message":
            "Project not found"
        }), 404

    current_app.mongo.db.projects.update_one(

        {
            "_id":
            ObjectId(project_id)
        },

        {
            "$set": {
                "status":
                "completed"
            }
        }

    )

    # Mark employees available again

    current_app.mongo.db.employees.update_many(

        {
            "name": {
                "$in":
                project["team_members"]
            }
        },

        {
            "$set": {
                "availability":
                True
            }
        }

    )

    return jsonify({

        "message":
        "Project completed successfully"

    }), 200


# Get Employee Projects
@project_bp.route(
    "/api/projects/employee/<employee_name>",
    methods=["GET"]
)
def get_employee_projects(
    employee_name
):

    projects = list(
        current_app.mongo.db.projects.find(
            {
                "team_members":
                employee_name
            }
        )
    )

    for project in projects:

        project["_id"] = str(
            project["_id"]
        )

        if "start_date" in project:

            project["start_date"] = (
                project["start_date"]
                .strftime("%Y-%m-%d")
            )

    return jsonify(projects), 200