package com.debu.prescriptoVault.config;

import com.debu.prescriptoVault.dto.response.DoctorPrescriptionDto;
import com.debu.prescriptoVault.dto.response.PatientPrescriptionDto;
import com.debu.prescriptoVault.entity.Prescription;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        
        // Custom mappings: map prescription.filePath -> fileUrl in DTOs
        modelMapper.typeMap(Prescription.class, DoctorPrescriptionDto.class).addMappings(mapper -> {
            mapper.map(Prescription::getFilePath, DoctorPrescriptionDto::setFileUrl);
        });
        
        modelMapper.typeMap(Prescription.class, PatientPrescriptionDto.class).addMappings(mapper -> {
            mapper.map(Prescription::getFilePath, PatientPrescriptionDto::setFileUrl);
        });

        return modelMapper;
    }
}
