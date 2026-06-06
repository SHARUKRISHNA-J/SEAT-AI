import { useState } from "react";
import "../styles/TeamRecommendation.css";

function TeamRecommendation() {

  const [requirement, setRequirement] =
    useState("");

  const [teamSize, setTeamSize] =
    useState(2);

  const [result, setResult] =
    useState(null);

  const [showProjectForm,
    setShowProjectForm] =
    useState(false);

  const [projectTitle,
    setProjectTitle] =
    useState("");

  const [duration,
    setDuration] =
    useState("");

  const recommendTeam = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/recommend-team",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            requirement,
            team_size:
              Number(teamSize)
          })
        }
      );

      const data =
        await response.json();

      setResult(data);

      setShowProjectForm(false);

    } catch (error) {

      console.error(
        "Error:",
        error
      );

    }
  };

  const createProject =
    async () => {

      try {

        const response =
          await fetch(
            "http://localhost:5000/api/projects",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({

                title:
                  projectTitle,

                duration:
                  Number(duration),

                team_members:
                  result.recommended_team

              })

            }
          );

        const data =
          await response.json();

        alert(
          "Project Assigned Successfully"
        );

        console.log(data);

        setProjectTitle("");

        setDuration("");

        setShowProjectForm(false);

      } catch (error) {

        console.error(
          "Error:",
          error
        );

      }
    };

  return (
    <div className="container">

      <h1 className="title">
        SEAT AI
      </h1>

      <h2 className="title">
        Team Recommendation
      </h2>

      <div className="card">

        <div className="input-group">

          <label>
            Project Requirement
          </label>

          <input
            type="text"
            placeholder="Enter project requirement"
            value={requirement}
            onChange={(e) =>
              setRequirement(
                e.target.value
              )
            }
          />

        </div>

        <div className="input-group">

          <label>
            Team Size
          </label>

          <input
            type="number"
            min="2"
            value={teamSize}
            onChange={(e) =>
              setTeamSize(
                e.target.value
              )
            }
          />

        </div>

        <button
          className="btn"
          onClick={
            recommendTeam
          }
        >
          Recommend Team
        </button>

      </div>

      {result && (

        <div className="result-card">

          <h2>
            Recommended Team
          </h2>

          {result.recommended_team.map(
            (
              member,
              index
            ) => (

              <div
                key={index}
                className="member"
              >
                {member}
              </div>

            )
          )}

          <hr />

          <p>
            <strong>
              Skill Score:
            </strong>{" "}
            {result.skill_score}
          </p>

          <p>
            <strong>
              Compatibility Score:
            </strong>{" "}
            {
              result.compatibility_score
            }
          </p>

          <p>
            <strong>
              Final Score:
            </strong>{" "}
            {result.final_score}
          </p>

          <button
            className="btn"
            onClick={() =>
              setShowProjectForm(
                true
              )
            }
          >
            Assign Project
          </button>

          {showProjectForm && (

            <div
              className="project-form"
            >

              <h3>
                Assign Project
              </h3>

              <input
                type="text"
                placeholder="Project Title"
                value={
                  projectTitle
                }
                onChange={(e) =>
                  setProjectTitle(
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Duration (Days)"
                value={duration}
                onChange={(e) =>
                  setDuration(
                    e.target.value
                  )
                }
              />

              <button
                className="btn"
                onClick={
                  createProject
                }
              >
                Create Project
              </button>

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default TeamRecommendation;