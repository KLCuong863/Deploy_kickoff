package com.example.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangeStatusRequest {

    @NotBlank(message = "Trạng thái mới không được bỏ trống")
    @JsonProperty("sang_trang_thai")
    private String trangThaiMoi;

    @JsonProperty("ly_do")
    private String lyDo;
}
