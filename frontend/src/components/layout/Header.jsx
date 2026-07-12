// components/layout/Header.jsx — pixel-perfect YT dark header
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth.js";

function Header({ onToggleSidebar, onSearch }) {
  const { isAuthed, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchVal.trim());
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const initials = user?.username?.[0]?.toUpperCase() || "U";
  const handle = user?.username ? `@${user.username}` : "";

  return (
    <header className="yt-header">
      {/* ... (the JSX remains exactly as you have it) ... */}
    </header>
  );
}

Header.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
};

Header.defaultProps = {
  onSearch: undefined,
};

export default Header;