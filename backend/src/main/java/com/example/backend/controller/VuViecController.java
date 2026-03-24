package com.example.backend.controller;

import com.example.backend.dto.request.CreateVuViecRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.entity.VuViec;
import com.example.backend.security.CustomUserDetails;
import com.example.backend.service.VuViecService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vu-viec")
@RequiredArgsConstructor
public class VuViecController {

    private final VuViecService vuViecService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<VuViec> createVuViec(
            @Valid @RequestBody CreateVuViecRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        
        VuViec created = vuViecService.createVuViec(request, currentUser);
        return ApiResponse.success("Tạo vụ việc thành công", created);
    }
}
