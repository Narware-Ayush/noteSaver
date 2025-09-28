import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./component/Auth";
import Dashboard from "./component/Dashboard";

const App = () => {
  
const token=JSON.parse(localStorage.getItem("usernote")|| 'false');
console.log(token)
 const isLoggedIn =token;
 //!!localStorage.getItem("user"); 
  return (
    <Router>
      <Routes>
        {/* Login / Signup route */}
        <Route 
          path="/login" 
          element= {<Auth/>}
        />

        {/* Dashboard route */}
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
        />

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;

