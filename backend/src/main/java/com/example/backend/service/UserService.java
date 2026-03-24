package com.example.backend.service;

import com.example.backend.dto.request.UserRequest;
import com.example.backend.dto.response.UserResponse;

import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(UUID id);

    UserResponse updateUser(UUID id, @Valid UserRequest request);

    void deleteUser(UUID id);

    UserResponse createUser(@Valid UserRequest request);
}