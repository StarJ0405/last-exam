package com.starj0405.last_exam.Security;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@RequiredArgsConstructor
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.sessionManagement(manage -> manage.sessionCreationPolicy(SessionCreationPolicy.ALWAYS))
                // CSRF
                .csrf((csrf) -> csrf //
                        .ignoringRequestMatchers(new AntPathRequestMatcher("/api/**"))//
                )
                // 로그인 페이지
                .authorizeHttpRequests(request -> request.anyRequest().permitAll())
                // 콘솔 허용
                .headers((headers) -> headers//
                        .addHeaderWriter(new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN))//
                )
                // 세션 관리
                .sessionManagement(session -> session //
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) //
                )
                // 빌드
                .build();
    }


}
