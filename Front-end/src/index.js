import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import LearnerContextProvider from "./components/Context/LearnerContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <LearnerContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </LearnerContextProvider>
  </Router>
);
