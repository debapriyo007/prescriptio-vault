import LoadingSpinner from "../components/LoadingSpinner";
import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../utils/api";

const DoctorLogin = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = isLogin ? authAPI.login : authAPI.register;
      const response = await endpoint(formData);
      if (response.data.token) {
        const doctorData = {
          email:
            response.data.email || response.data.user?.email || formData.email,
          name:
            response.data.name ||
            response.data.user?.name ||
            formData.name ||
            "Doctor",
          id: response.data.id || response.data.user?.id,
        };
        login(response.data.token, doctorData);
        if (onSuccess) onSuccess();
        toast.success(`Successfully ${isLogin ? "logged in" : "registered"}!`);
        navigate("/doctor/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
    setError("");
  };

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link
          to="/"
          className="flex items-center hover:text-blue-600 transition-colors"
        >
          <FaHome className="mr-1" />
          <span>Home</span>
        </Link>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
          return (
            <React.Fragment key={routeTo}>
              <span className="text-gray-400">/</span>
              {isLast ? (
                <span className="text-gray-900 font-semibold">
                  {formattedName}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="hover:text-blue-600 transition-colors"
                >
                  {formattedName}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6">{generateBreadcrumbs()}</div>

      <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
        <div className="max-w-md w-full border border-gray-300 rounded-xl bg-white shadow-md p-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">
            {isLogin ? "Doctor Login" : "Register as Doctor"}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Dr. Yeager"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="dr.yeager@gmail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 
               bg-blue-50 text-blue-600 text-sm font-medium rounded border border-blue-600 hover:bg-blue-100 transition-colors"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleToggle}
              className="text-sm  hover:text-blue-500 font-medium transition"
            >
              {isLogin
                ? "Don’t have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
