package com.debu.prescriptoVault.service;

import com.debu.prescriptoVault.entity.Patient;

public interface PatientService {
    Patient findOrCreate(String name,
                          String phone,
                          String email,
                          String address,
                          Patient.Gender gender,
                          Integer age,
                          Patient.BloodGroup bg);
    void sendOtp(String email);
    boolean verifyOtp(String email, String otp);
    Patient findByEmail(String email);
    int getOtpExpiryMinutes();
}
