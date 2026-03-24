package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vu_viec")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VuViec {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tieu_de", nullable = false, length = 255)
    private String tieuDe;

    @Column(name = "loai_vu_viec_id", nullable = false)
    private Integer loaiVuViecId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "muc_do", nullable = false, columnDefinition = "muc_do_enum")
    private MucDo mucDo;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "trang_thai", nullable = false, columnDefinition = "trang_thai_enum")
    private TrangThai trangThai = TrangThai.MOI;

    @Column(name = "don_vi_id", nullable = false)
    private UUID donViId;

    @Column(name = "ngay_xay_ra", nullable = false)
    private LocalDate ngayXayRa;

    @Column(name = "dia_diem", length = 255)
    private String diaDiem;

    @Column(name = "mo_ta", nullable = false, columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_by")
    private UUID updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
