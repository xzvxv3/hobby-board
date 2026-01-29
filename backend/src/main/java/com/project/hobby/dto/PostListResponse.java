package com.project.hobby.dto;

import com.project.hobby.entity.Post;

public record PostListResponse(Long id, String title, String author, String date) {
    public static PostListResponse from(Post post) {
        return new PostListResponse(
                post.getId(),
                post.getTitle(),
                post.getAuthor(),
                post.getDate()
        );
    }
}
