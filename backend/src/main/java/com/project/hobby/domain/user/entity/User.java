package com.project.hobby.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 서비스의 회원 정보를 담당하는 핵심 엔티티
 * JPA가 테이블과 매핑하며, 회원의 계정 정보와 권한을 관리합니다.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA의 프록시 생성을 위해 필수, 외부에서 무분별한 생성을 막기 위해 protected 설정
@Table(name = "users") // 이 엔티티의 데이터가 저장되고 관리될 실제 데이터베이스 테이블 이름을 'users'로 지정
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // PK 생성을 DB(MySQL 등)의 AUTO_INCREMENT에 위임
    private Long id;

    @Column(unique = true, nullable = false, length = 25) // 아이디 중복 불가, 필수값, 최대 길이 제한(DTO와 동기화)
    private String username;

    @Column(nullable = false) // 암호화된 비밀번호가 저장될 공간
    private String password;

    /**
     * 회원 가입을 위한 전용 빌더 생성자
     * DB가 할당하는 'id'를 제외하고 필수 정보(ID, PW, 권한)만 받아 객체를 안전하게 조립함
     */
    @Builder
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    /**
     * [비즈니스 로직] 비밀번호 변경
     * 무분별한 @Setter 대신 의미 있는 메서드를 통해 상태를 변경 (객체지향적 설계)
     * @param newPassword 암호화가 완료된 새로운 비밀번호
     */
    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }
}