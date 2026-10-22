
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import "../Css/Dashboard.css";

const API_BASE_URL = "http://127.0.0.1:8000";
const TASK_URL = `${API_BASE_URL}/task_view`;
const PROFILE_URL = `${API_BASE_URL}/profile`;

function Dashboard() {
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleUnauthorized = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/", { replace: true });
  };

  const getToken = () => localStorage.getItem("access_token");

  const readResponse = async (response) => {
    const text = await response.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { detail: text };
      }
    }

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      throw new Error(
        data.detail ||
          data.message ||
          JSON.stringify(data) ||
          "Request failed"
      );
    }

    return data;
  };

  // GET: Fetch tasks
  const fetchTasks = async (token) => {
    const response = await fetch(TASK_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await readResponse(response);

    const taskList = Array.isArray(data)
      ? data
      : Array.isArray(data.tasks)
        ? data.tasks
        : null;

    if (!taskList) {
      throw new Error("Invalid task list response from API.");
    }

    setTasks(taskList);
  };

  // Load username and tasks
  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      const token = getToken();

      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const savedUsername = localStorage.getItem("username");

        if (savedUsername && savedUsername !== "undefined") {
          if (!cancelled) setUsername(savedUsername);
        } else {
          const profileResponse = await fetch(PROFILE_URL, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const profile = await readResponse(profileResponse);

          if (profile.username && !cancelled) {
            setUsername(profile.username);
            localStorage.setItem("username", profile.username);
          }
        }

        const response = await fetch(TASK_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await readResponse(response);

        const taskList = Array.isArray(data)
          ? data
          : Array.isArray(data.tasks)
            ? data.tasks
            : null;

        if (!taskList) {
          throw new Error("Invalid task list response from API.");
        }

        if (!cancelled) setTasks(taskList);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load dashboard.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // POST: Create task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(TASK_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          due_date: dueDate || null,
        }),
      });

      const data = await readResponse(response);

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");

      // Refresh using GET, not POST
      await fetchTasks(token);

      setMessage(data.message || "Task created successfully!");
    } catch (err) {
      setError(err.message || "Failed to create task.");
    } finally {
      setSaving(false);
    }
  };

  // PATCH: Mark task as completed
  const handleCompleteTask = async (task) => {
    setError("");
    setMessage("");

    const token = getToken();
    const taskId = task.task_id ?? task.id;

    if (!token) {
      handleUnauthorized();
      return;
    }

    if (taskId == null) {
      setError("Task ID is missing from the API response.");
      return;
    }

    setCompletingId(taskId);

    try {
      const response = await fetch(
        `${TASK_URL}/${encodeURIComponent(taskId)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Completed",
          }),
        }
      );

      await readResponse(response);
      await fetchTasks(token);

      setMessage("Task marked as completed!");
    } catch (err) {
      setError(err.message || "Failed to complete task.");
    } finally {
      setCompletingId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/", { replace: true });
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={logout} />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome, {username || "User"}!</p>
        </header>

        <section className="dashboard-card">
          <h2>Create New Task</h2>

          <form onSubmit={handleCreateTask}>
            <label htmlFor="title">Task Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
            />

            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create Task"}
            </button>
          </form>
        </section>

        {error && (
          <p className="tasks-error" role="alert">
            {error}
          </p>
        )}

        {message && <p role="status">{message}</p>}

        <section className="dashboard-card">
          <h2>All Tasks ({tasks.length})</h2>

          {tasks.length === 0 ? (
            <p>No tasks found. Create your first task above.</p>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => {
                const taskId = task.task_id ?? task.id;

                const completed =
                  String(task.status || "").toLowerCase() === "completed";

                return (
                  <article className="task-card" key={taskId}>
                    <h3>{task.title}</h3>

                    <p>
                      <strong>Description:</strong>{" "}
                      {task.description || "No description"}
                    </p>

                    <p>
                      <strong>Priority:</strong>{" "}
                      {task.priority || "Medium"}
                    </p>

                    <p>
                      <strong>Due Date:</strong>{" "}
                      {task.due_date || "Not set"}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {task.status || "Pending"}
                    </p>

                    {!completed && (
                      <button
                        type="button"
                        disabled={completingId === taskId}
                        onClick={() => handleCompleteTask(task)}
                      >
                        {completingId === taskId
                          ? "Updating..."
                          : "Mark as Completed"}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
