package com.debu.prescriptoVault.controller;

import com.debu.prescriptoVault.dto.response.DoctorPrescriptionDto;
import com.debu.prescriptoVault.dto.response.UploadResponse;
import com.debu.prescriptoVault.entity.Doctor;
import com.debu.prescriptoVault.entity.Patient;
import com.debu.prescriptoVault.service.DoctorService;
import com.debu.prescriptoVault.service.FileStorageService;
import com.debu.prescriptoVault.service.PatientService;
import com.debu.prescriptoVault.service.PrescriptionService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@AllArgsConstructor
@CrossOrigin
public class DoctorController {

    private final DoctorService doctorService;
    private final PrescriptionService prescriptionService;
    private final PatientService patientService;
    private final FileStorageService fileStorageService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctor(@PathVariable Long id) {
        Doctor d = doctorService.findById(id);
        d.setPassword(null);
        return ResponseEntity.ok(d);
    }

    @PostMapping(value = "/upload-prescription", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPrescription(@RequestParam("patientName") String patientName,
                                                @RequestParam("patientPhone") String patientPhone,
                                                @RequestParam("patientEmail") String patientEmail,
                                                @RequestParam(value = "patientAddress", required = false) String patientAddress,
                                                @RequestParam(value = "gender", required = false) String gender,
                                                @RequestParam(value = "age", required = false) Integer age,
                                                @RequestParam(value = "bloodGroup", required = false) String bloodGroup,
                                                @RequestParam("file") MultipartFile file,
                                                Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated())
                return ResponseEntity.status(401).body("Unauthorized");

            String username = ((UserDetails) authentication.getPrincipal()).getUsername();
            Doctor doctor = doctorService.findByEmail(username);

            Patient.Gender g = null;
            Patient.BloodGroup bg = null;
            try {
                if (gender != null) g = Patient.Gender.valueOf(gender.toUpperCase());
            } catch (Exception ignored) {
            }
            try {
                if (bloodGroup != null)
                    bg = Patient.BloodGroup.valueOf(bloodGroup.toUpperCase().replace("+", "_POS").replace("-", "_NEG"));
            } catch (Exception ignored) {
            }

            Patient patient = patientService.findOrCreate(patientName, patientPhone, patientEmail, patientAddress, g, age, bg);
            String fileName = file.getOriginalFilename();
            String path = fileStorageService.storeFile(file, fileName);
            UploadResponse resp = prescriptionService.savePrescription(doctor, patient, fileName, path);
            return ResponseEntity.status(201).body(resp);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (java.io.IOException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    /**
     * Get all prescriptions uploaded by the authenticated doctor
     * Protected endpoint - requires authentication
     */
    @GetMapping("/prescriptions")
    public ResponseEntity<?> getDoctorPrescriptions(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated())
                return ResponseEntity.status(401).body("Unauthorized");

            String username = ((UserDetails) authentication.getPrincipal()).getUsername();
            Doctor doctor = doctorService.findByEmail(username);

            List<DoctorPrescriptionDto> response = prescriptionService.findByDoctorId(doctor.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching prescriptions: " + e.getMessage());
        }
    }

    /**
     * Get prescriptions by doctor ID
     * Protected endpoint - requires authentication
     */
    @GetMapping("/{doctorId}/prescriptions")
    public ResponseEntity<?> getPrescriptionsByDoctorId(
            @PathVariable Long doctorId,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated())
                return ResponseEntity.status(401).body("Unauthorized");

            String username = ((UserDetails) authentication.getPrincipal()).getUsername();
            Doctor currentDoctor = doctorService.findByEmail(username);

            // Security check: Doctor can only view their own prescriptions
            if (!currentDoctor.getId().equals(doctorId))
                return ResponseEntity.status(403).body("Forbidden: Cannot access other doctor's prescriptions");

            Doctor targetDoctor = doctorService.findById(doctorId);
            List<DoctorPrescriptionDto> response = prescriptionService.findByDoctorId(doctorId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching prescriptions: " + e.getMessage());
        }
    }
}
