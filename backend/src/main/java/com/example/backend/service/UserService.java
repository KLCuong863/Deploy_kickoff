package com.example.backend.service;

import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.UserRequest;
import com.example.backend.dto.response.UserResponse;

import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(UUID id);

    UserResponse updateUser(UUID id, UserRequest request);

    UserResponse createUser(@Valid UserRequest request);

    void changePassword(UUID id, ChangePasswordRequest request);
}