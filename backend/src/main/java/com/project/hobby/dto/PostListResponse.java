package com.project.hobby.dto;

import com.project.hobby.entity.Post;

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
