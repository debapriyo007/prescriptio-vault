import LoadingSpinner from "../components/LoadingSpinner";
import React, { useState } from "react";
import { FaCloudUploadAlt, FaHome } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { prescriptionAPI } from "../utils/api";

const UploadPrescription=()=>{
  const navigate=useNavigate();
  const location=useLocation();

  const[loading,setLoading]=useState(false);
  const[error,setError]=useState("");
  const[success,setSuccess]=useState("");

  const[formData,setFormData]=useState({
    patientName:"",
    patientPhone:"",
    patientEmail:"",
    patientAddress:"",
    gender:"",
    age:"",
    bloodGroup:"",
    file:null
  });

  const handleChange=e=>{
    const{name,value,type,files}=e.target;
    setFormData(prev=>({...prev,[name]:type==="file"?files[0]:value}));
  };

  const handleSubmit=async e=>{
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try{
      const uploadData=new FormData();
      Object.keys(formData).forEach(key=>{
        if(formData[key])uploadData.append(key,formData[key]);
      });

      await prescriptionAPI.upload(uploadData);
      toast.success("Prescription uploaded successfully!");

      setFormData({
        patientName:"",
        patientPhone:"",
        patientEmail:"",
        patientAddress:"",
        gender:"",
        age:"",
        bloodGroup:"",
        file:null
      });

      document.getElementById("file").value="";

      window.scrollTo(0,0);
      navigate("/doctor/dashboard");
    }catch(err){
      toast.error(err.response?.data||"Upload failed");
      setError(err.response?.data||"Upload failed");
    }finally{
      setLoading(false);
    }
  };

  const generateBreadcrumbs=()=>{
    const pathnames=location.pathname.split("/").filter(x=>x);

    return(
      <nav className="flex items-center space-x-2 text-sm text-gray-700">
        <Link to="/" className="flex items-center hover:text-blue-600">
          <FaHome className="mr-1"/>
          <span>Home</span>
        </Link>

        {pathnames.map((name,index)=>{
          const routeTo=`/${pathnames.slice(0,index+1).join("/")}`;
          const isLast=index===pathnames.length-1;

          const formatted=
            name.charAt(0).toUpperCase()+
            name.slice(1).replace(/([A-Z])/g," $1").trim();

          return(
            <React.Fragment key={routeTo}>
              <span className="text-gray-400">/</span>
              {isLast?(
                <span className="text-gray-900 font-semibold">{formatted}</span>
              ):(
                <Link to={routeTo} className="hover:text-blue-600">
                  {formatted}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  };

  return(
    <div className="min-h-screen bg-white">

      {/* Breadcrumb Section */}
      <div className=" border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {generateBreadcrumbs()}
        </div>
      </div>

      {/* Header */}
      <section className=" border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Upload Prescription
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Fill in the patient details and upload the prescription document.
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {error&&(
          <div className="border border-red-300 bg-red-50 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Form Container */}
        <div className="border border-gray-300 rounded-lg bg-white">
          <form onSubmit={handleSubmit} className="p-8 space-y-10">

            {/* Patient Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                Patient Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Patient Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Phone Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="patientPhone"
                    value={formData.patientPhone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="patientEmail"
                  value={formData.patientEmail}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="patientAddress"
                  value={formData.patientAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                Medical Information
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="A_POS">A+</option>
                    <option value="A_NEG">A-</option>
                    <option value="B_POS">B+</option>
                    <option value="B_NEG">B-</option>
                    <option value="O_POS">O+</option>
                    <option value="O_NEG">O-</option>
                    <option value="AB_POS">AB+</option>
                    <option value="AB_NEG">AB-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                Prescription Document
              </h2>

              <div className="border border-gray-300 rounded-lg p-8 text-center hover:bg-blue-50 transition">
                <FaCloudUploadAlt className="text-4xl text-gray-400 mb-4 mx-auto"/>

                <label className="text-sm text-gray-700 mb-2 block">
                  Prescription File<span className="text-red-500">*</span>
                </label>

                <input
                  id="file"
                  type="file"
                  name="file"
                  required
                  onChange={handleChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />

                <label
                  htmlFor="file"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer transition"
                >
                  Choose File
                </label>

                <p className="text-sm text-gray-600 mt-3">
                  {formData.file?`Selected: ${formData.file.name}`:"Or drag & drop file here"}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className=" border-gray-200 pt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={()=>navigate("/doctor/dashboard")}
                className="px-6 py-2 border border-gray-400 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
              >
                {loading?(
                  <>
                    <LoadingSpinner size="small"/>
                    Uploading...
                  </>
                ):(
                  <>
                    <FaCloudUploadAlt/>
                    Upload Prescription
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
};

export default UploadPrescription;
