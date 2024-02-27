import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import API_URL from "../constants"; 
import { ToastContainer,toast } from "react-toastify";
function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleApi = (e) => {
        e.preventDefault();
        const url = API_URL + '/login';
        const data = { username, password };
        axios.post(url, data)
            .then((res) => {
                toast("Login SucessFully",
                {
                    onClose:()=>navigate('/'),
                    autoClose:1500

                })
                if (res.data.message) {
                    if (res.data.token) {
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('userId', res.data.userId);
                        localStorage.setItem('userName', res.data.username);
                       
                    }
                }
            })
            .catch((err) => {
                alert('SERVER ERR');
            });
    };

    return (
        <div>
            <Header />
            <div className="p-3 m-3">
                <h3> Welcome to Login Page </h3>
                <br></br>
                <form onSubmit={handleApi}>
                    USERNAME
                    <input className="form-control" type="text" value={username} required title="Enter valid username"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }} />
                    <br></br>
                    PASSWORD
                    <input className="form-control" type="password" value={password} required title="Enter valid password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }} />
                    <br></br>
                    <button className="btn btn-primary mr-3" type="submit"> LOGIN </button>
                    <Link className="m-3" to="/signup"> SIGNUP </Link>
                </form>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default Login;
