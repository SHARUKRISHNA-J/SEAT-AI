import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function EmployeeDetails() {

  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);

const [newEmployee, setNewEmployee] = useState({
  name: "",
  department: "",
  availability: true,
  skills: []
});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {

    const response = await fetch(
      "http://localhost:5000/api/employees"
    );

    const data = await response.json();

    setEmployees(data);
  };

  const deleteEmployee = async (
    id,
    name
  ) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmDelete) {
      return;
    }

    await fetch(
      `http://localhost:5000/api/employees/${id}`,
      {
        method: "DELETE"
      }
    );

    fetchEmployees();
  };
  const addEmployee = async () => {

  await fetch(
    "http://localhost:5000/api/employees",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newEmployee)
    }
  );

  setShowForm(false);

  setNewEmployee({
    name: "",
    department: "",
    availability: true,
    skills: []
  });

  fetchEmployees();
};

  return (
    <div
      style={{
        display: "flex"
      }}
    >

      <Sidebar />

      <div
        style={{
          padding: "30px",
          width: "100%"
        }}
      >

        <h1>Employee Details</h1>

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            background: "white",
            marginBottom: "20px"
          }}
        >

          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Skills</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {employees.map(
              (employee) => (

                <tr
                  key={employee._id}
                >

                  <td>
                    {employee.name}
                  </td>

                  <td>
                    {employee.department}
                  </td>

                  <td>
                    {
  employee.skills?.length > 0
    ? employee.skills
        .map(
          skill =>
            `${skill.name} (${skill.rating}/5)`
        )
        .join(", ")
    : "No Skills Added"
}
                  </td>

                  <td>
                    {employee.availability
                      ? "Available"
                      : "Busy"}
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        deleteEmployee(
                          employee._id,
                          employee.name
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

        <button
  onClick={() =>
    setShowForm(!showForm)
  }
>
  Add Employee
</button>
{showForm && (

  <div
    style={{
      marginTop: "20px",
      background: "white",
      padding: "20px",
      borderRadius: "10px"
    }}
  >

    <h2>Add Employee</h2>

    <input
      type="text"
      placeholder="Employee Name"
      value={newEmployee.name}
      onChange={(e) =>
        setNewEmployee({
          ...newEmployee,
          name: e.target.value
        })
      }
    />

    <br /><br />

    <input
      type="text"
      placeholder="Department"
      value={newEmployee.department}
      onChange={(e) =>
        setNewEmployee({
          ...newEmployee,
          department: e.target.value
        })
      }
    />

    <br /><br />

    <select
      value={newEmployee.availability}
      onChange={(e) =>
        setNewEmployee({
          ...newEmployee,
          availability:
            e.target.value === "true"
        })
      }
    >

      <option value="true">
        Available
      </option>

      <option value="false">
        Busy
      </option>

    </select>

    <br /><br />

    <button
      onClick={addEmployee}
    >
      Save Employee
    </button>

  </div>

)}

      </div>

    </div>
  );
}

export default EmployeeDetails;