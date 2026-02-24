package com.project.hobby.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults()) // 아래 Bean으로 등록한 corsConfigurationSource를 자동으로 사용함
                .authorizeHttpRequests(auth -> auth
                        // H2 콘솔 접근 허용
                        .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()
                        // 로그인, 회원가입 API 허용
                        .requestMatchers(new AntPathRequestMatcher("/api/users/login")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/users/join")).permitAll()
                        // 나머지 API 경로 전체 허용 (필요에 따라 범위를 좁히세요)
                        .requestMatchers(new AntPathRequestMatcher("/api/**")).permitAll()
                        // .requestMatchers(new AntPathRequestMatcher("/error")).permitAll()
                        // 그 외 요청은 인증 필요
                        .anyRequest().authenticated()
                )

                .logout(logout -> logout
                        .logoutUrl("/api/users/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(200);
                        })
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                )
                // H2 콘솔 사용을 위해 X-Frame-Options 설정
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Next.js 주소 허용
        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedMethod("*"); // 모든 HTTP 메서드 허용
        configuration.addAllowedHeader("*"); // 모든 헤더 허용
        configuration.setAllowCredentials(true); // 쿠키/인증 세션 허용 (중요!)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
