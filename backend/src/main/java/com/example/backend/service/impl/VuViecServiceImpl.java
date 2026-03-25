package com.example.backend.service.impl;

import com.example.backend.dto.request.CreateVuViecRequest;
import com.example.backend.dto.request.UpdateVuViecRequest;
import com.example.backend.dto.request.VuViecSearchRequest;
import com.example.backend.dto.response.VuViecResponse;
import com.example.backend.entity.*;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.*;
import com.example.backend.security.CustomUserDetails;
import com.example.backend.service.FileService;
import com.example.backend.service.VuViecService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VuViecServiceImpl implements VuViecService {

    private final VuViecRepository vuViecRepository;
    private final DanhMucLoaiVuViecRepository danhMucLoaiVuViecRepository;
    private final PermissionRepository permissionRepository;
    private final VuViecFileRepository vuViecFileRepository;
    private final VuViecTrangThaiLogRepository statusLogRepository;
    private final DepartmentRepository departmentRepository;
    private final FileService fileService;

    private boolean hasPermission(CustomUserDetails user, String permissionName) {
        if (user.getUser().getRoleId() != null) {
            int roleId = user.getUser().getRoleId();
            if (roleId == 3) {
                if ("SEARCH".equalsIgnoreCase(permissionName) || "READ_ALL".equalsIgnoreCase(permissionName)) {
                    return true;
                }
            } else if (roleId == 1) {
                if ("SEARCH".equalsIgnoreCase(permissionName) || "READ_OWN".equalsIgnoreCase(permissionName)) {
                    return true;
                }
            }
        }

        List<Permission> permissions = permissionRepository.findByRoleId(user.getUser().getRoleId());
        return permissions.stream().anyMatch(p -> p.getName().equalsIgnoreCase(permissionName));
    }

    @Override
    @Transactional
    public VuViec createVuViec(CreateVuViecRequest request, CustomUserDetails currentUser) {
        if (!hasPermission(currentUser, "CREATE")) {
            throw new BadRequestException("Bạn không có quyền tạo vụ việc.");
        }

        DanhMucLoaiVuViec loaiVuViec = danhMucLoaiVuViecRepository.findByTenIgnoreCase(request.getLoaiVuViec().trim())
                .orElseThrow(() -> new BadRequestException("Loại vụ việc không tồn tại."));

        if (currentUser.getUser().getDepartmentId() == null
                || !request.getDonViId().equals(currentUser.getUser().getDepartmentId())) {
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

        return vuViecRepository.save(vuiViec);
    }

    @Override
    public Page<VuViecResponse> searchVuViec(VuViecSearchRequest request, CustomUserDetails currentUser) {
        if (!hasPermission(currentUser, "SEARCH")) {
            throw new BadRequestException("Bạn không có quyền tìm kiếm vụ việc.");
        }

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if (request.getSort() != null && request.getSort().contains(",")) {
            String[] parts = request.getSort().split(",");
            sort = Sort.by(parts[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, parts[0]);
        }
        Pageable pageable = PageRequest.of(request.getPage(), request.getLimit(), sort);

        Specification<VuViec> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("isDeleted"), false));

            // Permission Filter
            if (hasPermission(currentUser, "READ_ALL")) {
                // No extra filter
            } else if (hasPermission(currentUser, "READ_SCOPE")) {
                predicates.add(cb.equal(root.get("donViId"), currentUser.getUser().getDepartmentId()));
            } else if (hasPermission(currentUser, "READ_OWN")) {
                predicates.add(cb.equal(root.get("createdBy"), currentUser.getUser().getId()));
            } else {
                throw new BadRequestException("Bạn không có quyền xem danh sách vụ việc.");
            }

            // Other filters
            if (request.getSearch() != null && !request.getSearch().isEmpty()) {
                String searchPattern = "%" + request.getSearch().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("tieuDe")), searchPattern),
                        cb.like(cb.lower(root.get("moTa")), searchPattern)));
            }
            if (request.getLoai() != null && !request.getLoai().isEmpty()) {
                // Assuming loai is ID or Name, if name need to join
                // For simplicity, let's assume it's ID here or name needs another join
            }
            if (request.getMucDo() != null)
                predicates.add(cb.equal(root.get("mucDo"), request.getMucDo()));
            if (request.getTrangThai() != null)
                predicates.add(cb.equal(root.get("trangThai"), request.getTrangThai()));
            if (request.getDonViIds() != null && !request.getDonViIds().isEmpty()) {
                predicates.add(root.get("donViId").in(request.getDonViIds()));
            }
            if (request.getFromDate() != null)
                predicates.add(cb.greaterThanOrEqualTo(root.get("ngayXayRa"), request.getFromDate()));
            if (request.getToDate() != null)
                predicates.add(cb.lessThanOrEqualTo(root.get("ngayXayRa"), request.getToDate()));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<VuViec> page = vuViecRepository.findAll(spec, pageable);
        return page.map(this::convertToResponse);
    }

    @Override
    public VuViecResponse getVuViecDetail(UUID id, CustomUserDetails currentUser) {
        VuViec vuViec = vuViecRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VuViec not found"));

        if (vuViec.getIsDeleted())
            throw new ResourceNotFoundException("VuViec is deleted");

        checkReadPermission(vuViec, currentUser);

        VuViecResponse response = convertToResponse(vuViec);
        response.setFiles(vuViecFileRepository.findByVuViecId(id));
        response.setStatusLogs(statusLogRepository.findByVuViecIdOrderByChangedAtDesc(id));

        return response;
    }

    @Override
    @Transactional
    public VuViec updateVuViec(UUID id, UpdateVuViecRequest request, CustomUserDetails currentUser) {
        if (!hasPermission(currentUser, "UPDATE"))
            throw new BadRequestException("Bạn không có quyền cập nhật.");

        VuViec vuViec = vuViecRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VuViec not found"));

        if (!vuViec.getCreatedBy().equals(currentUser.getUser().getId()) && !hasPermission(currentUser, "ADMIN")) {
            throw new BadRequestException("Bạn hỉ có thể cập nhật vụ việc do mình tạo ra.");
        }

        if (request.getTieuDe() != null)
            vuViec.setTieuDe(request.getTieuDe());
        if (request.getMucDo() != null)
            vuViec.setMucDo(request.getMucDo());
        if (request.getDiaDiem() != null)
            vuViec.setDiaDiem(request.getDiaDiem());
        if (request.getMoTa() != null)
            vuViec.setMoTa(request.getMoTa());
        if (request.getGhiChu() != null)
            vuViec.setGhiChu(request.getGhiChu());
        if (request.getNgayXayRa() != null)
            vuViec.setNgayXayRa(request.getNgayXayRa());
        if (request.getDonViId() != null)
            vuViec.setDonViId(request.getDonViId());

        if (request.getLoaiVuViec() != null && !request.getLoaiVuViec().trim().isEmpty()) {
            DanhMucLoaiVuViec loaiVuViec = danhMucLoaiVuViecRepository
                    .findByTenIgnoreCase(request.getLoaiVuViec().trim())
                    .orElseThrow(() -> new BadRequestException("Loại vụ việc không tồn tại."));
            vuViec.setLoaiVuViecId(loaiVuViec.getId());
        }

        vuViec.setUpdatedAt(LocalDateTime.now());
        vuViec.setUpdatedBy(currentUser.getUser().getId());

        return vuViecRepository.save(vuViec);
    }

    @Override
    @Transactional
    public void deleteVuViec(UUID id, CustomUserDetails currentUser) {
        if (!hasPermission(currentUser, "DELETE"))
            throw new BadRequestException("Bạn không có quyền xóa.");

        VuViec vuViec = vuViecRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VuViec not found"));

        if (!vuViec.getCreatedBy().equals(currentUser.getUser().getId()) && !hasPermission(currentUser, "ADMIN")) {
            throw new BadRequestException("Bạn hỉ có thể xóa vụ việc do mình tạo ra.");
        }

        vuViec.setIsDeleted(true);
        vuViec.setUpdatedAt(LocalDateTime.now());
        vuViec.setUpdatedBy(currentUser.getUser().getId());
        vuViecRepository.save(vuViec);
    }

    @Override
    @Transactional
    public void changeStatus(UUID id, String newStatus, String reason, CustomUserDetails currentUser) {
        if (!hasPermission(currentUser, "CHANGE_STATUS"))
            throw new BadRequestException("Bạn không có quyền thay đổi trạng thái.");

        VuViec vuViec = vuViecRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VuViec not found"));

        TrangThai oldStatus = vuViec.getTrangThai();
        TrangThai nextStatus = TrangThai.valueOf(newStatus);

        vuViec.setTrangThai(nextStatus);
        vuViec.setUpdatedAt(LocalDateTime.now());
        vuViec.setUpdatedBy(currentUser.getUser().getId());
        vuViecRepository.save(vuViec);

        VuViecTrangThaiLog log = new VuViecTrangThaiLog();
        log.setVuViecId(id);
        log.setTuTrangThai(oldStatus);
        log.setSangTrangThai(nextStatus);
        log.setTrangThaiCu(oldStatus);
        log.setTrangThaiMoi(nextStatus);
        log.setLyDo(reason);
        log.setChangedBy(currentUser.getUser().getId());
        statusLogRepository.save(log);
    }

    @Override
    @Transactional
    public List<VuViecFile> uploadFiles(UUID id, List<org.springframework.web.multipart.MultipartFile> files,
            CustomUserDetails currentUser) {
        if (!hasPermission(currentUser, "UPLOAD_FILE"))
            throw new BadRequestException("Bạn không có quyền tải tệp lên.");

        VuViec vuViec = vuViecRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VuViec not found"));
        checkReadPermission(vuViec, currentUser);

        List<VuViecFile> savedFiles = new ArrayList<>();
        for (org.springframework.web.multipart.MultipartFile file : files) {
            try {
                String path = fileService.saveFile(file, "vuviec/" + id);
                VuViecFile vvf = new VuViecFile();
                vvf.setVuViecId(id);
                vvf.setFileName(file.getOriginalFilename());
                vvf.setFilePath(path);
                vvf.setFileSize(file.getSize());
                vvf.setMimeType(file.getContentType());
                vvf.setUploadedBy(currentUser.getUser().getId());
                vvf.setIsDeleted(false);
                savedFiles.add(vuViecFileRepository.save(vvf));
            } catch (java.io.IOException e) {
                // Skip or throw
            }
        }
        return savedFiles;
    }

    @Override
    @Transactional
    public void deleteFile(UUID id, Long fileId, CustomUserDetails currentUser) {
        if (!hasPermission(currentUser, "UPLOAD_FILE"))
            throw new BadRequestException("Bạn không có quyền xóa tệp.");

        VuViecFile file = vuViecFileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
        if (!file.getVuViecId().equals(id))
            throw new BadRequestException("File does not belong to this VuViec");

        file.setIsDeleted(true);
        vuViecFileRepository.save(file);
    }

    @Override
    public List<VuViecTrangThaiLog> getStatusLogs(UUID id, CustomUserDetails currentUser) {
        if (!hasPermission(currentUser, "VIEW_HISTORY"))
            throw new BadRequestException("Bạn không có quyền xem lịch sử.");

        VuViec vuViec = vuViecRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VuViec not found"));
        checkReadPermission(vuViec, currentUser);

        return statusLogRepository.findByVuViecIdOrderByChangedAtDesc(id);
    }

    @Override
    public byte[] exportToExcel(VuViecSearchRequest request, CustomUserDetails currentUser) throws java.io.IOException {
        if (!hasPermission(currentUser, "EXPORT_ALL") && !hasPermission(currentUser, "EXPORT_SCOPE")
                && !hasPermission(currentUser, "EXPORT_OWN")) {
            throw new BadRequestException("Bạn không có quyền xuất dữ liệu.");
        }

        // Reuse search logic but without pagination
        List<VuViecResponse> data = searchVuViec(request, currentUser).getContent();

        try (org.apache.poi.ss.usermodel.Workbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook();
                java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {

            org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Danh sach vu viec");

            // Header
            org.apache.poi.ss.usermodel.Row headerRow = sheet.createRow(0);
            String[] columns = { "STT", "Tiêu đề", "Loại vụ việc", "Mức độ", "Trạng thái", "Đơn vị", "Ngày xảy ra",
                    "Địa điểm" };
            for (int i = 0; i < columns.length; i++) {
                headerRow.createCell(i).setCellValue(columns[i]);
            }

            // Data
            int rowIdx = 1;
            for (VuViecResponse item : data) {
                org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(rowIdx - 1);
                row.createCell(1).setCellValue(item.getTieuDe());
                row.createCell(2).setCellValue(item.getLoaiVuViecTen());
                row.createCell(3).setCellValue(item.getMucDo().toString());
                row.createCell(4).setCellValue(item.getTrangThai().toString());
                row.createCell(5).setCellValue(item.getDonViTen());
                row.createCell(6).setCellValue(item.getNgayXayRa().toString());
                row.createCell(7).setCellValue(item.getDiaDiem());
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    @Override
    public List<java.util.Map<String, Object>> validateImport(org.springframework.web.multipart.MultipartFile file,
            CustomUserDetails currentUser) throws java.io.IOException {
        if (!hasPermission(currentUser, "IMPORT"))
            throw new BadRequestException("Bạn không có quyền import.");

        List<java.util.Map<String, Object>> results = new ArrayList<>();
        try (org.apache.poi.ss.usermodel.Workbook workbook = org.apache.poi.ss.usermodel.WorkbookFactory
                .create(file.getInputStream())) {
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                org.apache.poi.ss.usermodel.Row row = sheet.getRow(i);
                if (row == null)
                    continue;

                java.util.Map<String, Object> item = new java.util.HashMap<>();
                item.put("rowNumber", i + 1);

                // Simplified validation logic
                String tieuDe = getCellValue(row.getCell(1));
                item.put("tieuDe", tieuDe);
                if (tieuDe == null || tieuDe.trim().isEmpty()) {
                    item.put("error", "Tiêu đề không được để trống");
                }

                results.add(item);
            }
        }
        return results;
    }

    @Override
    @Transactional
    public void confirmImport(List<java.util.Map<String, Object>> data, CustomUserDetails currentUser) {
        if (!hasPermission(currentUser, "IMPORT"))
            throw new BadRequestException("Bạn không có quyền import.");
        // Save valid items...
    }

    private String getCellValue(org.apache.poi.ss.usermodel.Cell cell) {
        if (cell == null)
            return null;
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            default:
                return null;
        }
    }

    private void checkReadPermission(VuViec vuViec, CustomUserDetails currentUser) {
        if (hasPermission(currentUser, "READ_ALL"))
            return;
        if (hasPermission(currentUser, "READ_SCOPE")
                && vuViec.getDonViId().equals(currentUser.getUser().getDepartmentId()))
            return;
        if (hasPermission(currentUser, "READ_OWN") && vuViec.getCreatedBy().equals(currentUser.getUser().getId()))
            return;

        throw new BadRequestException("Bạn không có quyền xem vụ việc này.");
    }

    private VuViecResponse convertToResponse(VuViec vuViec) {
        DanhMucLoaiVuViec loai = danhMucLoaiVuViecRepository.findById(vuViec.getLoaiVuViecId()).orElse(null);
        Department dept = departmentRepository.findById(vuViec.getDonViId()).orElse(null);

        return VuViecResponse.builder()
                .id(vuViec.getId())
                .tieuDe(vuViec.getTieuDe())
                .loaiVuViecId(vuViec.getLoaiVuViecId())
                .loaiVuViecTen(loai != null ? loai.getTen() : null)
                .mucDo(vuViec.getMucDo())
                .trangThai(vuViec.getTrangThai())
                .donViId(vuViec.getDonViId())
                .donViTen(dept != null ? dept.getName() : null)
                .ngayXayRa(vuViec.getNgayXayRa())
                .diaDiem(vuViec.getDiaDiem())
                .moTa(vuViec.getMoTa())
                .ghiChu(vuViec.getGhiChu())
                .createdBy(vuViec.getCreatedBy())
                .createdAt(vuViec.getCreatedAt())
                .build();
    }
}
