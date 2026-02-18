package com.project.hobby.domain.comment.dto;

import com.project.hobby.domain.comment.entity.Comment;

public record CommentUpdateResponse(Long id, String author, String content) {
    public static CommentUpdateResponse from(Comment comment) {
        return new CommentUpdateResponse(
                comment.getId(),
                comment.getAuthor(),
                comment.getContent()
        );
    }
}
