package com.debu.prescriptoVault.service;

import com.debu.prescriptoVault.entity.Doctor;

public interface DoctorService {
    Doctor register(String name, String email, String rawPassword);
    Doctor findByEmail(String email);
    Doctor findById(Long id);
}