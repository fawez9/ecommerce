<<<<<<< HEAD
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
=======
import { useState } from "react";

import "./style.css";

export const AuthPage = () => {
  const [isRegisterForm, setIsRegisterForm] = useState(false);

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2 className={!isRegisterForm ? "active" : "inactive"} onClick={() => setIsRegisterForm(false)}>
          Login
        </h2>
        <h2 className={isRegisterForm ? "active" : "inactive"} onClick={() => setIsRegisterForm(true)}>
          Register
        </h2>
      </div>
      {isRegisterForm ? <RegisterForm /> : <LoginForm />}
    </div>
  );
};

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="auth-form">
      <div className="form-group">
        <label htmlFor="email">E-mail *</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Mot de passe *</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="form-actions">
        <button type="submit">Login →</button>
      </div>
    </form>
  );
};

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="auth-form">
      <div className="form-group">
        <label htmlFor="email">E-mail *</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Mot de passe *</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="form-actions">
        <button type="submit">Register →</button>
      </div>
    </form>
  );
};
>>>>>>> upstream/master
