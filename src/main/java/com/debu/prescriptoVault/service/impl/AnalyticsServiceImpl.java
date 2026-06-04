package com.debu.prescriptoVault.service.impl;

import com.debu.prescriptoVault.dto.response.AnalyticsResponse;
import com.debu.prescriptoVault.dto.response.DailyPrescriptionDto;
import com.debu.prescriptoVault.dto.response.TopPatientDto;
import com.debu.prescriptoVault.repository.PatientRepository;
import com.debu.prescriptoVault.repository.PrescriptionRepository;
import com.debu.prescriptoVault.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service implementation for retrieving and processing system analytics.
 * Gathers counts of patients and prescriptions, calculates monthly stats,
 * and fetches trends.
 */
@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final PatientRepository patientRepository;
    private final PrescriptionRepository prescriptionRepository;

    /**
     * Aggregates various system metrics to construct a comprehensive analytics summary.
     * Wraps database calls in a try-catch to ensure database errors are caught and rethrown
     * with meaningful context.
     *
     * @return AnalyticsResponse populated with counts and list data.
     * @throws RuntimeException if database queries fail.
     */
    @Override
    public AnalyticsResponse getAnalytics() {
        try {
            // 1. Fetch total patient count
            Long totalPatients = patientRepository.count();

            // 2. Fetch total prescription count
            Long totalPrescriptions = prescriptionRepository.count();

            // 3. Calculate the starting timestamp of the current month
            LocalDateTime startOfMonth = LocalDateTime.now()
                    .withDayOfMonth(1)
                    .toLocalDate()
                    .atStartOfDay();

            // 4. Count prescriptions uploaded from the start of this month
            Long prescriptionsThisMonth = prescriptionRepository.countByUploadedAtGreaterThanEqual(startOfMonth);

            // 5. Fetch daily prescription uploads count for the past 7 days
            List<DailyPrescriptionDto> dailyPrescriptions = prescriptionRepository.findDailyPrescriptions(
                    LocalDateTime.now().minusDays(7)
            );

            // 6. Fetch patients who have the most prescriptions uploaded
            List<TopPatientDto> topPatients = prescriptionRepository.findTopPatients();

            // Return the aggregated response DTO
            return new AnalyticsResponse(
                    totalPatients,
                    totalPrescriptions,
                    prescriptionsThisMonth,
                    dailyPrescriptions,
                    topPatients
            );
        } catch (Exception e) {
            // Wrap and rethrow exceptions with detailed context to make debugging easier
            throw new RuntimeException("Failed to compile analytics from database: " + e.getMessage(), e);
        }
    }
}

