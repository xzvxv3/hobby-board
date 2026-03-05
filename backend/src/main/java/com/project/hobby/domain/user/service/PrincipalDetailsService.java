package com.project.hobby.domain.user.service;

import com.project.hobby.domain.user.details.PrincipalDetails;
import com.project.hobby.domain.user.entity.User;
import com.project.hobby.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // 시큐리티가 로그인을 진행할 때, 아이디(username)가 DB에 있는지 확인하는 메서드
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("해당 사용자를 찾을 수 없습니다."));

        // 찾은 유저 정보를 시큐리티 전용 박스(PrincipalDetails)에 담아서 리턴
        return new PrincipalDetails(user);
    }
}
