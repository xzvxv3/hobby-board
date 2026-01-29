package com.project.hobby.dto;

import com.project.hobby.entity.Post;

public record PostDetailResponse(String title, String content, String author, String date) {
    public static PostDetailResponse from(Post post) {
        return new PostDetailResponse(
                post.getTitle(),
                post.getContent(),
                post.getAuthor(),
                post.getDate()
        );
    }
}
