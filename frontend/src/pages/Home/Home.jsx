import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Posts from "../../Components/Post/Posts";

import "./home.css";

import { isLogged } from "../../auth";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged()) {
      navigate("/");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("logged");
    navigate("/"); // login
  };

  return (
    <>
      <nav>
        <div className="container">
          <div className="navbar">
            <NavLink to="/home">
              <img src="images/icon-left-font.png" alt="" />
            </NavLink>
            <div>
              <button onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <Posts />
    </>
  );
}

export default Home;
