import React, { useEffect, useState } from "react";
import { FaCakeCandles } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { doctorAPI, prescriptionAPI } from "../utils/api";

import {
  FaHome,
  FaDownload,
  FaCalendar,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSearch,
  FaSpinner,
  FaExclamationCircle,
  FaFileAlt,
  FaMapPin,
  FaTint,
  FaVenusMars,
} from "react-icons/fa";

const MyPrescriptions = () => {
  const { doctor } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPrescriptions(prescriptions);
    } else {
      const filtered = prescriptions.filter(
        (p) =>
          p.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.patientPhone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPrescriptions(filtered);
    }
  }, [searchTerm, prescriptions]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await doctorAPI.getPrescriptions();

      setPrescriptions(response.data);
      setFilteredPrescriptions(response.data);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);

      if (err.response?.status === 401) {
        toast.error("Unauthorized: Please login again");
        setError("Unauthorized: Your session may have expired");
      } else if (err.response?.status === 403) {
        toast.error("Forbidden: You don't have access to these prescriptions");
        setError("Forbidden: You don't have access to these prescriptions");
      } else if (err.response?.status === 404) {
        toast.error("Doctor not found");
        setError("Doctor not found");
      } else {
        toast.error("Failed to fetch prescriptions");
        setError(err.response?.data?.message || "Failed to fetch prescriptions");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (prescription) => {
    try {
      setDownloading(prescription.id);
      const response = await prescriptionAPI.download(prescription.id);

      // Handle both Blob and ArrayBuffer responses
      let blob;
      if (response.data instanceof Blob) {
        blob = response.data;
      } else if (response instanceof Blob) {
        blob = response;
      } else {
        // If it's not a Blob, convert it
        blob = new Blob([response.data], {
          type: response.data.type || "application/octet-stream",
        });
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = prescription.fileName || "prescription";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Prescription downloaded successfully");
    } catch (err) {
      console.error("Error downloading prescription:", err);
      toast.error("Failed to download prescription");
    } finally {
      setDownloading(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBloodGroup = (bg) => {
    if (!bg) return "N/A";
    return bg.replace("_POS", "+").replace("_NEG", "-");
  };

  // Truncate filename while preserving extension and handling long ID prefixes
  const truncateFileName = (fileName, maxLength = 40) => {
    if (!fileName) return "prescription";
    if (fileName.length <= maxLength) return fileName;

    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return fileName.substring(0, maxLength) + "...";
    }

    const extension = fileName.substring(lastDotIndex);
    let nameWithoutExtension = fileName.substring(0, lastDotIndex);

    // Remove leading numeric IDs (timestamps, hashes, etc.)
    // Pattern: matches one or more groups of digits followed by underscore
    nameWithoutExtension = nameWithoutExtension.replace(/^(\d+_)+/, "");

    // If no name remains after removing IDs, just show "File"
    if (!nameWithoutExtension.trim()) {
      nameWithoutExtension = "File";
    }

    // Limit total length
    const availableLength = maxLength - extension.length - 3;
    if (nameWithoutExtension.length > availableLength) {
      nameWithoutExtension = nameWithoutExtension.substring(0, availableLength);
    }

    return nameWithoutExtension + "..." + extension;
  };

  // Info Card Component for organized display
  const InfoCard = ({ icon: Icon, label, value, color = "primary" }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-all">
      <div className={`text-${color}-600 text-xl`}>
        <Icon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 truncate" title={value}>
          {value || "N/A"}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-700 mx-auto mb-4" />
          <p className="text-gray-600">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link
            to="/"
            className="flex items-center hover:text-primary-700 transition-colors"
          >
            <FaHome className="mr-1" />
            <span>Home</span>
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to="/doctor/dashboard"
            className="hover:text-primary-700 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">My Prescriptions</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Prescriptions
          </h1>
          <p className="text-gray-600">
            View and manage all your uploaded prescriptions ({prescriptions.length} total)
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, email, phone, or file name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <FaExclamationCircle />
            <span>{error}</span>
            <button
              onClick={fetchPrescriptions}
              className="ml-auto text-sm underline hover:no-underline font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Prescriptions List */}
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? "No prescriptions found matching your search."
                : "No prescriptions uploaded yet."}
            </p>
            {!searchTerm && (
              <Link
                to="/doctor/upload"
                className="inline-block mt-4 px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium"
              >
                Upload First Prescription
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Prescription Header */}
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-6 py-4 border-b border-primary-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="bg-primary-100 p-3 rounded-lg flex-shrink-0">
                        <FaFileAlt className="text-primary-600 text-lg" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-lg font-bold text-gray-900 truncate"
                          title={prescription.fileName}
                        >
                          {truncateFileName(prescription.fileName, 50)}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Uploaded {formatDate(prescription.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(prescription)}
                      disabled={downloading === prescription.id}
                      className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm whitespace-nowrap"
                    >
                      {downloading === prescription.id ? (
                        <>
                          <FaSpinner className="animate-spin" size={16} />
                          <span>Downloading</span>
                        </>
                      ) : (
                        <>
                          <FaDownload size={16} />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Prescription Content */}
                <div className="p-6">
                  {/* Patient Information Section */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <div className="w-1 h-4 bg-primary-600 rounded"></div>
                      Patient Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <InfoCard
                        icon={FaUser}
                        label="Full Name"
                        value={prescription.patientName}
                        color="primary"
                      />
                      <InfoCard
                        icon={FaEnvelope}
                        label="Email Address"
                        value={prescription.patientEmail}
                        color="primary"
                      />
                      <InfoCard
                        icon={FaPhone}
                        label="Phone Number"
                        value={prescription.patientPhone}
                        color="primary"
                      />
                    </div>
                  </div>

                  {/* Additional Details Section */}
                  {(prescription.patientAge ||
                    prescription.patientGender ||
                    prescription.patientBloodGroup) && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-600 rounded"></div>
                        Medical Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {prescription.patientAge && (
                          <InfoCard
                            icon={FaCakeCandles}
                            label="Age"
                            value={`${prescription.patientAge} years`}
                            color="blue"
                          />
                        )}
                        {prescription.patientGender && (
                          <InfoCard
                            icon={FaVenusMars}
                            label="Gender"
                            value={
                              prescription.patientGender.charAt(0).toUpperCase() +
                              prescription.patientGender.slice(1).toLowerCase()
                            }
                            color="blue"
                          />
                        )}
                        {prescription.patientBloodGroup && (
                          <InfoCard
                            icon={FaTint}
                            label="Blood Group"
                            value={formatBloodGroup(
                              prescription.patientBloodGroup
                            )}
                            color="blue"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Prescription Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                  <div>
                    <span className="font-medium text-gray-700">
                      Prescription ID:
                    </span>
                    <span className="ml-2 font-mono">{prescription.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredPrescriptions.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-block bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg px-6 py-4">
              <p className="text-gray-700">
                Showing{" "}
                <span className="font-bold text-primary-600">
                  {filteredPrescriptions.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">
                  {prescriptions.length}
                </span>{" "}
                prescription{prescriptions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPrescriptions;
