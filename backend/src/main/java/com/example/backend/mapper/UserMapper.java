package com.example.backend.mapper;

import com.example.backend.dto.request.UserRequest;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.entity.User;



public class UserMapper {

    public static User toEntity(UserRequest request) {

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRoleId(request.getRoleId());
        user.setDepartmentId(request.getDepartmentId());
        user.setCreatedBy(request.getCreatedBy());
        user.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        return user;
    }

    public static UserResponse toResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roleId(user.getRoleId())
                .departmentId(user.getDepartmentId())
                .createdBy(user.getCreatedBy())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public static void updateEntity(User user, UserRequest request) {
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRoleId(request.getRoleId());
        user.setDepartmentId(request.getDepartmentId());
        user.setCreatedBy(request.getCreatedBy());
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }
    }
}