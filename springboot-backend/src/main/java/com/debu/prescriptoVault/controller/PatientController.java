package com.debu.prescriptoVault.controller;

import com.debu.prescriptoVault.dto.PatientPrescriptionDto;
import com.debu.prescriptoVault.entity.Patient;
import com.debu.prescriptoVault.entity.Prescription;
import com.debu.prescriptoVault.service.DoctorService;
import com.debu.prescriptoVault.service.EmailService;
import com.debu.prescriptoVault.service.FileStorageService;
import com.debu.prescriptoVault.service.PatientService;
import com.debu.prescriptoVault.service.PrescriptionService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.net.MalformedURLException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@CrossOrigin
public class PatientController {

    private final FileStorageService fileStorageService;
    private final DoctorService doctorService;
    private final PrescriptionService prescriptionService;
    private final PatientService patientService;
    private final EmailService emailService;




    @GetMapping("/patient/download")
    public ResponseEntity<?> downloadPrescriptionById(@RequestParam("id") Long id) {
        try {
            Prescription p = prescriptionService.findById(id);
            if (p == null)
                return ResponseEntity.status(404).body("Not found");

            Resource resource = fileStorageService.loadFileAsResource(p.getFilePath());
            if (resource == null)
                return ResponseEntity.status(404).body("File not found");

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + p.getFileName() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(500).body("File error");
        }
    }




    @PostMapping("/patient/request-otp")
    public ResponseEntity<?> requestOtp(@RequestParam("email") String email) {
        try {
            Patient patient = patientService.findByEmail(email);
            if (patient == null)
                return ResponseEntity.status(404).body("Patient not found");

            // Generate, persist, and send OTP via PatientService which internally calls EmailService
            patientService.sendOtp(email);

            return ResponseEntity.ok("OTP sent to email");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send OTP");
        }
    }




    @PostMapping("/patient/verify-otp")
    public ResponseEntity<?> verifyOtpAndGetPrescriptions(@RequestParam("email") String email,
                                                          @RequestParam("otp") String otp) {
        try {
            boolean ok = patientService.verifyOtp(email, otp);
            if (!ok) return ResponseEntity.status(401).body("Invalid or expired OTP");

            Patient patient = patientService.findByEmail(email);
            if (patient == null) return ResponseEntity.status(404).body("Patient not found");

            List<Prescription> list = prescriptionService.findByPatientId(patient.getId());
            List<PatientPrescriptionDto> resp = list.stream().map(x -> new PatientPrescriptionDto(
                    x.getId(),
                    x.getFileName(),
                    x.getUploadedAt(),
                    x.getDoctor() != null ? x.getDoctor().getName() : null,
                    x.getDoctor() != null ? x.getDoctor().getEmail() : null,
                    patient.getName(),
                    patient.getEmail()
            )).collect(Collectors.toList());

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error");
        }
    }
}
