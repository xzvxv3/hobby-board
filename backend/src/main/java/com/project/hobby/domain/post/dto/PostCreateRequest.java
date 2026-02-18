package com.project.hobby.domain.post.dto;

import com.project.hobby.domain.post.entity.Post;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public record PostCreateRequest(String title, String content, String author) {
    public Post toEntity() {
        return Post.builder()
                .title(title)
                .content(content)
                .author(author)
                .date(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build();
    }
}
