package com.example.backend.service.impl;

import com.example.backend.dto.request.CreateVuViecRequest;
import com.example.backend.entity.DanhMucLoaiVuViec;
import com.example.backend.entity.TrangThai;
import com.example.backend.entity.VuViec;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.DanhMucLoaiVuViecRepository;
import com.example.backend.repository.VuViecRepository;
import com.example.backend.security.CustomUserDetails;
import com.example.backend.service.VuViecService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VuViecServiceImpl implements VuViecService {

    private final VuViecRepository vuViecRepository;
    private final DanhMucLoaiVuViecRepository danhMucLoaiVuViecRepository;

    @Override
    public VuViec createVuViec(CreateVuViecRequest request, CustomUserDetails currentUser) {
        
        DanhMucLoaiVuViec loaiVuViec = danhMucLoaiVuViecRepository.findByTenIgnoreCase(request.getLoaiVuViec().trim())
                .orElseThrow(() -> new BadRequestException("Loại vụ việc không tồn tại trên hệ thống"));

        if (currentUser.getUser().getDepartmentId() == null || !request.getDonViId().equals(currentUser.getUser().getDepartmentId())) {
            throw new BadRequestException("Bạn chỉ có thể báo cáo vụ việc cho đơn vị của mình.");
        }

        VuViec vuiViec = new VuViec();
        vuiViec.setTieuDe(request.getTieuDe());
        vuiViec.setLoaiVuViecId(loaiVuViec.getId());
        vuiViec.setMucDo(request.getMucDo());
        vuiViec.setTrangThai(TrangThai.MOI);
        vuiViec.setDonViId(request.getDonViId());
        vuiViec.setNgayXayRa(request.getNgayXayRa());
        vuiViec.setDiaDiem(request.getDiaDiem());
        vuiViec.setMoTa(request.getMoTa());
        vuiViec.setGhiChu(request.getGhiChu());
        vuiViec.setIsDeleted(false);
        vuiViec.setCreatedBy(currentUser.getUser().getId());
        vuiViec.setCreatedAt(LocalDateTime.now());

        VuViec savedVuViec = vuViecRepository.save(vuiViec);

        return savedVuViec;
    }
}
