import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    const response = await fetch(
      "http://localhost:5000/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data = await response.json();

    if (!data.success) {

      alert("Invalid Credentials");

      return;
    }

    localStorage.setItem(
  "username",
  data.username
);

localStorage.setItem(
  "name",
  data.name
);

localStorage.setItem(
  "role",
  data.role
);
    if (data.role === "admin") {

      navigate("/admin");

    } else {

      navigate("/employee");

    }
  };

  return (
    <div className="login-container">

      <h1 className="title">
        SEAT AI
      </h1>

      <p className="subtitle">
        Smart Employee Assignment Tool
      </p>

      <div className="login-card">

        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br /><br />

        <button
          className="login-btn"
          onClick={login}
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;