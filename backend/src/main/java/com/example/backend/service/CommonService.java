package com.example.backend.service;

import com.example.backend.entity.Department;
import com.example.backend.dto.response.RoleResponse;
import com.example.backend.entity.DanhMucLoaiVuViec;
import com.example.backend.dto.response.PermissionResponse;

import java.util.List;

public interface CommonService {
    List<RoleResponse> getAllRoles();
    List<Department> getAllDepartments();
    List<DanhMucLoaiVuViec> getAllLoaiVuViec();
    List<PermissionResponse> getPermissionsByRoleId(Integer roleId);
}
