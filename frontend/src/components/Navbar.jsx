import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Navbar = () => {
    const { isLoggedIn, user, logout, isAdmin } = useAuth();

    return (
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
            <h1 className="text-xl font-bold cursor-pointer">
                <Link to="/">Air Yatra</Link>
            </h1>
            {isLoggedIn ? (
                <div className="space-x-4">
                    <span className="text-white">Welcome, {user?.username} | </span>
                    
                    {isAdmin ? (
                        // Admin navigation links
                        <>
                            <Link to="/admin" className="hover:underline">Dashboard</Link>
                            <Link to="/admin/crew" className="hover:underline">Manage Crew</Link>
                        </>
                    ) : (
                        // Regular user navigation links
                        <>
                            <Link to="/flights" className="hover:underline">Flights</Link>
                            <Link to="/my-bookings" className="hover:underline">My Bookings</Link>
                        </>
                    )}
                    
                    <button onClick={logout} className="ml-4 px-3 py-1 bg-red-500 rounded">
                        Logout
                    </button>
                </div>
            ) : (
                <Link to="/login" className="hover:underline">Login</Link>
            )}
        </nav>
    );
};

export default Navbar;