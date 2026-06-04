package com.debu.prescriptoVault.dto.request;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AuthRequest {

    private String name;
    private String email;
    private String password;
}
