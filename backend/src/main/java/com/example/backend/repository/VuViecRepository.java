package com.example.backend.repository;

import com.example.backend.entity.VuViec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VuViecRepository extends JpaRepository<VuViec, UUID> {
}
