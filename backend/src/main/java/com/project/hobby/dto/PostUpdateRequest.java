package com.project.hobby.dto;

import com.project.hobby.entity.Post;

public record PostUpdateRequest(String title, String content) {
    public static PostUpdateRequest from(Post post) {
        return new PostUpdateRequest(
                post.getTitle(),
                post.getContent()
        );
    }
}
