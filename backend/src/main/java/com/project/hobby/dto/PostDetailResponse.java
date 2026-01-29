package com.project.hobby.dto;

import com.project.hobby.entity.Post;

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
