import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const fetchProjects = async () => {
    const response = await fetch("http://localhost:5000/api/projects");
    const data = await response.json();
    setProjects(data);
  };

  const fetchEmployees = async () => {
    const response = await fetch("http://localhost:5000/api/employees");
    const data = await response.json();
    setEmployees(data);
  };

  const markCompleted = async (projectId) => {
    const confirmComplete = window.confirm("Mark this project as completed?");
    if (!confirmComplete) return;

    await fetch(`http://localhost:5000/api/projects/${projectId}/complete`, {
      method: "PUT",
    });

    fetchProjects();
    fetchEmployees();
  };

  const ongoingProjects = projects.filter(
    (project) => project.status === "ongoing"
  );
  const completedProjects = projects.filter(
    (project) => project.status === "completed"
  );
  const availableEmployees = employees.filter(
    (employee) => employee.availability === true
  );
  const busyEmployees = employees.filter(
    (employee) => employee.availability === false
  );

  // helper to reset other state when one card is clicked
  const showEmployees = (type) => {
    setSelectedEmployees(type);
    setSelectedSection(""); // clear project section
  };

  const showProjects = (type) => {
    setSelectedSection(type);
    setSelectedEmployees(""); // clear employee section
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "30px", width: "100%" }}>
        <h1>Admin Dashboard</h1>

        {/* Stats Section */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "30px",
            flexWrap: "wrap",
          }}
        >
          <div style={cardStyle}>
            <h3>Total Employees</h3>
            <h1>{employees.length}</h1>
          </div>

          <div
            onClick={() => showEmployees("available")}
            style={{ ...cardStyle, cursor: "pointer" }}
          >
            <h3>Available Employees</h3>
            <h1>{availableEmployees.length}</h1>
          </div>

          <div
            onClick={() => showEmployees("busy")}
            style={{ ...cardStyle, cursor: "pointer" }}
          >
            <h3>Busy Employees</h3>
            <h1>{busyEmployees.length}</h1>
          </div>

          <div
            onClick={() => showProjects("ongoing")}
            style={{
              ...cardStyle,
              cursor: "pointer",
              background: selectedSection === "ongoing" ? "#dbeafe" : "white",
            }}
          >
            <h3>Ongoing Projects</h3>
            <h1>{ongoingProjects.length}</h1>
          </div>

          <div
            onClick={() => showProjects("completed")}
            style={{
              ...cardStyle,
              cursor: "pointer",
              background: selectedSection === "completed" ? "#dbeafe" : "white",
            }}
          >
            <h3>Finished Projects</h3>
            <h1>{completedProjects.length}</h1>
          </div>
        </div>

        {/* Available Employees Section */}
        {selectedEmployees === "available" && (
          <>
            <h2 style={{ marginTop: "40px" }}>Available Employees</h2>
            {availableEmployees.length === 0 ? (
              <p>No Available Employees</p>
            ) : (
              <ul style={{ marginTop: "20px" }}>
                {availableEmployees.map((employee) => (
                  <li key={employee._id} style={listItemStyle}>
                    {employee.name}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Busy Employees Section */}
        {selectedEmployees === "busy" && (
          <>
            <h2 style={{ marginTop: "40px" }}>Busy Employees</h2>
            {busyEmployees.length === 0 ? (
              <p>No Busy Employees</p>
            ) : (
              <ul style={{ marginTop: "20px" }}>
                {busyEmployees.map((employee) => (
                  <li key={employee._id} style={listItemStyle}>
                    {employee.name}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Ongoing Projects Section */}
        {selectedSection === "ongoing" && (
          <>
            <h2 style={{ marginTop: "40px" }}>Ongoing Projects</h2>
            {ongoingProjects.length === 0 ? (
              <p>No Ongoing Projects</p>
            ) : (
              ongoingProjects.map((project) => (
                <div key={project._id} style={projectCardStyle}>
                  <h3>{project.title}</h3>
                  <p>
                    <strong>Team:</strong>{" "}
                    {project.team_members.join(", ")}
                  </p>
                  <p>
                    <strong>Duration:</strong> {project.duration} Days
                  </p>
                  <p>
                    <strong>Start Date:</strong> {project.start_date}
                  </p>
                  <button onClick={() => markCompleted(project._id)}>
                    Mark Completed
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {/* Completed Projects Section */}
        {selectedSection === "completed" && (
          <>
            <h2 style={{ marginTop: "40px" }}>Finished Projects</h2>
            {completedProjects.length === 0 ? (
              <p>No Finished Projects</p>
            ) : (
              completedProjects.map((project) => (
                <div key={project._id} style={projectCardStyle}>
                  <h3>{project.title}</h3>
                  <p>
                    <strong>Team:</strong>{" "}
                    {project.team_members.join(", ")}
                  </p>
                  <p>✅ Completed</p>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "220px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const projectCardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "15px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const listItemStyle = {
  background: "white",
  padding: "10px",
  borderRadius: "6px",
  marginBottom: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  listStyle: "none",
};

export default AdminDashboard;
