package com.debu.prescriptoVault.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class AnalyticsResponse {

    private Long totalPatients;
    private Long totalPrescriptions;
    private Long prescriptionsThisMonth;
    private List<DailyPrescriptionDto> dailyPrescriptions;
    private List<TopPatientDto> topPatients;

}
