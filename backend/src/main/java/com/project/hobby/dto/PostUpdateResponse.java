package com.project.hobby.dto;

import com.project.hobby.entity.Post;

public record PostUpdateResponse(String title, String content) {
    public static PostUpdateResponse from(Post post) {
        return new PostUpdateResponse(
                post.getTitle(),
                post.getContent()
        );
    }
}
