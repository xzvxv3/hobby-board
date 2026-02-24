package com.project.hobby.domain.user.dto;

public record UserLoginRequest(
        String username,
        String password) {
}
