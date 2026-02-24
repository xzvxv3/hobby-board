package com.project.hobby.domain.user.repository;

import com.project.hobby.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 1. 회원 가입시 중복 체크용
    boolean existsByUsername(String username);

    // 2. 로그인 시 사용자 정보 조회용 (비밀번호 비교 등을 위해 필요)
    Optional<User> findByUsername(String username);
}
