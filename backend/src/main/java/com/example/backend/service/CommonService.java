package com.example.backend.service;

import com.example.backend.entity.Department;
import com.example.backend.entity.Role;

import java.util.List;

public interface CommonService {
    List<Role> getAllRoles();
    List<Department> getAllDepartments();
}
