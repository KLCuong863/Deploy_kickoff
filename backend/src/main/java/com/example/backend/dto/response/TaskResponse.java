package com.example.backend.dto.response;

import com.example.backend.entity.Task.Priority;
import com.example.backend.entity.Task.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private LocalDate dueDate;
    private LocalTime dueTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID userId;
    private String userName;
}
