package com.example.backend.repository;

import com.example.backend.entity.VuViecFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VuViecFileRepository extends JpaRepository<VuViecFile, Long> {
    List<VuViecFile> findByVuViecId(UUID vuViecId);
}
