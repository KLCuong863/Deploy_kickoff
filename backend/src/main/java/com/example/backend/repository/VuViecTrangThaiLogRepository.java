package com.example.backend.repository;

import com.example.backend.entity.VuViecTrangThaiLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VuViecTrangThaiLogRepository extends JpaRepository<VuViecTrangThaiLog, Long> {
    List<VuViecTrangThaiLog> findByVuViecIdOrderByChangedAtDesc(UUID vuViecId);
}
