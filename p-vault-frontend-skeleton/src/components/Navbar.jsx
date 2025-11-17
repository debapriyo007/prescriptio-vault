import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { doctor, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest("button[data-logout]")) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    toast.success("Successfully logged out!");
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-primary-600 font-semibold"
      : "text-gray-700 hover:text-primary-600";

  const getInitial = () =>
    doctor?.name ? doctor.name.charAt(0).toUpperCase() : "D";

  return (
    <nav className="bg-white shadow border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <Link to="/" className="text-xl font-bold text-gray-800">
              PrescriptoVault
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${isActive("/")} transition`}>
              Home
            </Link>
            <Link
              to="/patient-prescription"
              className={`${isActive("/patient-prescription")} transition`}
            >
              Patient Prescription
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/doctor/dashboard"
                  className={`${isActive("/doctor/dashboard")} transition`}
                >
                  Dashboard
                </Link>
                <div className="relative z-50" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen((o) => !o)}
                    className="w-10 h-10 bg-primary-600 rounded-full text-white flex items-center justify-center focus:outline-none"
                    title={`Dr. ${doctor.name}`}
                  >
                    {getInitial()}
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow border z-50">
                      <div className="p-4 border-b">
                        <p className="font-medium">Dr. {doctor.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {doctor.email}
                        </p>
                      </div>
                      <button
                        data-logout="true"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/doctor/login"
                className="px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Doctor Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              className="p-2 rounded focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="bg-white px-2 py-3 space-y-1">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full px-3 py-2 rounded ${isActive("/")}`}
            >
              Home
            </Link>
            <Link
              to="/patient-prescription"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full px-3 py-2 rounded ${isActive(
                "/patient-prescription"
              )}`}
            >
              Patient Prescription
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/doctor/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block w-full px-3 py-2 rounded ${isActive(
                    "/doctor/dashboard"
                  )}`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/doctor/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-3 py-2 bg-primary-600 text-white rounded text-center"
              >
                Doctor Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
