import { Link } from "react-router-dom";

function Sidebar({ isOpen }) {
  const style = {
    width: isOpen ? 240 : 60,
    background: "#f8f8f8",
    height: "100vh",
    transition: "width 0.2s",
    overflow: "hidden",
    padding: 10,
  };
  return (
    <nav style={style}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/">🏠 Home</Link></li>
        <li>📹 Shorts</li>
        <li>📺 Subscriptions</li>
      </ul>
    </nav>
  );
}
export default Sidebar;