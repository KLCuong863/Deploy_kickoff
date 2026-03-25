package com.example.backend.service.impl;

import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.AuthResponse;
import com.example.backend.entity.Department;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.DepartmentRepository;
import com.example.backend.repository.PermissionRepository;
import com.example.backend.entity.Permission;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.CustomUserDetails;
import com.example.backend.service.AuthService;
import com.example.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final PermissionRepository permissionRepository;

    @Override
    public AuthResponse login(LoginRequest request) {
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        var user = userDetails.getUser();
        String jwtToken = jwtService.generateToken(userDetails);

        List<Permission> perms = permissionRepository.findByRoleId(user.getRoleId());
        java.util.Set<String> permissionStrings = perms.stream().map(Permission::getName).collect(java.util.stream.Collectors.toSet());
        // Implicit permissions mapped by role
        if (user.getRoleId() == 3) {
            permissionStrings.add("SEARCH");
            permissionStrings.add("READ_ALL");
        } else if (user.getRoleId() == 1) {
            permissionStrings.add("SEARCH");
            permissionStrings.add("READ_OWN");
            // Standard user typically has CREATE
            permissionStrings.add("CREATE");
        }

        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .roleId(user.getRoleId())
                .permissions(permissionStrings)
                .build();
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        Role role = roleRepository.findByNameIgnoreCase(request.getRole()).orElse(null);

        if (role == null) {
            throw new BadRequestException("Role không tồn tại trên hệ thống");
        }

        Department department = null;
        String roleName = role.getName().toUpperCase();
        
        // Roles that require a department selection
        if (roleName.contains("CBTT") || roleName.contains("MANAGER") || roleName.contains("TRƯỞNG PHÒNG")) {
            if (request.getDepartment() == null || request.getDepartment().trim().isEmpty()) {
                throw new BadRequestException("Department is required for " + role.getName() + " role.");
            }
            
            department = departmentRepository.findByNameIgnoreCase(request.getDepartment()).orElse(null);
            if (department == null) {
                throw new BadRequestException("Phòng ban (Department) không tồn tại trên hệ thống");
            }
        }
        // Director / Thủ trưởng usually does not require a specific department selection 
        // as they oversee multiple or are at the top level
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoleId(role.getId());
        user.setDepartmentId(department != null ? department.getId() : null);
        user.setStatus("ACTIVE");
        user.setCreatedAt(LocalDateTime.now());
        
        user = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user, role.getName());
        String jwtToken = jwtService.generateToken(userDetails);

        List<Permission> perms = permissionRepository.findByRoleId(user.getRoleId());
        java.util.Set<String> permissionStrings = perms.stream().map(Permission::getName).collect(java.util.stream.Collectors.toSet());
        
        if (user.getRoleId() == 3) {
            permissionStrings.add("SEARCH");
            permissionStrings.add("READ_ALL");
        } else if (user.getRoleId() == 1) {
            permissionStrings.add("SEARCH");
            permissionStrings.add("READ_OWN");
            permissionStrings.add("CREATE");
        }

        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .roleId(user.getRoleId())
                .permissions(permissionStrings)
                .build();
    }
}
