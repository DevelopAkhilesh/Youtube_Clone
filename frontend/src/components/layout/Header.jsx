import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header style={{ display: "flex", alignItems: "center", padding: "10px 20px", borderBottom: "1px solid #ddd" }}>
      <button onClick={onToggleSidebar}>☰</button>
      <h2 style={{ marginLeft: 16 }}>YouTube Clone</h2>
      <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
        {user ? (
          <>
            <span>{user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
export default Header;