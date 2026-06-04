package com.debu.prescriptoVault.service.impl;

import com.debu.prescriptoVault.entity.Patient;
import com.debu.prescriptoVault.exception.ResourceNotFoundException;
import com.debu.prescriptoVault.repository.PatientRepository;
import com.debu.prescriptoVault.service.EmailService;
import com.debu.prescriptoVault.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository repo;
    private final EmailService emailService;

    @Override
    public Patient findOrCreate(String name,
                                String phone,
                                String email,
                                String address,
                                Patient.Gender gender,
                                Integer age,
                                Patient.BloodGroup bg) {
        Optional<Patient> existing = repo.findByEmail(email);
        if (existing.isPresent()) {
            Patient p = existing.get();
            p.setName(name);
            p.setPhone(phone);
            p.setAddress(address);
            p.setGender(gender);
            p.setAge(age);
            p.setBloodGroup(bg);
            return repo.save(p);
        }
        Patient p = new Patient();
        p.setName(name);
        p.setPhone(phone);
        p.setEmail(email);
        p.setAddress(address);
        p.setGender(gender);
        p.setAge(age);
        p.setBloodGroup(bg);
        return repo.save(p);
    }

    private String genOtp() {
        int n = new Random().nextInt(900_000) + 100_000;
        return String.valueOf(n);
    }

    @Override
    public void sendOtp(String email) {
        Patient p = repo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + email));

        String otp = genOtp();
        p.setCurrentOtp(otp);
        p.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        repo.save(p);

        System.out.println("Generated OTP " + otp + " for email " + email);

        emailService.sendOtpEmail(
                email,
                p.getName(),
                otp,
                5
        );
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        Patient p = repo.findByEmail(email).orElse(null);
        if (p == null || p.getCurrentOtp() == null || p.getOtpExpiry() == null) {
            return false;
        }
        if (p.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }
        boolean valid = p.getCurrentOtp().equals(otp);
        if (valid) {
            p.setCurrentOtp(null);
            p.setOtpExpiry(null);
            repo.save(p);
        }
        return valid;
    }

    @Override
    public Patient findByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + email));
    }

    @Override
    public int getOtpExpiryMinutes() {
        return 5;
    }
}
