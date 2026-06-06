import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function EmployeeSidebar() {
  return (
    <div className="sidebar">

      <h2>SEAT AI</h2>

      <ul>

        <li>
          <Link to="/employee">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/my-skills">
            My Skills
          </Link>
        </li>

        <li>
          <Link to="/my-projects">
            My Projects
          </Link>
        </li>

        <li>
          <Link to="/feedback">
            Feedback
          </Link>
        </li>

        <button
  onClick={() => {

    localStorage.clear();

    window.location.href = "/";

  }}
>
  Logout
</button>

      </ul>

    </div>
  );
}

export default EmployeeSidebar;