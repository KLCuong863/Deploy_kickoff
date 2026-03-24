package com.example.backend.repository;

import com.example.backend.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {
    @Query("SELECT p FROM Role r JOIN r.permissions p WHERE r.id = :roleId")
    List<Permission> findByRoleId(@Param("roleId") Integer roleId);
}
