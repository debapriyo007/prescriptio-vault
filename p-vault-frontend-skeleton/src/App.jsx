import "react-toastify/dist/ReactToastify.css";
import  React from "react";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorLogin from "./pages/DoctorLogin";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MyPrescriptions from "./pages/MyPrescriptions";
import Navbar from "./components/Navbar";
import PatientPrescription from "./pages/PatientPrescription";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadPrescription from "./pages/UploadPrescription";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <>
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/patient-prescription" element={<PatientPrescription />} />
            <Route path="/doctor/login" element={<DoctorLogin />} />
            
            {/* Protected Doctor Routes */}
            <Route 
              path="/doctor/dashboard" 
              element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/prescriptions" 
              element={
                <ProtectedRoute>
                  <MyPrescriptions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/upload-prescription" 
              element={
                <ProtectedRoute>
                  <UploadPrescription />
                </ProtectedRoute>
              } 
            />
          </Routes>
            <Footer/>
        </div>
      </Router>
    
    </AuthProvider>
    
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      </>

  );
}

export default App;