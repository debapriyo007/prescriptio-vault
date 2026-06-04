package com.debu.prescriptoVault.repository;
import com.debu.prescriptoVault.dto.response.DailyPrescriptionDto;
import com.debu.prescriptoVault.dto.response.TopPatientDto;
import com.debu.prescriptoVault.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
public interface PrescriptionRepository extends JpaRepository<Prescription,Long>{
    List<Prescription> findByDoctorId(Long doctorId);
    List<Prescription> findByPatientId(Long patientId);

    Long countByUploadedAtGreaterThanEqual(LocalDateTime date);


    // DTO constructor projection (Daily)
    @Query("""
    SELECT new com.debu.prescriptoVault.dto.response.DailyPrescriptionDto(
        DATE(p.uploadedAt),
        COUNT(p)
    )
    FROM Prescription p
    WHERE p.uploadedAt >= :from
    GROUP BY DATE(p.uploadedAt)
    ORDER BY DATE(p.uploadedAt)
""")
    List<DailyPrescriptionDto> findDailyPrescriptions(
            @Param("from") LocalDateTime from
    );



    // DTO constructor projection (Top patients)
    @Query("""
        SELECT new com.debu.prescriptoVault.dto.response.TopPatientDto(
            p.patient.name,
            COUNT(p)
        )
        FROM Prescription p
        GROUP BY p.patient.name
        ORDER BY COUNT(p) DESC
    """)
    List<TopPatientDto> findTopPatients();

}
