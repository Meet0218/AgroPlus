import { Link, NavLink, useNavigate } from "react-router-dom";
import "./styles/loginheader.css";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

function LoginHeader({ data }) {
  const [loc, setLoc] = useState("");
  const [showOver, setShowOver] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const locations = [
    { latitude: 28.6139, longitude: 77.209, placeName: "New Delhi, Delhi" },
    { latitude: 19.076, longitude: 72.8777, placeName: "Mumbai, Maharashtra" },
  ];

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="header-container">
      <div className="header">
        <Link className="links" to="/">
          <img src="/Images/logo.png" alt="Logo" />
        </Link>
        <select
          className="login-select"
          value={loc}
          onChange={(e) => {
            localStorage.setItem("userLoc", e.target.value);
            setLoc(e.target.value);
          }}
        >
          {locations.map((item, index) => (
            <option key={index} value={`${item.latitude},${item.longitude}`}>
              {item.placeName}
            </option>
          ))}
        </select>
        {data ? (
          <div>
            <div
              className="user-container"
              onClick={() => setShowOver(!showOver)}
            >
              <img
                src="/images/man.png"
                alt="User"
                className="login-header-image"
              />
            </div>
            {showOver && (
              <div className="dropdown-menu">
                {isLoggedIn && (
                  <>
                    <NavLink to="/add-product">ADD PRODUCT</NavLink>
                    <NavLink to="/liked-products">FAVOURITES</NavLink>
                    <NavLink to="/my-products">MY PRODUCTS</NavLink>
                    <NavLink to="/sold-product">SOLD PRODUCTS</NavLink>
                  </>
                )}
                {!isLoggedIn ? (
                  <NavLink to="/login">LOGIN</NavLink>
                ) : (
                  <button className="logout-btn" onClick={handleLogout}>
                    LOGOUT
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="navlink-container">
            <NavLink className="loginbtn" to="/login">
              Login
            </NavLink>
            <NavLink className="signupbtn" to="/signup">
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginHeader;
