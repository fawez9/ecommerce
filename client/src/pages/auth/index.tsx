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
