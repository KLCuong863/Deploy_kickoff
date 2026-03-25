package com.example.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UUID id;
    private String email;
    private String name;
    private Integer roleId;
    private Set<String> permissions;
}
