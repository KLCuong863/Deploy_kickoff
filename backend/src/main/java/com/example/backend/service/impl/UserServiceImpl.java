package com.example.backend.service.impl;

import com.example.backend.dto.request.UserRequest;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.entity.User;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.backend.exception.*;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id = " + id));

        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse createUser(UserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = UserMapper.toEntity(request);
        userRepository.save(user);

        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(UUID id, UserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id = " + id));

        UserMapper.updateEntity(user, request);
        userRepository.save(user);

        return UserMapper.toResponse(user);
    }

    @Override
    public void deleteUser(UUID id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id = " + id));

        userRepository.delete(user);
    }
}