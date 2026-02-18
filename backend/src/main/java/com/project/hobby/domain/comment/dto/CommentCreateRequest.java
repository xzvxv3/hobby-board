package com.project.hobby.domain.comment.dto;

import com.project.hobby.domain.comment.entity.Comment;
import com.project.hobby.domain.post.entity.Post;

public record CommentCreateRequest(String author, String content) {
    public Comment toEntity(Post post) {
        return Comment.builder()
                .author(author)
                .content(content)
                .post(post)
                .build();
    }
}
