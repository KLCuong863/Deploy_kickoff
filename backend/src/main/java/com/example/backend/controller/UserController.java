package com.example.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.UserRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.success("Get users success", userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUser(@PathVariable("id") UUID id) {
        return ApiResponse.success("Get user success", userService.getUserById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        return ApiResponse.success("User created", userService.createUser(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<UserResponse> updateUser(
            @PathVariable("id") UUID id,
            @Valid @RequestBody UserRequest request) {

        return ApiResponse.success("User updated", userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable("id") UUID id) {
        userService.deleteUser(id);

        return ApiResponse.success("User deleted", null);
    }
}

