package com.example.backend.repository;

import com.example.backend.entity.VuViecFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VuViecFileRepository extends JpaRepository<VuViecFile, Long> {
}
