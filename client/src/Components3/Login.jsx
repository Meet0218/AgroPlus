import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import LoginHeader from "./LoginHeader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleApi = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/login", { email, password });
      if (res.data.message && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        toast.success("Login Successful", {
          onClose: () => navigate("/"),
          autoClose: 1500,
        });
      } else {
        toast.error("Invalid Credentials");
      }
    } catch {
      toast.error("Server Error");
    }
  };

  return (
    <div className="box3">
      <LoginHeader />
      <div className="loginform3">
        <img className="logo3" src="images/Secure login-bro.png" alt="Login" />
        <h3 className="login-title3">Welcome to Login Page</h3>
        <form className="login-form3" onSubmit={handleApi}>
          <label>Email*</label>
          <input
            className="userinput3"
            type="text"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password*</label>
          <input
            className="userinput3"
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-btn3">LOGIN</button>
          <p className="newuser3">
            New User?{" "}
            <NavLink className="signup-link3" to="/signup">
              Sign Up
            </NavLink>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
