import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2 className="logo">🪖 MAMS</h2>

      {/* 👤 User Info */}
      <div className="user-info">
        <p className="username">{user?.name}</p>
        <p className="role">{role?.toUpperCase()}</p>
      </div>

      <nav>
        <Link to="/">Dashboard</Link>

        {/* 👇 Role Based Menu */}
        {(role === "admin" || role === "manager") && (
          <Link to="/equipment">Equipment</Link>
        )}

        {role === "admin" && (
          <Link to="/inventory">Inventory</Link>
        )}
    

              {role === "admin" && (
          <Link to="/purchase">Purchase</Link>
        )}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;