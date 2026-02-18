package com.project.hobby.domain.post.dto;

import com.project.hobby.domain.post.entity.Post;

public record PostDetailResponse(String author, String title, String content, String date) {
    public static PostDetailResponse from(Post post) {
        return new PostDetailResponse(
                post.getAuthor(),
                post.getTitle(),
                post.getContent(),
                post.getDate()
        );
    }
}
