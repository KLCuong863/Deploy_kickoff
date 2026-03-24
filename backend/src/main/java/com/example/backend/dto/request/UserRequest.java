package com.example.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class UserRequest {

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    @NotNull(message = "Role ID cannot be null")
    private Integer roleId;

    private UUID departmentId;

    private UUID createdBy;

    private String status;
}