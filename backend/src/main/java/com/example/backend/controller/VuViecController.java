package com.example.backend.controller;

import com.example.backend.dto.request.CreateVuViecRequest;
import com.example.backend.dto.request.UpdateVuViecRequest;
import com.example.backend.dto.request.ChangeStatusRequest;
import com.example.backend.dto.request.VuViecSearchRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.VuViecResponse;
import com.example.backend.entity.VuViec;
import com.example.backend.entity.VuViecFile;
import com.example.backend.entity.VuViecTrangThaiLog;
import com.example.backend.security.CustomUserDetails;
import com.example.backend.service.VuViecService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/vu-viec")
@RequiredArgsConstructor
public class VuViecController {

    private final VuViecService vuViecService;

    @PostMapping
    public ResponseEntity<ApiResponse<VuViec>> createVuViec(
            @Valid @RequestBody CreateVuViecRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        VuViec vuViec = vuViecService.createVuViec(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Tạo vụ việc thành công", vuViec));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<VuViecResponse>>> searchVuViec(
            @ModelAttribute VuViecSearchRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Page<VuViecResponse> result = vuViecService.searchVuViec(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VuViecResponse>> getVuViecDetail(
            @PathVariable("id") UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        VuViecResponse detail = vuViecService.getVuViecDetail(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết thành công", detail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VuViec>> updateVuViec(
            @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateVuViecRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        VuViec vuViec = vuViecService.updateVuViec(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", vuViec));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVuViec(
            @PathVariable("id") UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        vuViecService.deleteVuViec(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Xóa vụ việc thành công"));
    }

    @PatchMapping("/{id}/trang-thai")
    public ResponseEntity<ApiResponse<Void>> changeStatus(
            @PathVariable("id") UUID id,
            @Valid @RequestBody ChangeStatusRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        vuViecService.changeStatus(id, request.getTrangThaiMoi(), request.getLyDo(), currentUser);
        return ResponseEntity.ok(ApiResponse.success("Thay đổi trạng thái thành công"));
    }

    @PostMapping("/{id}/files")
    public ResponseEntity<ApiResponse<List<VuViecFile>>> uploadFiles(
            @PathVariable("id") UUID id,
            @RequestParam("files") List<MultipartFile> files,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<VuViecFile> result = vuViecService.uploadFiles(id, files, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Tải tệp lên thành công", result));
    }

    @DeleteMapping("/{id}/files/{fileId}")
    public ResponseEntity<ApiResponse<Void>> deleteFile(
            @PathVariable("id") UUID id,
            @PathVariable("fileId") Long fileId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        vuViecService.deleteFile(id, fileId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Xóa tệp thành công"));
    }

    @GetMapping("/{id}/trang-thai-log")
    public ResponseEntity<ApiResponse<List<VuViecTrangThaiLog>>> getStatusLogs(
            @PathVariable("id") UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<VuViecTrangThaiLog> logs = vuViecService.getStatusLogs(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Lấy lịch sử thành công", logs));
    }

    @GetMapping("/export")
    public ResponseEntity<org.springframework.core.io.Resource> exportToExcel(
            @ModelAttribute VuViecSearchRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) throws java.io.IOException {
        byte[] data = vuViecService.exportToExcel(request, currentUser);
        org.springframework.core.io.Resource resource = new org.springframework.core.io.ByteArrayResource(data);

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=vuviec_export.xlsx")
                .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(resource);
    }

    @PostMapping("/import/validate")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> validateImport(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails currentUser) throws java.io.IOException {
        List<Map<String, Object>> result = vuViecService.validateImport(file, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Kiểm tra file import thành công", result));
    }

    @PostMapping("/import/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmImport(
            @RequestBody List<Map<String, Object>> data,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        vuViecService.confirmImport(data, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Import dữ liệu thành công"));
    }
}
