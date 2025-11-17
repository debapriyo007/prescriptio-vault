import React from "react";
import { RiUploadCloud2Fill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FaHome,
  FaFilePrescription,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";

const DoctorDashboard = () => {
  const { doctor, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

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
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
          const isLast = index === pathnames.length - 1;

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

  const Card = ({ icon: Icon, title, desc, to, disabled }) => {
    const iconBox = (
      <div className="w-12 h-12 flex-shrink-0 bg-blue-600 rounded flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
    );

    const content = (
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-base text-gray-700 leading-relaxed">{desc}</p>
      </div>
    );

    if (disabled) {
      return (
        <div className="border border-gray-300 rounded p-6 flex items-start gap-4 bg-gray-100 opacity-70 select-none cursor-not-allowed">
          {iconBox}
          {content}
        </div>
      );
    }

    return (
      <Link
        to={to}
        className="border border-gray-300 rounded p-6 flex items-start gap-4 hover:bg-blue-50 transition"
      >
        {iconBox}
        {content}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb Section */}
      <section className=" border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {generateBreadcrumbs()}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome, Dr. {doctor?.name || "—"}
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Manage your prescriptions and patient records seamlessly with a
            clean and modern dashboard.
          </p>
        </div>
      </section>

      {/* Dashboard Tiles Section */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="space-y-6 grid md:grid-cols-2 lg:grid-cols-2 md:gap-6 md:space-y-0">

            {/* Upload Prescription */}
            <Card
              to="/doctor/upload-prescription"
              icon={RiUploadCloud2Fill}
              title="Upload Prescription"
              desc="Securely upload new prescriptions with instant access."
            />

            {/* My Prescriptions */}
            <Card
              to="/doctor/prescriptions"
              icon={FaFilePrescription}
              title="My Prescriptions"
              desc="View, manage, and track all uploaded prescriptions."
            />

            {/* Patient Management */}
            <Card
              disabled
              icon={FaUsers}
              title="Patient Management (Coming Soon)"
              desc="Manage patient records and access medical history."
            />

            {/* Analytics */}
            <Card
              disabled
              icon={FaChartBar}
              title="Analytics (Coming Soon)"
              desc="Get insights and statistics about prescription trends."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorDashboard;
