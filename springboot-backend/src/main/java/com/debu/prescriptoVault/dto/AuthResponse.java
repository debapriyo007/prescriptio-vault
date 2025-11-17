package com.debu.prescriptoVault.dto;
import lombok.*;


@NoArgsConstructor
@Getter
@Setter
public class AuthResponse {

    private String message;
    private String token;

    private String name;
    private String email;
    private Long id;

    // Keep the old constructor for backward compatibility
    public AuthResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }

    // New constructor with doctor information
    public AuthResponse(String message, String token, String name, String email, Long id) {
        this.message = message;
        this.token = token;
        this.name = name;
        this.email = email;
        this.id = id;
    }
}