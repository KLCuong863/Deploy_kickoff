package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vu_viec_trang_thai_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VuViecTrangThaiLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vu_viec_id", nullable = false)
    private UUID vuViecId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tu_trang_thai")
    private TrangThai tuTrangThai;

    @Enumerated(EnumType.STRING)
    @Column(name = "sang_trang_thai", nullable = false)
    private TrangThai sangTrangThai;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_cu")
    private TrangThai trangThaiCu;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_moi", nullable = false)
    private TrangThai trangThaiMoi;

    @Column(name = "ly_do", columnDefinition = "TEXT")
    private String lyDo;

    @Column(name = "changed_by", nullable = false)
    private UUID changedBy;

    @CreationTimestamp
    @Column(name = "changed_at", nullable = false, updatable = false)
    private LocalDateTime changedAt;

    @Transient
    private String changedByUserName;
}
