import { Link, useNavigate } from "react-router-dom";
import "./styles/header.css";
import { FaSearch } from "react-icons/fa";
import { useState, React } from "react";

function Header(props) {
  const [loc, setLoc] = useState("");
  const [showOver, setShowOver] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  let locations = [
    { latitude: 28.6139, longitude: 77.209, placeName: "New Delhi, Delhi" },
    { latitude: 19.076, longitude: 72.8777, placeName: "Mumbai, Maharashtra" },
    // Additional locations can be added here
  ];

  return (
    <div className="header-container">
      <div className="header">
        <Link className="links" to="/">
          {" "}
          <img src="/Images/logo.png" alt="Logo" />
        </Link>
        {!props.item && (
          <div className="search-container">
            <select
              value={loc}
              onChange={(e) => {
                localStorage.setItem("userLoc", e.target.value);
                setLoc(e.target.value);
              }}
            >
              {locations.map((item, index) => (
                <option
                  key={index}
                  value={`${item.latitude},${item.longitude}`}
                >
                  {item.placeName}
                </option>
              ))}
            </select>
            <input
              className="search"
              type="text"
              onChange={(e) =>
                props.handlesearch && props.handlesearch(e.target.value)
              }
            />
            <button
              className="search-btn"
              onClick={() => props.handleClick && props.handleClick()}
            >
              <FaSearch />
            </button>
          </div>
        )}
      </div>
      <div>
        <div onClick={() => setShowOver(!showOver)} className="profile-icon">
          N
        </div>
        {showOver && (
          <div className="overlay-menu">
            {!!localStorage.getItem("token") && (
              <Link to="/add-product">
                <button className="logout-btn">ADD PRODUCT</button>
              </Link>
            )}
            {!!localStorage.getItem("token") && (
              <Link to="/liked-products">
                <button className="logout-btn">FAVOURITES</button>
              </Link>
            )}
            {!!localStorage.getItem("token") && (
              <Link to="/sold-product">
                <button className="logout-btn">SOLD PRODUCT</button>
              </Link>
            )}
            {!!localStorage.getItem("token") && (
              <Link to="/my-products">
                <button className="logout-btn">MY ADS</button>
              </Link>
            )}
            {!localStorage.getItem("token") ? (
              <Link to="/login">LOGIN</Link>
            ) : (
              <button className="logout-btn" onClick={handleLogout}>
                LOGOUT
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
