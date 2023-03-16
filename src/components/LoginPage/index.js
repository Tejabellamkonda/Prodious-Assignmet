import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./index.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSubmitError, setshowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const onChangeUsername = (event) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitSuccess = (jwtToken) => {
    console.log(jwtToken);

    Cookies.set("jwt_token", jwtToken, {
      expires: 30,
    });
    navigate("/");
  };

  const onSubmitFailure = (errorMsg) => {
    setshowSubmitError(true);
    setErrorMsg(errorMsg);
  };

  const submitForm = async (event) => {
    event.preventDefault();

    const userDetails = { email, password };
    console.log(userDetails);
    const url = "http://localhost:5002/login";
    const options = {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, options);
    console.log(response);
    const data = await response.json();
    console.log(data);
    if (response.status === 201) {
      onSubmitSuccess(data.token);
    } else {
      onSubmitFailure(data.message);
    }
  };

  const renderPasswordField = () => {
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={onChangePassword}
          placeholder="Password"
          required
        />
      </>
    );
  };

  const renderUsernameField = () => {
    return (
      <>
        <label className="input-label" htmlFor="username">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="username-input-field"
          value={email}
          onChange={onChangeUsername}
          placeholder="Email Address"
          required
        />
      </>
    );
  };

  const onClickRegister = () => {
    navigate("/register");
  };

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="login-form-container">
      <form className="form-container" onSubmit={submitForm}>
        <h1>Welcome</h1>

        <div className="input-container">{renderUsernameField()}</div>
        <div className="input-container">{renderPasswordField()}</div>

        <button type="submit" className="login-button">
          Login
        </button>
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
      </form>

      <button type="button" className="login-button" onClick={onClickRegister}>
        Register
      </button>
    </div>
  );
};

export default LoginForm;
