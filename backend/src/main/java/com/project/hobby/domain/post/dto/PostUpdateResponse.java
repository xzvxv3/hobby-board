package com.project.hobby.domain.post.dto;

import com.project.hobby.domain.post.entity.Post;

public record PostUpdateResponse(String title, String content) {
    public static PostUpdateResponse from(Post post) {
        return new PostUpdateResponse(
                post.getTitle(),
                post.getContent()
        );
    }
}
