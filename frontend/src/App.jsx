import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login/Login";
import Register from "./Login/Registration";
import Dashboard from "./Page/Dashboard";
import Profile from "./Page/Profile";
import Tasks from "./Components/Tasks";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/profile" element={<Profile />} />

      {/* Unknown URLs go back to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;