package com.example.backend.controller;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.entity.Department;
import com.example.backend.entity.Role;
import com.example.backend.service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/common")
@RequiredArgsConstructor
public class CommonController {

    private final CommonService commonService;

    @GetMapping("/roles")
    public ApiResponse<List<Role>> getAllRoles() {
        return ApiResponse.success("Get roles successfully", commonService.getAllRoles());
    }

    @GetMapping("/departments")
    public ApiResponse<List<Department>> getAllDepartments() {
        return ApiResponse.success("Get departments successfully", commonService.getAllDepartments());
    }
}
