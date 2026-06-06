import { useEffect, useState } from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";
import "../styles/MySkills.css";

function MySkills() {

  const employeeName =
    localStorage.getItem("name");

  const [skills, setSkills] =
    useState([]);

  const [skillName, setSkillName] =
    useState("");

  const [rating, setRating] =
    useState(5);

  const [editingSkill, setEditingSkill] =
    useState(null);

  useEffect(() => {

    fetchSkills();

  }, []);

  const fetchSkills = async () => {

    const response = await fetch(
      `http://localhost:5000/api/employees/${employeeName}/skills`
    );

    const data =
      await response.json();

    setSkills(data);
  };

  const saveSkill = async () => {

    await fetch(
      "http://localhost:5000/api/employees/skills",
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          employee_name:
            employeeName,
          skill_name:
            skillName,
          rating:
            Number(rating)
        })
      }
    );

    fetchSkills();

    setSkillName("");

    setRating(5);

    setEditingSkill(null);
  };

  const deleteSkill =
    async (skill) => {

      const confirmDelete =
        window.confirm(
          `Delete ${skill.name}?`
        );

      if (!confirmDelete)
        return;

      await fetch(
        "http://localhost:5000/api/employees/skills",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            employee_name:
              employeeName,
            skill_name:
              skill.name
          })
        }
      );

      fetchSkills();
    };

  const editSkill =
    (skill) => {

      setEditingSkill(skill);

      setSkillName(
        skill.name
      );

      setRating(
        skill.rating
      );
    };

  return (
    <div className="skills-page">

      <EmployeeSidebar />

      <div className="skills-container">

        <h1>
          My Skills
        </h1>

        <table>

          <thead>
            <tr>
              <th>Skill</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {skills.map(
              (skill) => (

                <tr
                  key={skill.name}
                >
                  <td>
                    {skill.name}
                  </td>

                  <td>
                    {skill.rating}/5
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        editSkill(
                          skill
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteSkill(
                          skill
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>
                </tr>

              )
            )}

          </tbody>

        </table>

        <div className="skill-form">

          <h2>

            {editingSkill
              ? "Update Skill"
              : "Add Skill"}

          </h2>

          <input
            type="text"
            placeholder="Skill Name"
            value={skillName}
            onChange={(e) =>
              setSkillName(
                e.target.value
              )
            }
          />

          <select
            value={rating}
            onChange={(e) =>
              setRating(
                e.target.value
              )
            }
          >

            <option value="1">
              1
            </option>

            <option value="2">
              2
            </option>

            <option value="3">
              3
            </option>

            <option value="4">
              4
            </option>

            <option value="5">
              5
            </option>

          </select>

          <button
            onClick={saveSkill}
          >

            {editingSkill
              ? "Update Skill"
              : "Add Skill"}

          </button>

        </div>

      </div>

    </div>
  );
}

export default MySkills;