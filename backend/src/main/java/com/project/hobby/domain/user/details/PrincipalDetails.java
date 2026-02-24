package com.project.hobby.domain.user.details;

import com.project.hobby.domain.user.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * 스프링 시큐리티의 인증 프로세스에서 사용자 정보를 담는 그릇입니다.
 * 인터페이스인 UserDetails를 구현하여 시큐리티가 우리 시스템의 User 엔티티를 인식할 수 있게 합니다.
 */
@Getter
@RequiredArgsConstructor
public class PrincipalDetails implements UserDetails {

    // 우리가 만든 실제 DB 엔티티 (가방 안에 실물 데이터를 넣는 개념)
    private final User user;

    /**
     * 사용자의 권한 목록을 리턴합니다. (Role 등)
     * 현재는 권한 체크를 하지 않으므로 빈 리스트를 반환합니다.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    /**
     * 사용자의 암호화된 비밀번호를 리턴합니다.
     */
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    /**
     * 사용자의 고유한 식별 값(아이디)을 리턴합니다.
     */
    @Override
    public String getUsername() {
        return user.getUsername();
    }

    /**
     * 계정 만료 여부를 리턴합니다. (true: 만료 안됨)
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 계정 잠김 여부를 리턴합니다. (true: 잠기지 않음)
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * 비밀번호 만료 여부를 리턴합니다. (true: 만료 안됨)
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * 계정 활성화 여부를 리턴합니다. (true: 활성화됨)
     * 휴면 계정 처리 등을 할 때 여기서 로직을 체크합니다.
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}
