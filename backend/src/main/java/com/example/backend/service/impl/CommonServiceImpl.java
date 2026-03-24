package com.example.backend.service.impl;

import com.example.backend.entity.Department;
import com.example.backend.entity.Role;
import com.example.backend.entity.DanhMucLoaiVuViec;
import com.example.backend.dto.response.PermissionResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.DepartmentRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.DanhMucLoaiVuViecRepository;
import com.example.backend.repository.PermissionRepository;
import com.example.backend.service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommonServiceImpl implements CommonService {

    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final DanhMucLoaiVuViecRepository danhMucLoaiVuViecRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public List<DanhMucLoaiVuViec> getAllLoaiVuViec() {
        return danhMucLoaiVuViecRepository.findAll();
    }

    @Override
    public List<PermissionResponse> getPermissionsByRoleId(Integer roleId) {
        if (!roleRepository.existsById(roleId)) {
            throw new BadRequestException("Role không tồn tại");
        }

        return permissionRepository.findByRoleId(roleId).stream()
                .map(permission -> PermissionResponse.builder()
                        .id(permission.getId())
                        .name(permission.getName())
                        .explain(permission.getExplain())
                        .build())
                .collect(Collectors.toList());
    }
}
