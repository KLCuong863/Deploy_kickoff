package com.example.backend.service;

import com.example.backend.dto.request.CreateVuViecRequest;
import com.example.backend.entity.VuViec;
import com.example.backend.security.CustomUserDetails;
import jakarta.validation.Valid;

public interface VuViecService {
    VuViec createVuViec(@Valid CreateVuViecRequest request, CustomUserDetails currentUser);
}
