package com.debu.prescriptoVault.controller;

import com.debu.prescriptoVault.dto.response.PatientPrescriptionDto;
import com.debu.prescriptoVault.entity.Patient;
import com.debu.prescriptoVault.entity.Prescription;
import com.debu.prescriptoVault.exception.ResourceNotFoundException;
import com.debu.prescriptoVault.service.FileStorageService;
import com.debu.prescriptoVault.service.PatientService;
import com.debu.prescriptoVault.service.PrescriptionService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.util.List;

/**
 * Controller class for handling patient-specific HTTP operations.
 * Provides endpoints for requesting/verifying OTPs and downloading prescriptions.
 */
@RestController
@RequestMapping("/api")
@AllArgsConstructor
@CrossOrigin
public class PatientController {

    private final FileStorageService fileStorageService;
    private final PrescriptionService prescriptionService;
    private final PatientService patientService;

    /**
     * Downloads a prescription PDF file by its unique identifier.
     *
     * @param id The unique identifier of the prescription.
     * @return ResponseEntity with the PDF resource as an attachment, or error details.
     */
    @GetMapping("/patient/download")
    public ResponseEntity<?> downloadPrescriptionById(@RequestParam("id") Long id) {
        try {
            Prescription p = prescriptionService.findById(id);
            Resource resource = fileStorageService.loadFileAsResource(p.getFilePath());
            if (resource == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + p.getFileName() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            System.err.println("Malformed URL for prescription file download: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File download path error");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error downloading prescription: " + e.getMessage());
        }
    }

    /**
     * Requests a dynamic one-time password (OTP) for patient verification.
     * Generates and emails the OTP if the patient exists.
     *
     * @param email The registered email of the patient.
     * @return ResponseEntity confirming OTP dispatch or containing error details.
     */
    @PostMapping("/patient/request-otp")
    public ResponseEntity<?> requestOtp(@RequestParam("email") String email) {
        try {
            // Will throw ResourceNotFoundException if the patient is not found
            patientService.sendOtp(email);
            return ResponseEntity.ok("OTP sent to email");
        } catch (ResourceNotFoundException e) {
            // Handle when the patient email does not exist in the database
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            // Catch-all block for any mail server failures or other exceptions
            System.err.println("Failed to request OTP for email " + email + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send OTP: " + e.getMessage());
        }
    }

    /**
     * Verifies the patient's OTP and retrieves their list of uploaded prescriptions.
     *
     * @param email The registered email of the patient.
     * @param otp   The OTP received by the patient.
     * @return ResponseEntity with the list of prescriptions, or unauthorized/error response.
     */
    @PostMapping("/patient/verify-otp")
    public ResponseEntity<?> verifyOtpAndGetPrescriptions(@RequestParam("email") String email,
                                                          @RequestParam("otp") String otp) {
        try {
            boolean ok = patientService.verifyOtp(email, otp);
            if (!ok) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired OTP");
            }

            // Will throw ResourceNotFoundException if the patient is not found
            Patient patient = patientService.findByEmail(email);
            List<PatientPrescriptionDto> resp = prescriptionService.findByPatientId(patient.getId());

            return ResponseEntity.ok(resp);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("OTP verification failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Verification error: " + e.getMessage());
        }
    }
}

