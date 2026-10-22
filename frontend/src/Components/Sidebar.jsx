import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../Css/Sidebar.css";

function Sidebar({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="hamburger"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="sidebar-logo">Task Manager</h2>

        <nav className="sidebar-nav">
          <NavLink to="/Dashboard" className="sidebar-link"
            onClick={() => setIsOpen(false)}>
            Dashboard
          </NavLink>

          <NavLink to="/Tasks" className="sidebar-link"
            onClick={() => setIsOpen(false)}>
            My Tasks
          </NavLink>

          <NavLink to="/Profile" className="sidebar-link"
            onClick={() => setIsOpen(false)}>
            Profile
          </NavLink>
        </nav>

        <button className="sidebar-logout" onClick={onLogout}>
          Logout
        </button>
      </aside>
    </>
  );
}

export default Sidebar;