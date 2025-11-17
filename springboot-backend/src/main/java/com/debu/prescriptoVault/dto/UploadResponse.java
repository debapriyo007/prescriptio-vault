package com.debu.prescriptoVault.dto;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UploadResponse{

    private Long id;
    private String fileName;
    private String message;

}
