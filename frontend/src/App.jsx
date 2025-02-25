import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Flights from "./pages/Flights";
import MyBookings from "./pages/MyBookings";
import { useAuth } from "./utils/AuthContext";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";

const App = () => {
    const { isLoggedIn, loading } = useAuth();

    if (loading) return <></>;

    return (
        <div className="flex flex-col min-h-screen md:h-screen p-4 md:p-8">
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={isLoggedIn ? <Home /> : <Register />} />
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
                    <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
                    <Route path="/flights" element={isLoggedIn ? <Flights /> : <Navigate to="/login" />} />
                    <Route path="/my-bookings" element={isLoggedIn ? <MyBookings /> : <Navigate to="/login" />} />
                    <Route path="/admin" element={isLoggedIn ? <Admin /> : <Navigate to="/" />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;