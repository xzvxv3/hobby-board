package com.project.hobby.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // API 테스트를 위해 CSRF 비활성화
                .authorizeHttpRequests(auth -> auth
                        // 1. 게시판 조회 및 회원가입은 로그인 없이도 가능하게 허용
                        .requestMatchers(new AntPathRequestMatcher("/api/**")).permitAll()

                        // 2. H2 콘솔 접근 허용
                        .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()

                        // 3. 나머지는 일단 인증 필요 (나중에 하나씩 풀어줄 예정)
                        .anyRequest().authenticated()
                )
                // H2 콘솔 사용을 위한 프레임 허용 설정
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
        ;
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 보안을 위해 비밀번호를 안전하게 암호화(BCrypt)해주는 도구를 스프링 관리 대상으로 등록
        return new BCryptPasswordEncoder();
    }
}
