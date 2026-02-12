package com.project.hobby.domain.user.service;

import com.project.hobby.domain.user.dto.UserJoinRequest;
import com.project.hobby.domain.user.entity.User;
import com.project.hobby.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // SecurityConfig에서 등록한 빈 주입

    public Long join(UserJoinRequest userDto) {

        // 아이디 중복 검사
        if(userRepository.existsByUsername(userDto.username())) {
            throw new IllegalArgumentException("이미 존재하는 이름입니다.");
        }

        // 비밀번호 확인
        if(!userDto.password().equals(userDto.passwordConfirm())) {
            throw new IllegalArgumentException(("비밀번호가 일치하지 않습니다."));
        }

        String encodedPassword = passwordEncoder.encode(userDto.password());

        User user = User.builder()
                .username(userDto.username())
                .password(encodedPassword)
                .build();

        return userRepository.save(user).getId();
    }
}
