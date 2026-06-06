import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeDetails from "./pages/EmployeeDetails";
import TeamRecommendation from "./pages/TeamRecommendation";
import MySkills from "./pages/MySkills";
import MyProjects from "./pages/MyProjects";
import MyFeedback from "./pages/MyFeedback";
import ProtectedRoute
from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
  path="/admin"
  element={
    <ProtectedRoute
      allowedRole="admin"
    >
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

        <Route
  path="/employee"
  element={
    <ProtectedRoute
      allowedRole="employee"
    >
      <EmployeeDashboard />
    </ProtectedRoute>
  }
/>

        <Route
  path="/employees"
  element={
    <ProtectedRoute
      allowedRole="admin"
    >
      <EmployeeDetails />
    </ProtectedRoute>
  }
/>

        <Route
  path="/team-recommendation"
  element={
    <ProtectedRoute
      allowedRole="admin"
    >
      <TeamRecommendation />
    </ProtectedRoute>
  }
/>
        <Route
  path="/my-skills"
  element={
    <ProtectedRoute
      allowedRole="employee"
    >
      <MySkills />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-projects"
  element={
    <ProtectedRoute
      allowedRole="employee"
    >
      <MyProjects />
    </ProtectedRoute>
  }
/>

<Route
  path="/feedback"
  element={
    <ProtectedRoute
      allowedRole="employee"
    >
      <MyFeedback />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;