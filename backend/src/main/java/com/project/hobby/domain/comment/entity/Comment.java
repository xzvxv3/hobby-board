package com.project.hobby.domain.comment.entity;

import com.project.hobby.domain.comment.dto.CommentCreateRequest;
import com.project.hobby.domain.comment.dto.CommentUpdateRequest;
import com.project.hobby.domain.post.entity.Post;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String author;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @Builder
    public Comment(String content, String author, Post post) {
        this.content = content;
        this.author = author;
        this.post = post;
    }

    public void update(CommentUpdateRequest dto) {
        this.content = dto.content();
    }
}
