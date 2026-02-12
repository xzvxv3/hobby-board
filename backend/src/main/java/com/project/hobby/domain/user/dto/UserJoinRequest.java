package com.project.hobby.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserJoinRequest(
        @Size(min = 3, max = 25)
        @NotBlank(message = "사용자 ID는 필수 항목입니다.")
        String username,

        @NotBlank(message = "비밀번호를 입력하세요.")
        String password,

        @NotBlank(message = "비밀번호를 확인하세요.")
        String passwordConfirm) {
}

