package com.debu.prescriptoVault.dto;

import com.debu.prescriptoVault.entity.Patient;
import lombok.*;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DoctorPrescriptionDto {
    private Long id;
    private String fileName;
    private LocalDateTime uploadedAt;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private Integer patientAge;
    private Patient.Gender patientGender;
    private Patient.BloodGroup patientBloodGroup;
}
