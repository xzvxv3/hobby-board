package com.project.hobby.controller;

import com.project.hobby.PostRepository;
import com.project.hobby.dto.PostDetailResponse;
import com.project.hobby.dto.PostListResponse;
import com.project.hobby.dto.PostUpdateRequest;
import com.project.hobby.entity.Post;
import com.project.hobby.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@Slf4j
public class ApiController {

    private final PostRepository postRepository;
    private final PostService postService;

    // 모든 게시글 조회 + 페이징 처리 -> 메인 홈페이지용
    @GetMapping
    public ResponseEntity<Page<PostListResponse>> getPosts(
            @PageableDefault(size = 12, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(postService.getPostList(pageable));
    }

    // 특정 게시글 조회
    @GetMapping("/posts/{id}")
    public ResponseEntity<PostDetailResponse> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }
}
