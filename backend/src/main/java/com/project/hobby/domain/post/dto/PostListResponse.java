package com.project.hobby.domain.post.dto;

import com.project.hobby.domain.post.entity.Post;

public record PostListResponse(Long id, String author, String title, String date) {
    public static PostListResponse from(Post post) {
        return new PostListResponse(
                post.getId(),
                post.getAuthor(),
                post.getTitle(),
                post.getDate()
        );
    }
}
