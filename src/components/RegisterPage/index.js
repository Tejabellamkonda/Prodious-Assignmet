import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const RegisterForm = () => {
  const [name, setName] = useState("");
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

  const onChangename = (event) => {
    setName(event.target.value);
  };

  const onSubmitSuccess = () => {
    alert("Regitered Successfully Plese Login");
    navigate("/login");
  };

  const onSubmitFailure = (errorMsg) => {
    setshowSubmitError(true);
    setErrorMsg(errorMsg);
  };

  const submitForm = async (event) => {
    event.preventDefault();

    const userDetails = { name, email, password };
    console.log(userDetails);
    const url = "http://localhost:5002/register";
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
      console.log("ok");
      onSubmitSuccess();
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

  const renderNameField = () => {
    return (
      <>
        <label className="input-label" htmlFor="name">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          className="password-input-field"
          value={name}
          onChange={onChangename}
          placeholder="Full Name"
          required
        />
      </>
    );
  };

  return (
    <div className="login-form-container">
      <form className="form-container" onSubmit={submitForm}>
        <h1>Welcome</h1>
        <div className="input-container">{renderNameField()}</div>
        <div className="input-container">{renderUsernameField()}</div>
        <div className="input-container">{renderPasswordField()}</div>

        <button type="submit" className="login-button">
          Sign Up
        </button>

        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;
