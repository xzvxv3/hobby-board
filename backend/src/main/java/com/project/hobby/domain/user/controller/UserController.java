package com.project.hobby.domain.user.controller;

import com.project.hobby.domain.user.dto.UserJoinRequest;
import com.project.hobby.domain.user.dto.UserLoginRequest;
import com.project.hobby.domain.user.dto.UserResponse;
import com.project.hobby.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/join")
    // 주소: POST /api/users/join
    public ResponseEntity<Long> join(@Valid @RequestBody UserJoinRequest requestDto) {
        log.info("[POST] 회원가입 시도 - Username: {}", requestDto.username());

        Long userId = userService.join(requestDto);

        log.info("[SUCCESS] 회원가입 완료 - Generated ID: {}", userId);
        return ResponseEntity.ok(userId);
    }

    @PostMapping("/login")
    // 주소: POST /api/users/login
    public ResponseEntity<UserResponse> login(@RequestBody UserLoginRequest loginDto) {
        log.info("[POST] 로그인 시도 - Username: {}", loginDto.username());

        // 서비스에서 로그인 로직 처리 (아이디 존재 여부, 비밀번호 일치 여부 확인)
        // 성공 시 유저 정보를 담은 DTO 등을 반환
        return ResponseEntity.ok(userService.login(loginDto));
    }
}
