import LoadingSpinner from "../components/LoadingSpinner";
import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link, useLocation } from "react-router";
import { toast } from "react-toastify";
import { prescriptionAPI } from "../utils/api";

const PatientPrescription = () => {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await prescriptionAPI.requestOtp(email);
      toast.success("OTP sent successfully!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data || "Failed to send OTP");
      setError(err.response?.data || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await prescriptionAPI.verifyOtp(email, otp);
      setPrescriptions(response.data);
      toast.success("OTP verified successfully!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };


  const downloadPrescription = async (id, fileName) => {
    try {
      const response = await prescriptionAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download prescription");
    }
  };


  const resetFlow = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setPrescriptions([]);
    setError("");
  };


  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link 
          to="/" 
          className="flex items-center hover:text-primary-700 transition-colors"
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
                <span className="text-gray-900 font-semibold">{formattedName}</span>
              ) : (
                <Link 
                  to={routeTo} 
                  className="hover:text-primary-700 transition-colors"
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
    <div className="min-h-[calc(80vh-4rem)] bg-gray-50 py-5  sm:px-6 lg:px-8">
      {/* Breadcrumb at top-left */}
      <div className="max-w-7xl mx-auto mb-8">
        {generateBreadcrumbs()}
      </div>

      {/* Centered form container */}
      <div className="flex items-center justify-center min-h-[calc(80vh-4rem)]">
        <div className="w-full max-w-md border-2 border-white/20 bg-white/50 backdrop-blur-md rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-6">
            Access Your Prescriptions
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="eren@gmail.com"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3
                 bg-blue-50 text-blue-600 text-sm font-medium rounded border border-blue-600 hover:bg-blue-100 transition-colors"
              >
                {loading ? <LoadingSpinner size="small" /> : "Request OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <p className="text-gray-700 text-center">
                OTP sent to <span className="font-semibold">{email}</span>
              </p>
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="6-digit code"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex justify-center items-center py-3 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition"
                >
                  {loading ? <LoadingSpinner size="small" /> : "Verify OTP"}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Prescriptions
                </h3>
                <button
                  onClick={resetFlow}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Search Again
                </button>
              </div>
              {prescriptions.length === 0 ? (
                <p className="text-center text-gray-600 py-4">
                  No prescriptions found.
                </p>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((p) => (
                    <div
                      key={p.id}
                      className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex-1 pr-4 min-w-0">
                        <h4
                          className="font-medium text-gray-900 truncate max-w-full whitespace-nowrap"
                          title={p.fileName}
                        >
                          {p.fileName}
                        </h4>
                        <p className="text-sm text-gray-600">Dr. {p.doctorName}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(p.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => downloadPrescription(p.id, p.fileName)}
                        className="ml-4 flex-shrink-0 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export default PatientPrescription;
