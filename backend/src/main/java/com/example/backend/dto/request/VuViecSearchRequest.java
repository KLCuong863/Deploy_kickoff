package com.example.backend.dto.request;

import com.example.backend.entity.MucDo;
import com.example.backend.entity.TrangThai;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class VuViecSearchRequest {
    private String search;
    private String loai;
    private MucDo mucDo;
    @JsonProperty("trang_thai")
    private TrangThai trangThai;
    
    @JsonProperty("don_vi_ids")
    private List<UUID> donViIds;
    
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonProperty("from_date")
    private LocalDate fromDate;
    
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonProperty("to_date")
    private LocalDate toDate;
    
    private int page = 0;
    private int limit = 10;
    private String sort = "createdAt,desc";
}
