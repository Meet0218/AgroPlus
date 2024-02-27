import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import API_URL from "../constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
function Signup() {
    const navigate=useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');

    const handleApi = (e) => {
        e.preventDefault();
        const url = API_URL + '/signup';
        const data = { username, password, mobile, email };
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    // console.log(res.data)
                    toast.success("User Added");
                }
            })
            .catch((err) => {
                toast.error('SERVER ERR');
            });
            navigate('/')
    };

    return (
        <div>
            <Header />
            <form onSubmit={handleApi}>
                <div className="p-3 m-3">
                    <h3> Welcome to Signup Page </h3>
                    <br></br>
                    USERNAME
                    <input className="form-control" type="text" required value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                    <br></br>
                    MOBILE
                    <input className="form-control" type="tel" required pattern="[0-9]{10}" title="Enter a 10-digit phone number" value={mobile}
                        onChange={(e) => setMobile(e.target.value)} />
                    <br></br>
                    EMAIL
                    <input className="form-control" type="email" required value={email} pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" title="Enter a valid email address"
                        onChange={(e) => setEmail(e.target.value)} />
                    <br></br>
                    PASSWORD
                    <input className="form-control" type="password" required minLength="8" value={password} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$" title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
                        onChange={(e) => setPassword(e.target.value)} />
                    <br></br>
                    <button className="btn btn-primary mr-3" type="submit"> SIGNUP </button>
                    <Link className="m-3" to="/login"> LOGIN </Link>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Signup;
