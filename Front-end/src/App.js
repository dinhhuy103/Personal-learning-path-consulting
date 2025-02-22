import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import User from "./pages/User/User";
import Career from "./pages/Career/Career";
import Course from "./pages/Course/Course";
import LearningObject from "./pages/LearningObject/LearningObject";
import Login from "./pages/Account/Login";
import Register from "./pages/Account/Register";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    // <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/user" element={<User />}></Route>
                <Route path="/career" element={<Career />}></Route>
                <Route path="/course" element={<Course />}></Route>
                <Route
                  path="/learning-object"
                  element={<LearningObject />}
                ></Route>
              </Routes>
            </>
          }
        ></Route>

        <Route path="/" index element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    // </Router>
  );
}

export default App;
