package com.example.backend.dto.request;

import com.example.backend.entity.MucDo;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class UpdateVuViecRequest {

    @Size(max = 255, message = "Tên vụ việc tối đa 255 ký tự")
    @JsonProperty("tieu_de")
    private String tieuDe;

    @JsonProperty("loai_vu_viec")
    private String loaiVuViec;

    @JsonProperty("don_vi_id")
    private UUID donViId;

    @JsonProperty("muc_do")
    private MucDo mucDo;

    @PastOrPresent(message = "Ngày xảy ra không được là ngày tương lai")
    @JsonProperty("ngay_xay_ra")
    private LocalDate ngayXayRa;

    @Size(max = 255, message = "Địa điểm xảy ra tối đa 255 ký tự")
    @JsonProperty("dia_diem")
    private String diaDiem;

    @Size(max = 10000, message = "Mô tả chi tiết tối đa 10000 ký tự")
    @JsonProperty("mo_ta")
    private String moTa;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    @JsonProperty("ghi_chu")
    private String ghiChu;
}
