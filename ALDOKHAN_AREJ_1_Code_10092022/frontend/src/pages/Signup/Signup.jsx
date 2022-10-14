import React from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import "./sign.css";
import { useEffect } from "react";

import { isLogged } from "../../auth";

function Signup() {
  const navigate = useNavigate();


  useEffect(() => {
    if (isLogged()) {
      navigate("/home");
    }
  }, []);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const Submit = async (e) => {
    e.preventDefault();
    if (
      form.firstName === "" ||
      form.lastName === "" ||
      form.email === "" ||
      form.password === ""
    ) {
      alert("Please Fill The Form");
    } else {
      const data = await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );
      setMsg(data.data.message);
      console.log(data)
    }
  };

  return (
    <div className="sign">
      <div className="container">
        <div className="sign-content">
          <img src="images/icon-left-font.png" alt="Not found" />
          <h2>SignUp</h2>

          {msg && <div>{msg}</div>}
          <form onSubmit={Submit}>
            <input
              type="text"
              placeholder="firstName"
              onChange={(e) => {
                setForm({ ...form, firstName: e.target.value });
              }}
            />
            <input
              type="text"
              placeholder="lastName"
              onChange={(e) => {
                setForm({ ...form, lastName: e.target.value });
              }}
            />
            <input
              type="email"
              placeholder="email"
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
              }}
            />
            <input
              type="password"
              placeholder="password"
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
              }}
            />
            <button type="submit">Signup</button>
          </form>
          <span>
            have account <NavLink to="/">Login</NavLink>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
