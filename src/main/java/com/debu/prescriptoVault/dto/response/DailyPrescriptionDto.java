package com.debu.prescriptoVault.dto.response;

import lombok.Getter;

import java.sql.Date;
import java.time.LocalDate;

@Getter
public class DailyPrescriptionDto {

    private LocalDate date;
    private Long count;

    // Constructor used by Hibernate JPQL projection
    public DailyPrescriptionDto(Date date, Long count) {
        this.date = date.toLocalDate();
        this.count = count;
    }
}
