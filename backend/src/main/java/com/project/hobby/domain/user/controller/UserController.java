package com.project.hobby.domain.user.controller;

import com.project.hobby.domain.user.dto.UserJoinRequest;
import com.project.hobby.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
