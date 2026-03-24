package com.example.backend.repository;

import com.example.backend.entity.DanhMucLoaiVuViec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DanhMucLoaiVuViecRepository extends JpaRepository<DanhMucLoaiVuViec, Integer> {
    Optional<DanhMucLoaiVuViec> findByTenIgnoreCase(String ten);
}
