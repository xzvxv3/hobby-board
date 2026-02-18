package com.project.hobby.domain.comment.dto;

import com.project.hobby.domain.comment.entity.Comment;

public record CommentListResponse(Long id, String author, String content) {
    public static CommentListResponse from(Comment comment) {
        return new CommentListResponse(
                comment.getId(),
                comment.getAuthor(),
                comment.getContent()
        );
    }
}
