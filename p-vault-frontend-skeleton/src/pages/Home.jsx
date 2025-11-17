import Footer from "../components/Footer";
import React, { useEffect, useState } from "react";
import { MdOutlineSpeed, MdVerified } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Link } from "react-router-dom";

import {
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaLock,
  FaBolt,
} from "react-icons/fa";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(loadingTimer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - CodeForces Style */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Main Heading */}
          <div className="mb-8 mt-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              PrescriptoVault
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              A modern platform connecting doctors and patients through secure,
              instant access to medical prescriptions. Bank-level encryption
              ensures your data stays private and protected.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-16">
            <Link
              to="/doctor/login"
              className="inline-flex items-center gap-2 px-6 py-2.5bg-white text-blue-600 bg-blue-50 text-sm font-medium rounded border border-blue-600 hover:bg-blue-100 transition-colors"
            >
              Doctor Portal
              <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/patient-prescription"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-600 text-sm font-medium rounded border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Patient Access
            </Link>
          </div>

          {/* Stats Section - Table-like Layout */}
          <div className="border border-gray-300 rounded mt-24 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-300">
              {/* Stat 1 */}
              <div className="p-6 flex flex-col items-start text-center md:text-left">
                <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                  <FaShieldAlt className="text-blue-600 text-2xl md:text-xl flex-shrink-0" />
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  Secure
                </div>
                <div className="text-sm text-gray-600">
                  Bank-level encryption for all data
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-6 flex flex-col items-start text-center md:text-left">
                <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                  <FaClock className="text-blue-600 text-2xl md:text-xl flex-shrink-0" />
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  Access
                </div>
                <div className="text-sm text-gray-600">
                  Retrieve prescriptions anytime, anywhere
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-6 flex flex-col items-start text-center md:text-left">
                <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                  <MdVerified className="text-blue-600 text-2xl md:text-xl flex-shrink-0" />
                  <div className="text-2xl font-bold text-gray-900">
                    Instant
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  Verification
                </div>
                <div className="text-sm text-gray-600">
                  OTP verified in seconds
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Why Choose PrescriptoVault?
            </h2>
            <p className="text-base text-gray-700">
              Experience seamless prescription management with enterprise-grade
              security
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-6 grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0">
            {/* Feature 1 */}
            <div className="border border-gray-300 rounded p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-blue-600 rounded flex items-center justify-center">
                  <FaLock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Bank-Level Security
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    End-to-end encryption with multi-factor authentication
                    ensures your data stays private and protected. All
                    communications are secured using industry-standard
                    protocols.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="border border-gray-300 rounded p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-blue-600 rounded flex items-center justify-center">
                  <MdOutlineSpeed className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Instant Access
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Retrieve prescriptions in seconds with secure OTP
                    verification — no more lost papers or long waits. Access
                    your medical records from anywhere, anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="border border-gray-300 rounded p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-blue-600 rounded flex items-center justify-center">
                  <RiVerifiedBadgeFill className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Doctor Verified
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Simple upload system for healthcare professionals with
                    digital signatures and timestamps. Every prescription is
                    authenticated and traceable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold  mb-3">Ready to Get Started?</h2>
            <p className="text-base mb-6 max-w-2xl mx-auto">
              Join thousands of healthcare professionals and patients using
              PrescriptoVault for secure prescription management
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/doctor/login"
                className="inline-block px-6 py-2.5  bg-white text-blue-600 text-sm font-medium rounded border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                For Doctors
              </Link>
              <Link
                to="/patient-prescription"
                className="inline-block px-6 py-2.5 bg-white text-blue-600 text-sm font-medium rounded border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                For Patients
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default Home;
