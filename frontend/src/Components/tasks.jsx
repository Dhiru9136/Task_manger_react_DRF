import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import "../Css/Dashboard.css";
function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Logout function
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");

    navigate("/", { replace: true });
  };

  // Get all tasks from Django API
  useEffect(() => {
    const getTasks = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/task_view",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");

          navigate("/", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to fetch tasks"
          );
        }

        const taskList = Array.isArray(data)
          ? data
          : Array.isArray(data.tasks)
            ? data.tasks
            : [];

        setTasks(taskList);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, [navigate]);

return (
  <div className="dashboard-layout">
    <Sidebar onLogout={logout} />

    <main className="dashboard-main tasks-container">
      <h1>All Tasks</h1>

      {loading && <p className="tasks-message">Loading tasks...</p>}

      {!loading && error && (
        <p className="tasks-message tasks-error">Error: {error}</p>
      )}

      {!loading && !error && tasks.length === 0 && (
        <p className="tasks-message">No tasks found.</p>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div className="task-card" key={task.task_id}>
              <h2>{task.title}</h2>
              <p><strong>Description:</strong> {task.description || "No description"}</p>
              <p><strong>Status:</strong> <span className="task-label">{task.status}</span></p>
              <p><strong>Priority:</strong> <span className="task-label">{task.priority}</span></p>
              <p><strong>Due Date:</strong> {task.due_date || "Not set"}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  </div>
);
}

export default Tasks;
