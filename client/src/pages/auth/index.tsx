import React from "react";
import "./styles.css";
import { useState, SyntheticEvent } from "react"; 
import axios from "axios";
import { UserErrors } from "../../errors.ts";
export const AuthPage = () => {
    return <div className="auth">
        <Register/> <Login/>
    </div>;
};


const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const handleSubmit = async (event: SyntheticEvent) =>{
        event.preventDefault();

        try {
            await axios.post("http://localhost:3001/user/register", {
                fullName: username,
                password,
                email,
                phone,
                address
            });
            alert("Registration successful, Now you can login");
        } catch (error) {
            if(error?.response?.data?.type === UserErrors.USERNAME_ALREADY_EXISTS){
                alert("ERROR: Username already exists");
            }else{
                alert("ERROR: something went wrong");
            }
        }

    }


    return (<div className="auth-container">
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)}/>
            </div>
            <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input type="text" id="phone" value={phone} onChange={(event) => setPhone(event.target.value)}/>
            </div>
            <div className="form-group">
                <label htmlFor="address">Address:</label>
                <input type="text" id="address" value={address} onChange={(event) => setAddress(event.target.value)}/>
            </div>
            <button type="submit">Register</button>
        </form>
    </div>
    );
};
const Login = () => {
    return <div>login</div>; 
}