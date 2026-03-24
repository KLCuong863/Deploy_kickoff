package com.example.backend.service.impl;

import com.example.backend.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    @Value("${upload.path:uploads}")
    private String uploadPath;

    @Override
    public String saveFile(MultipartFile file, String subDir) throws IOException {
        Path root = Paths.get(uploadPath, subDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String originalFileName = file.getOriginalFilename();
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;
        Path target = root.resolve(fileName);
        Files.copy(file.getInputStream(), target);

        return subDir + "/" + fileName;
    }

    @Override
    public void deleteFile(String filePath) {
        try {
            Path target = Paths.get(uploadPath, filePath);
            Files.deleteIfExists(target);
        } catch (IOException e) {
            // Log error
        }
    }
}
