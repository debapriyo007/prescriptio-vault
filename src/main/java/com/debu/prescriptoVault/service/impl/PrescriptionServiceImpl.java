package com.debu.prescriptoVault.service.impl;

import com.debu.prescriptoVault.dto.response.DoctorPrescriptionDto;
import com.debu.prescriptoVault.dto.response.PatientPrescriptionDto;
import com.debu.prescriptoVault.dto.response.UploadResponse;
import com.debu.prescriptoVault.entity.Doctor;
import com.debu.prescriptoVault.entity.Patient;
import com.debu.prescriptoVault.entity.Prescription;
import com.debu.prescriptoVault.exception.ResourceNotFoundException;
import com.debu.prescriptoVault.repository.PrescriptionRepository;
import com.debu.prescriptoVault.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final ModelMapper modelMapper;

    @Override
    public UploadResponse savePrescription(Doctor doctor, Patient patient, String fileName, String filePath) {
        Prescription p = new Prescription();
        p.setDoctor(doctor);
        p.setPatient(patient);
        p.setFileName(fileName);
        p.setFilePath(filePath);
        p.setUploadedAt(LocalDateTime.now());
        Prescription saved = prescriptionRepository.save(p);
        
        UploadResponse response = modelMapper.map(saved, UploadResponse.class);
        response.setMessage("Uploaded successfully");
        return response;
    }

    @Override
    public List<PatientPrescriptionDto> findByPatientId(Long patientId) {
        List<Prescription> list = prescriptionRepository.findByPatientId(patientId);
        return list.stream()
                .map(x -> modelMapper.map(x, PatientPrescriptionDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorPrescriptionDto> findByDoctorId(Long doctorId) {
        List<Prescription> list = prescriptionRepository.findByDoctorId(doctorId);
        return list.stream()
                .map(x -> modelMapper.map(x, DoctorPrescriptionDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public Prescription findById(Long id) {
        return prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
    }
}
