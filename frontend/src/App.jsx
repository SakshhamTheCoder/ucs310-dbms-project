import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useAuth } from "./utils/AuthContext";
import Register from "./pages/Register";

const App = () => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) {
    return <></>;
  }
  return (
    <div className="flex flex-col min-h-screen md:h-screen p-4 md:p-8">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Home /> : <Register />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
