package com.project.hobby.domain.user.repository;

import com.project.hobby.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // 아이디로 중복 가입 여부를 확인하기 위한 메서드
    boolean existsByUsername(String username);

    // 로그인을 위해 아이디로 사용자 정보를 찾는 메서드
    Optional<User> findByUsername(String username);
}
