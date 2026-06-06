import { useEffect, useState } from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";

function MyProjects() {

  const employeeName =
    localStorage.getItem("name");

  const [projects, setProjects] =
    useState([]);

  useEffect(() => {

    fetchProjects();

  }, []);

  const fetchProjects =
    async () => {

      const response =
        await fetch(
          `http://localhost:5000/api/projects/employee/${employeeName}`
        );

      const data =
        await response.json();

      setProjects(data);
    };

  const ongoingProjects =
    projects.filter(
      (project) =>
        project.status === "ongoing"
    );

  const completedProjects =
    projects.filter(
      (project) =>
        project.status === "completed"
    );

  return (

    <div
      style={{
        display: "flex"
      }}
    >

      <EmployeeSidebar />

      <div
        style={{
          padding: "30px",
          width: "100%"
        }}
      >

        <h1>
          My Projects
        </h1>

        <h2
          style={{
            marginTop: "30px"
          }}
        >
          Ongoing Projects
        </h2>

        {ongoingProjects.length === 0 ? (

          <p>
            No Ongoing Projects
          </p>

        ) : (

          ongoingProjects.map(
            (project) => (

              <div
                key={project._id}
                style={{
                  background:
                    "white",
                  padding:
                    "20px",
                  borderRadius:
                    "10px",
                  marginBottom:
                    "15px",
                  boxShadow:
                    "0 2px 10px rgba(0,0,0,0.1)"
                }}
              >

                <h3>
                  {project.title}
                </h3>

                <p>
                  <strong>
                    Duration:
                  </strong>{" "}
                  {project.duration}
                  {" "}
                  Days
                </p>

                <p>
                  <strong>
                    Start Date:
                  </strong>{" "}
                  {project.start_date}
                </p>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  Ongoing
                </p>

              </div>

            )
          )

        )}

        <h2
          style={{
            marginTop: "40px"
          }}
        >
          Completed Projects
        </h2>

        {completedProjects.length === 0 ? (

          <p>
            No Completed Projects
          </p>

        ) : (

          completedProjects.map(
            (project) => (

              <div
                key={project._id}
                style={{
                  background:
                    "white",
                  padding:
                    "20px",
                  borderRadius:
                    "10px",
                  marginBottom:
                    "15px",
                  boxShadow:
                    "0 2px 10px rgba(0,0,0,0.1)"
                }}
              >

                <h3>
                  {project.title}
                </h3>

                <p>
                  <strong>
                    Duration:
                  </strong>{" "}
                  {project.duration}
                  {" "}
                  Days
                </p>

                <p>
                  <strong>
                    Start Date:
                  </strong>{" "}
                  {project.start_date}
                </p>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  Completed
                </p>

              </div>

            )
          )

        )}

      </div>

    </div>

  );
}

export default MyProjects;