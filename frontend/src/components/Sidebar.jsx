import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <h2>SEAT AI</h2>

      <ul>

        <li>
          <Link to="/admin">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/employees">
            Employee Details
          </Link>
        </li>

        <li>
          <Link to="/team-recommendation">
            Team Recommendation
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

export default Sidebar;