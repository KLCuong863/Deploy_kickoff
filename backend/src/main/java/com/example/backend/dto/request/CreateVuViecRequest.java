package com.example.backend.dto.request;

import com.example.backend.entity.MucDo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateVuViecRequest {

    @NotBlank(message = "Tên vụ việc không được bỏ trống")
    @Size(max = 255, message = "Tên vụ việc tối đa 255 ký tự")
    private String tieuDe;

    @NotBlank(message = "Loại vụ việc (tên) không được bỏ trống")
    private String loaiVuViec;

    @NotNull(message = "Đơn vị xảy ra vụ việc không được bỏ trống")
    private UUID donViId;

    @NotNull(message = "Mức độ nghiêm trọng không được bỏ trống")
    private MucDo mucDo;

    @NotNull(message = "Ngày xảy ra không được bỏ trống")
    @PastOrPresent(message = "Ngày xảy ra không được là ngày tương lai")
    private LocalDate ngayXayRa;

    @Size(max = 255, message = "Địa điểm xảy ra tối đa 255 ký tự")
    private String diaDiem;

    @NotBlank(message = "Mô tả chi tiết không được bỏ trống")
    @Size(max = 10000, message = "Mô tả chi tiết tối đa 10000 ký tự")
    private String moTa;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String ghiChu;
}
