
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import "../Css/Dashboard.css";
import "../Css/Tasks.css";

function Tasks() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/profile",
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
            data.detail || "Failed to fetch profile"
          );
        }

        setProfile(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          f_name: data.f_name || "",
          l_name: data.l_name || "",
          mobile: data.mobile || "",
        });
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/profile",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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
          JSON.stringify(data) || "Failed to update profile"
        );
      }

      setProfile(data);
      setFormData({
        username: data.username || "",
        email: data.email || "",
        f_name: data.f_name || "",
        l_name: data.l_name || "",
        mobile: data.mobile || "",
      });

      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={logout} />

      <main className="dashboard-main tasks-container">
        <h1>My Profile</h1>

        {loading && (
          <p className="tasks-message">Loading profile...</p>
        )}

        {!loading && error && (
          <p className="tasks-message tasks-error">
            {error}
          </p>
        )}

        {message && (
          <p className="tasks-message">{message}</p>
        )}

        {!loading && profile && (
          <div className="task-card">
            {editing ? (
              <form onSubmit={handleSave}>
                <h2>Edit Profile</h2>

                <label>Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <label>First Name</label>
                <input
                  name="f_name"
                  value={formData.f_name}
                  onChange={handleChange}
                />

                <label>Last Name</label>
                <input
                  name="l_name"
                  value={formData.l_name}
                  onChange={handleChange}
                />

                <label>Mobile</label>
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />

                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setError("");
                    setFormData({
                      username: profile.username || "",
                      email: profile.email || "",
                      f_name: profile.f_name || "",
                      l_name: profile.l_name || "",
                      mobile: profile.mobile || "",
                    });
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h2>{profile.username}</h2>

                <p>
                  <strong>User ID:</strong> {profile.id}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {profile.email || "Not set"}
                </p>
                <p>
                  <strong>First Name:</strong>{" "}
                  {profile.f_name || "Not set"}
                </p>
                <p>
                  <strong>Last Name:</strong>{" "}
                  {profile.l_name || "Not set"}
                </p>
                <p>
                  <strong>Mobile:</strong>{" "}
                  {profile.mobile || "Not set"}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMessage("");
                    setEditing(true);
                  }}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Tasks;
