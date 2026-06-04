package com.debu.prescriptoVault.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TopPatientDto {

    private  String patientName;
    private  Long prescriptionCount;
}
