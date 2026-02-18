package com.project.hobby.domain.comment.controller;

import com.project.hobby.domain.comment.dto.CommentCreateRequest;
import com.project.hobby.domain.comment.dto.CommentListResponse;
import com.project.hobby.domain.comment.dto.CommentUpdateRequest;
import com.project.hobby.domain.comment.dto.CommentUpdateResponse;
import com.project.hobby.domain.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
@Slf4j
public class CommentApiController {

    private final CommentService commentService;

    /**
     * 댓글 등록 API
     * [POST] /api/posts/{postId}/comments : 댓글 저장
     */
    @PostMapping
    public ResponseEntity<Long> save(@PathVariable Long postId, @RequestBody CommentCreateRequest requestDto) {
        log.info("[POST] 댓글 등록 - Post ID: {}, Author: {}", postId, requestDto.author());
        return ResponseEntity.ok(commentService.save(postId, requestDto));
    }

    /**
     * 댓글 조회 API
     * [GET] /api/posts/{postId}/comments : 댓글 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<CommentListResponse>> getComments(@PathVariable Long postId) {
        log.info("[GET] 댓글 목록 조회 - Post ID: {}", postId);
        return ResponseEntity.ok(commentService.getComments(postId));
    }

    /**
     * 댓글 수정 API
     * [GET] /api/posts/{postId}/comments/{commentId}/edit : 수정용 기존 데이터 조회
     */
    @GetMapping("/{commentId}/edit")
    public ResponseEntity<CommentUpdateResponse> getCommentsForUpdate(@PathVariable Long commentId) {
        log.info("[GET] 댓글 수정 화면 데이터 요청 - Comment ID: {}", commentId);
        return ResponseEntity.ok(commentService.getCommentsForUpdate(commentId));
    }

    /**
     * 댓글 수정 API
     * [PUT] /api/posts/{postId}/comments/{commentId} : 댓글 실제 수정 반영
     */
    @PutMapping("/{commentId}")
    public ResponseEntity<Long> update(@PathVariable Long commentId, @RequestBody CommentUpdateRequest commentUpdateRequest) {
        log.info("[PUT] 댓글 수정 - Comment ID: {}", commentId);
        return ResponseEntity.ok(commentService.update(commentId, commentUpdateRequest));
    }

    /**
     * 댓글 삭제 API
     * [DELETE] /api/posts/{postId}/comments/{commentId} : 댓글 삭제
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable Long commentId) {
        log.info("[DELETE] 댓글 삭제 - Comment ID: {}", commentId);
        commentService.delete(commentId);
        return ResponseEntity.noContent().build();
    }
}
