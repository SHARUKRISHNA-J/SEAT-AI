import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeSidebar from "../components/EmployeeSidebar";

function EmployeeDashboard() {

  const employeeName =
    localStorage.getItem("name");

  const navigate =
    useNavigate();

  const [projects, setProjects] =
    useState([]);

  const [pendingFeedback,
    setPendingFeedback] =
    useState([]);

  useEffect(() => {

    fetchProjects();

    fetchPendingFeedback();

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

  const fetchPendingFeedback =
    async () => {

      const response =
        await fetch(
          `http://localhost:5000/api/feedback/pending/${employeeName}`
        );

      const data =
        await response.json();

      setPendingFeedback(data);
    };

  const currentProject =
    projects.find(
      (project) =>
        project.status === "ongoing"
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
          Welcome, {employeeName}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "30px"
          }}
        >

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "320px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.1)"
            }}
          >

            <h3>
              Current Project
            </h3>

            {currentProject ? (

              <>

                <p>
                  <strong>
                    {currentProject.title}
                  </strong>
                </p>

                <p>
                  Duration:{" "}
                  {currentProject.duration}
                  {" "}
                  Days
                </p>

                <p>
                  Start Date:{" "}
                  {currentProject.start_date}
                </p>

              </>

            ) : (

              <p>
                No Project Assigned
              </p>

            )}

          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "320px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.1)"
            }}
          >

            <h3>
              Project Status
            </h3>

            {currentProject ? (

              <p>
                Ongoing
              </p>

            ) : (

              <p>
                Available
              </p>

            )}

          </div>

        </div>

        {pendingFeedback.length > 0 && (

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "center",
              zIndex: 1000
            }}
          >

            <div
              style={{
                background:
                  "white",
                padding:
                  "30px",
                borderRadius:
                  "10px",
                width:
                  "400px",
                textAlign:
                  "center"
              }}
            >

              <h2>
                Feedback Required
              </h2>

              <p>
                You have pending feedback
                for completed projects.
              </p>

              <button
                onClick={() =>
                  navigate("/feedback")
                }
              >
                Fill Feedback
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default EmployeeDashboard;