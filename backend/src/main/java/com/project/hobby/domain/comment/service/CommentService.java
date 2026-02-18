package com.project.hobby.domain.comment.service;

import com.project.hobby.domain.comment.dto.CommentCreateRequest;
import com.project.hobby.domain.comment.dto.CommentListResponse;
import com.project.hobby.domain.comment.dto.CommentUpdateRequest;
import com.project.hobby.domain.comment.dto.CommentUpdateResponse;
import com.project.hobby.domain.comment.entity.Comment;
import com.project.hobby.domain.comment.repository.CommentRepository;
import com.project.hobby.domain.post.entity.Post;
import com.project.hobby.domain.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Transactional
    public Long save(Long postId, CommentCreateRequest dto) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. Post Id: " + postId));
        return commentRepository.save(dto.toEntity(post)).getId();
    }

    @Transactional(readOnly = true)
    public List<CommentListResponse> getComments(Long postId) {
        List<Comment> comments = commentRepository.findAllByPostId(postId);

        return comments.stream()
                .map(CommentListResponse::from)
                .toList();
    }

    @Transactional
    public Long update(Long commentId, CommentUpdateRequest dto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 없습니다. Comment Id:" + commentId));

        comment.update(dto);
        return commentId;
    }


    @Transactional
    public void delete(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 없습니다. Comment Id:" + commentId));

        commentRepository.delete(comment);
    }

    @Transactional(readOnly = true)
    public CommentUpdateResponse getCommentsForUpdate(Long commentId) {
        return commentRepository.findById(commentId)
                .map(CommentUpdateResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 없습니다. Comment Id:" + commentId));
    }
}
