package com.project.hobby.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 서비스의 회원 정보를 담당하는 핵심 엔티티
 * JPA가 테이블과 매핑하며, 회원의 계정 정보와 권한을 관리.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 아이디 중복 불가, 필수값, 최대 길이 제한(DTO와 동기화)
    @Column(unique = true, nullable = false, length = 25)
    private String username;

    @Column(nullable = false)
    private String password;

    /**
     * 회원 가입을 위한 전용 빌더 생성자
     * DB가 할당하는 'id'를 제외하고 필수 정보(ID, PW, 권한)만 받아 객체를 안전하게 조립함
     * DTO와 연결
     */
    @Builder
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    /**
     * [비즈니스 로직] 비밀번호 변경
     * 무분별한 @Setter 대신 의미 있는 메서드를 통해 상태를 변경 (객체지향적 설계)
     */
    public void updatePassword(String newPassword) {
        this.password = password;
    }
}
