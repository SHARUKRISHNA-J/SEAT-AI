from flask import Blueprint, request, jsonify, current_app
from rag.retriever import search_employees
from itertools import combinations
from utils.compatibility import get_compatibility_score

team_bp = Blueprint(
    "team_bp",
    __name__
)

@team_bp.route(
    "/api/recommend-team",
    methods=["POST"]
)
def recommend_team():

    data = request.json

    requirement = data["requirement"]
    team_size = data["team_size"]

    results = search_employees(
        requirement,
        n_results=10
    )

    employees = results["documents"]
    distances = results["distances"]

    print("Distances:", distances)

    available_team = []

    for emp, distance in zip(
        employees,
        distances
    ):

        lines = emp.split("\n")

        name = lines[1].replace(
            "Name: ",
            ""
        ).strip()

        employee = current_app.mongo.db.employees.find_one(
            {"name": name}
        )

        if employee and employee.get(
            "availability",
            True
        ):

            skill_score = round(
                max(0, (2 - distance) / 2 * 100),
                2
            )

            available_team.append({
                "name": name,
                "skill_score": skill_score
            })

    best_team = []
    best_score = -1
    best_skill_score = 0
    best_compatibility_score = 0

    for team in combinations(
        available_team,
        team_size
    ):

        compatibility_scores = []

        for emp1, emp2 in combinations(
            team,
            2
        ):

            score = get_compatibility_score(
                emp1["name"],
                emp2["name"]
            )

            compatibility_scores.append(score)

        if compatibility_scores:

            compatibility_score = round(
                sum(compatibility_scores)
                / len(compatibility_scores),
                2
            )

        else:
            compatibility_score = 0

        avg_skill_score = round(
            sum(
                member["skill_score"]
                for member in team
            ) / len(team),
            2
        )

        final_score = round(
            (
                avg_skill_score * 0.8
                +
                compatibility_score * 0.2
            ),
            2
        )

        if final_score > best_score:

            best_score = final_score

            best_team = [
                member["name"]
                for member in team
            ]

            best_skill_score = avg_skill_score
            best_compatibility_score = compatibility_score

    return jsonify({
        "requirement": requirement,
        "recommended_team": best_team,
        "skill_score": best_skill_score,
        "compatibility_score": best_compatibility_score,
        "final_score": best_score
    }), 200