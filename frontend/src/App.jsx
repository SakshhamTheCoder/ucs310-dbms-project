import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";

const App = () => {

  return (
    <div className="flex flex-col min-h-screen md:h-screen p-4 md:p-8 text-primary">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
