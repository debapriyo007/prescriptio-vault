import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('doctorToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

// Doctor API
export const doctorAPI = {
  getProfile: (id) => api.get(`/doctor/${id}`),
  // Get prescriptions for authenticated doctor (using Authentication object on backend)
  getPrescriptions: () => api.get(`/doctor/prescriptions`),
  // Get prescriptions by specific doctor ID (with security check)
  getPrescriptionsByDoctorId: (doctorId) => api.get(`/doctor/${doctorId}/prescriptions`),
};

// Prescription API
export const prescriptionAPI = {
  upload: (formData) => api.post('/doctor/upload-prescription', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  download: (id) => api.get(`/patient/download?id=${id}`, { responseType: 'blob' }),
  requestOtp: (email) => api.post('/patient/request-otp', null, { params: { email } }),
  verifyOtp: (email, otp) => api.post('/patient/verify-otp', null, { 
    params: { email, otp } 
  }),
};

export default api;
