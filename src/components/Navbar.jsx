import { NavLink, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import "../styles/Navbar.css"; // Import the CSS file for Navbar styles

const Navbar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const from = location?.pathname;
  return (
    <div className="navbar">
      <NavLink
        className={`nav-link ${from === "/categories" && "active-nav-link"} `}
        
        to="/categories"
      >
        Categories
      </NavLink>
      <NavLink
        className={`nav-link ${from === "/cars" && "active-nav-link"} `}
        
        to="/cars"
      >
        Cars
      </NavLink>
      <NavLink className="nav-link"  onClick={() => logout()}>
        Logout
      </NavLink>
    </div>
  );
};

export default Navbar;
