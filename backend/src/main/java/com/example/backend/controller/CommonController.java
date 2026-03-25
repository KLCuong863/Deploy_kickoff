package com.example.backend.controller;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.entity.Department;
import com.example.backend.dto.response.RoleResponse;
import com.example.backend.entity.DanhMucLoaiVuViec;
import com.example.backend.dto.response.PermissionResponse;
import com.example.backend.service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/common")
@RequiredArgsConstructor
public class CommonController {

    private final CommonService commonService;

    @GetMapping("/roles")
    public ApiResponse<List<RoleResponse>> getAllRoles() {
        return ApiResponse.success("Get roles successfully", commonService.getAllRoles());
    }

    @GetMapping("/departments")
    public ApiResponse<List<Department>> getAllDepartments() {
        return ApiResponse.success("Get departments successfully", commonService.getAllDepartments());
    }

    @GetMapping("/loai-vu-viec")
    public ApiResponse<List<DanhMucLoaiVuViec>> getAllLoaiVuViec() {
        return ApiResponse.success("Get danh muc loai vu viec successfully", commonService.getAllLoaiVuViec());
    }

    @GetMapping("/permissions/{roleId}")
    public ApiResponse<List<PermissionResponse>> getPermissionsByRoleId(@PathVariable("roleId") Integer roleId) {
        return ApiResponse.success("Get permissions successfully", commonService.getPermissionsByRoleId(roleId));
    }
}
