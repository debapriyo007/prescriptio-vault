package com.debu.prescriptoVault.service.impl;

import com.debu.prescriptoVault.entity.Doctor;
import com.debu.prescriptoVault.exception.ResourceAlreadyExistsException;
import com.debu.prescriptoVault.exception.ResourceNotFoundException;
import com.debu.prescriptoVault.repository.DoctorRepository;
import com.debu.prescriptoVault.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Doctor register(String name, String email, String rawPassword) {
        if (doctorRepository.findByEmail(email).isPresent())
            throw new ResourceAlreadyExistsException("Email exists");

        Doctor doctor = new Doctor(name, email, passwordEncoder.encode(rawPassword));
        return doctorRepository.save(doctor);
    }

    @Override
    public Doctor findByEmail(String email) {
        return doctorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with email: " + email));
    }

    @Override
    public Doctor findById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }
}
