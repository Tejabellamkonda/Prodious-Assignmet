import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/HomePage";
import LoginForm from "./components/LoginPage";
import RegisterForm from "./components/RegisterPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path="/login" element={<LoginForm />} />
      <Route exact path="/register" element={<RegisterForm />} />
      <Route exact path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

export default App;
