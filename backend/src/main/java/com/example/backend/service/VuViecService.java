package com.example.backend.service;

import com.example.backend.dto.request.CreateVuViecRequest;
import com.example.backend.dto.request.UpdateVuViecRequest;
import com.example.backend.dto.request.VuViecSearchRequest;
import com.example.backend.dto.response.VuViecResponse;
import com.example.backend.entity.VuViec;
import com.example.backend.entity.VuViecFile;
import com.example.backend.entity.VuViecTrangThaiLog;
import com.example.backend.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface VuViecService {
    VuViec createVuViec(CreateVuViecRequest request, CustomUserDetails currentUser);
    Page<VuViecResponse> searchVuViec(VuViecSearchRequest request, CustomUserDetails currentUser);
    VuViecResponse getVuViecDetail(UUID id, CustomUserDetails currentUser);
    VuViec updateVuViec(UUID id, UpdateVuViecRequest request, CustomUserDetails currentUser);
    void deleteVuViec(UUID id, CustomUserDetails currentUser);
    void changeStatus(UUID id, String newStatus, String reason, CustomUserDetails currentUser);
    
    // File Management
    List<VuViecFile> uploadFiles(UUID id, List<MultipartFile> files, CustomUserDetails currentUser);
    void deleteFile(UUID id, Long fileId, CustomUserDetails currentUser);
    
    // Status History
    List<VuViecTrangThaiLog> getStatusLogs(UUID id, CustomUserDetails currentUser);

    // Import/Export
    byte[] exportToExcel(VuViecSearchRequest request, CustomUserDetails currentUser) throws java.io.IOException;
    List<Map<String, Object>> validateImport(MultipartFile file, CustomUserDetails currentUser) throws java.io.IOException;
    void confirmImport(List<Map<String, Object>> data, CustomUserDetails currentUser);
}
