import { useEffect, useState } from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";

function MyFeedback() {

  const employeeName =
    localStorage.getItem("name");

  const [pendingProjects,
    setPendingProjects] =
    useState([]);

  const [ratings,
    setRatings] =
    useState({});

  const [comments,
    setComments] =
    useState({});

  useEffect(() => {
    fetchPendingFeedback();
  }, []);

  const fetchPendingFeedback =
    async () => {

      const response =
        await fetch(
          `http://localhost:5000/api/feedback/pending/${employeeName}`
        );

      const data =
        await response.json();

      setPendingProjects(data);
    };

  const submitFeedback =
    async (
      projectTitle,
      teammate
    ) => {

      const key =
        `${projectTitle}-${teammate}`;

      if (!ratings[key]) {

        alert(
          "Please select a rating"
        );

        return;
      }

      const response =
        await fetch(
          "http://localhost:5000/api/feedback",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              project_title:
                projectTitle,

              from_employee:
                employeeName,

              to_employee:
                teammate,

              rating:
                Number(
                  ratings[key]
                ),

              comment:
                comments[key] || ""

            })

          }
        );

      const data =
        await response.json();

      alert(data.message);

      fetchPendingFeedback();
    };

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
          Pending Feedback
        </h1>

        {pendingProjects.length === 0 ? (

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px"
            }}
          >
            <h3>
              No Pending Feedback
            </h3>
          </div>

        ) : (

          pendingProjects.map(
            (project, index) => (

              <div
                key={index}
                style={{
                  background:
                    "white",
                  padding:
                    "20px",
                  marginBottom:
                    "20px",
                  borderRadius:
                    "10px",
                  boxShadow:
                    "0 2px 10px rgba(0,0,0,0.1)"
                }}
              >

                <h2>
                  {
                    project.project_title
                  }
                </h2>

                {project.teammates.map(
                  (
                    teammate,
                    idx
                  ) => {

                    const key =
                      `${project.project_title}-${teammate}`;

                    return (

                      <div
                        key={idx}
                        style={{
                          marginBottom:
                            "20px",
                          borderTop:
                            "1px solid #ddd",
                          paddingTop:
                            "15px"
                        }}
                      >

                        <h3>
                          Rate{" "}
                          {teammate}
                        </h3>

                        <select
                          value={
                            ratings[key]
                              || ""
                          }
                          onChange={(
                            e
                          ) =>
                            setRatings({
                              ...ratings,
                              [key]:
                                e.target
                                  .value
                            })
                          }
                        >

                          <option value="">
                            Select Rating
                          </option>

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

                        <br />
                        <br />

                        <textarea
                          rows="3"
                          placeholder="Comment"
                          value={
                            comments[key]
                              || ""
                          }
                          onChange={(
                            e
                          ) =>
                            setComments({
                              ...comments,
                              [key]:
                                e.target
                                  .value
                            })
                          }
                          style={{
                            width:
                              "300px"
                          }}
                        />

                        <br />
                        <br />

                        <button
                          onClick={() =>
                            submitFeedback(
                              project.project_title,
                              teammate
                            )
                          }
                        >
                          Submit Feedback
                        </button>

                      </div>

                    );
                  }
                )}

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}

export default MyFeedback;