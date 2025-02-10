import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const loggedInUserName = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(""); // Track the active link

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLinkClick = (link) => {
    setActiveLink(link); // Update the active link
  };

  const getLinkStyle = (link) => ({
    color: activeLink === link ? "#1D4ED8" : "#4B5563", // Change color if active
    textDecoration: activeLink === link ? "underline" : "none", // Underline if active
    textDecorationThickness: "1px", // Adjust the thickness of the underline
    textUnderlineOffset: "8px", // Adds gap between text and underline
  });

  return (
    <nav
      className="navbar navbar-expand-lg  "
      style={{
        paddingLeft: "10rem",
        height: "4.3rem",

        backgroundColor: "white",

        borderBottom: "1px solid #eaeaea", // Light gray border
      }}
    >
      <div className="container-fluid mx-auto ">
        <Link
          className="navbar-brand"
          to="#"
          style={{
            fontFamily: "sans-serif",
            color: "#11827",
            fontWeight: 600,
          }}
        >
          LexAI Assistant
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse " id="navbarNav">
          <ul
            className="navbar-nav mx-auto"
            style={{ fontFamily: "sans-serif" }}
          >
            {user ? (
              <>
                <li className="nav-item " style={{ marginTop: "0rem" }}>
                  <Link
                    className="nav-link"
                    to="/research"
                    style={getLinkStyle("research")}
                    onClick={() => handleLinkClick("research")}
                  >
                    <i
                      className="fa-solid fa-magnifying-glass mx-1 "
                      style={{
                        color: activeLink === "research" ? "#1D4ED8" : "gray",
                        marginRight: "0.3rem",
                      }}
                    ></i>
                    Research
                  </Link>
                </li>
                <li className="nav-item ">
                  <Link
                    className="nav-link active"
                    to="/notes"
                    style={getLinkStyle("notes")}
                    onClick={() => handleLinkClick("notes")}
                  >
                    <i
                      className="fa-solid fa-note-sticky mx-1"
                      style={{
                        color: activeLink === "notes" ? "#1D4ED8" : "gray",
                      }}
                    ></i>
                    My Notes
                  </Link>
                </li>
                <li className="nav-item ">
                  <Link
                    className="nav-link active"
                    to="/template"
                    style={getLinkStyle("template")}
                    onClick={() => handleLinkClick("template")}
                  >
                    <i
                      className="fa-solid fa-clipboard mx-1 "
                      style={{
                        color: activeLink === "template" ? "#1D4ED8" : "gray",
                      }}
                    ></i>
                    Templates
                  </Link>
                </li>
                <li className="nav-item   ">
                  <Link
                    className="nav-link active"
                    to="/client"
                    style={getLinkStyle("client")}
                    onClick={() => handleLinkClick("client")}
                  >
                    <i
                      className="fa-solid fa-user mx-1"
                      style={{
                        color: activeLink === "client" ? "#1D4ED8" : "gray",
                        marginRight: "4px",
                      }}
                    ></i>
                    Clients
                  </Link>
                </li>
                <li className="nav-item ">
                  <Link
                    className="nav-link active"
                    to="/calendar"
                    style={getLinkStyle("calendar")}
                    onClick={() => handleLinkClick("calendar")}
                  >
                    <i
                      className="fa-regular fa-calendar-days mx-1 "
                      style={{
                        color: activeLink === "calendar" ? "#1D4ED8" : "gray",
                        marginRight: "0.3rem",
                      }}
                    ></i>
                    Calendar
                  </Link>
                </li>
                <li className="nav-item ">
                  <Link
                    className="nav-link active"
                    to="/email"
                    style={getLinkStyle("email")}
                    onClick={() => handleLinkClick("email")}
                  >
                    <i
                      className="fa-solid fa-envelope mx-1"
                      style={{
                        color: activeLink === "email" ? "#1D4ED8" : "gray",
                      }}
                    ></i>
                    Email
                  </Link>
                </li>
                <div
                  className="dropdown"
                  style={{
                    marginLeft: "13rem",
                  }}
                >
                  <Link
                    className="btn btn-secondary "
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      backgroundColor: "white",

                      border: "none",
                    }}
                  >
                    <i
                      className="fa-solid fa-gear "
                      style={{
                        color: "black",
                        fontSize: "1.3rem",
                        marginTop: "0.3rem",
                      }}
                    ></i>
                  </Link>

                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={handleLogout}
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <li className="nav-item"></li>
            )}
          </ul>
          {user && (
            <div className="d-flex align-items-center">
              <div
                className="border"
                style={{
                  marginRight: "10rem",
                  borderRadius: "1rem",
                  backgroundColor: "#F5F5F5",
                }}
              >
                <img
                  src={loggedInUserName.user.profilePic || "https://via.placeholder.com/40"} 
                  alt="Profile"
                  className="rounded-circle "
                  style={{
                    width: "40px",
                    height: "38px",
                    objectFit: "cover",
                  }}
                />
                <span className="me-3 mx-2">{user.name}</span>
              </div>

              {console.log(user.profilePic)}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
