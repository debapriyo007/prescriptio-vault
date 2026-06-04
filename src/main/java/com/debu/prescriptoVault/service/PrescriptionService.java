package com.debu.prescriptoVault.service;

import com.debu.prescriptoVault.dto.response.DoctorPrescriptionDto;
import com.debu.prescriptoVault.dto.response.PatientPrescriptionDto;
import com.debu.prescriptoVault.dto.response.UploadResponse;
import com.debu.prescriptoVault.entity.Doctor;
import com.debu.prescriptoVault.entity.Patient;
import com.debu.prescriptoVault.entity.Prescription;

import java.util.List;

public interface PrescriptionService {
    UploadResponse savePrescription(Doctor doctor, Patient patient, String fileName, String filePath);
    List<PatientPrescriptionDto> findByPatientId(Long patientId);
    List<DoctorPrescriptionDto> findByDoctorId(Long doctorId);
    Prescription findById(Long id);
}
