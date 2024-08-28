<<<<<<< HEAD

=======
>>>>>>> d30f7af (update)
import "./style.css";
import { useState, SyntheticEvent} from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { UserErrors } from "../../errors";
export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
<<<<<<< HEAD
      <div className="auth">
          <div className="tabs">
              <button
                  className={`tab ${isLogin ? "active" : ""}`}
                  onClick={() => setIsLogin(true)}
              >
                  S'identifier
              </button>
              <button
                  className={`tab ${!isLogin ? "active" : ""}`}
                  onClick={() => setIsLogin(false)}
              >
                  S'inscrire
              </button>
          </div>
          {isLogin ? <Login /> : <Register />}
      </div>

=======
    <div className="auth">
      <div className="tabs">
        <button className={`tab ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>
          S'identifier
        </button>
        <button className={`tab ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>
          S'inscrire
        </button>
      </div>
      {isLogin ? <Login /> : <Register />}
    </div>
>>>>>>> d30f7af (update)
  );
};

const Register = () => {
<<<<<<< HEAD

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
            }else if (error?.response?.data?.type === UserErrors.EMAIL_TAKEN){ 
                alert("ERROR: Email already taken");
            }else if(error?.response?.data?.type === UserErrors.PHONE_TAKEN){
                alert("ERROR: Phone already taken");
            }
        }

=======
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
>>>>>>> d30f7af (update)

    try {
      await axios.post("http://localhost:3001/user/register", {
        fullName: username,
        password,
        email,
        phone,
        address,
      });
      alert("Registration successful, Now you can login");
    } catch (error) {
      if (error?.response?.data?.type === UserErrors.USERNAME_ALREADY_EXISTS) {
        alert(UserErrors.USERNAME_ALREADY_EXISTS);
      } else if (error?.response?.data?.type === UserErrors.EMAIL_TAKEN) {
        alert(UserErrors.EMAIL_TAKEN);
      } else if (error?.response?.data?.type === UserErrors.PHONE_TAKEN) {
        alert(UserErrors.PHONE_TAKEN);
      } else {
        alert("ERROR: Something went wrong");
      }
    }



    return (<div className="auth-container">
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">Username:<span className="required">*</span></label>
                <input type="text" id="username" value={username} required onChange={(event) => setUsername(event.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:<span className="required">*</span></label>
                <input type="password" id="password" value={password} required onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:<span className="required">*</span></label>
                <input type="email" id="email" value={email} required onChange={(event) => setEmail(event.target.value)}/>
            </div>
            <div className="form-group">
                <label htmlFor="phone">Phone:<span className="required">*</span></label>
                <input type="text" id="phone" value={phone} required onChange={(event) => setPhone(event.target.value)}/>
            </div>
            <div className="form-group">
                <label htmlFor="address">Address:</label>
                <input type="text" id="address" value={address} onChange={(event) => setAddress(event.target.value)}/>
            </div>
            <button type="submit" className="auth-button">Register</button>
        </form>
    </div>
    );
};
const Login = () => {
  const [_, setCookies] = useCookies(["access_token"]);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);
      navigate("/");
    } catch (err) {
      let errorMessage: string = "";
      switch (err.response.data.type) {
        case UserErrors.USERNAME_ALREADY_EXISTS:
          errorMessage = "User already exists";
          break;
        case UserErrors.WRONG_CREDENTIALS:
          errorMessage = "Wrong username/password combination";
          break;
        default:
          errorMessage = "Something went wrong";
      }

      alert("ERROR: " + errorMessage);
    }
  };

  return (
<<<<<<< HEAD
    <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="email">Username *</label>
            <input type="text" id="username" required />
        </div>
        <div className="form-group">
            <label htmlFor="password">Mot de passe *</label>
            <input type="password" id="password" required />
        </div>
        <button type="submit" className="auth-button">
            Connexion 
        </button>
        <a href="#" className="forgot-password">
            Mot de passe oublié?
        </a>
    </form>
);

=======
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">
            Username:<span className="required">*</span>
          </label>
          <input type="text" id="username" value={username} required onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Password:<span className="required">*</span>
          </label>
          <input type="password" id="password" value={password} required onChange={(event) => setPassword(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="email">
            Email:<span className="required">*</span>
          </label>
          <input type="email" id="email" value={email} required onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="phone">
            Phone:<span className="required">*</span>
          </label>
          <input type="text" id="phone" value={phone} required onChange={(event) => setPhone(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input type="text" id="address" value={address} onChange={(event) => setAddress(event.target.value)} />
        </div>
        <button type="submit" className="auth-button">
          Register
        </button>
      </form>
    </div>
  );
};
const Login = () => {
  const [_, setCookies] = useCookies(["access_token"]);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/user/login", {
        fullName: username,
        password,
      });

      setCookies("access_token", result.data.token);
      localStorage.setItem("userID", result.data.userID);
      navigate("/");
    } catch (err) {
      let errorMessage: string = "";
      switch (err.response.data.type) {
        case UserErrors.NO_USER_FOUND:
          errorMessage = "User doesn't exists";
          break;
        case UserErrors.WRONG_CREDENTIALS:
          errorMessage = "Wrong username/password combination";
          break;
        default:
          errorMessage = "Something went wrong";
      }

      alert("ERROR: " + errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button type="submit" className="auth-button">
          Connexion
        </button>
        <a href="#" className="forgot-password">
          Mot de passe oublié?
        </a>
      </form>
    </div>
  );
>>>>>>> d30f7af (update)
};
