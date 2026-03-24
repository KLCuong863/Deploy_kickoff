package com.example.backend.dto.response;

import com.example.backend.entity.MucDo;
import com.example.backend.entity.TrangThai;
import com.example.backend.entity.VuViecFile;
import com.example.backend.entity.VuViecTrangThaiLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VuViecResponse {
    private UUID id;
    private String tieuDe;
    private Integer loaiVuViecId;
    private String loaiVuViecTen;
    private MucDo mucDo;
    private TrangThai trangThai;
    private UUID donViId;
    private String donViTen;
    private LocalDate ngayXayRa;
    private String diaDiem;
    private String moTa;
    private String ghiChu;
    private UUID createdBy;
    private String createdByUserName;
    private LocalDateTime createdAt;
    
    // For detail view
    private List<VuViecFile> files;
    private List<VuViecTrangThaiLog> statusLogs;
}
