package com.project.hobby.controller;

import com.project.hobby.PostRepository;
import com.project.hobby.dto.PostDetailResponse;
import com.project.hobby.dto.PostListResponse;
import com.project.hobby.entity.Post;
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
@Slf4j
public class ApiController {

    @Autowired
    private PostRepository postRepository;

    // 모든 게시글 조회 + 페이징 처리 -> 메인 홈페이지용
    @GetMapping
    public ResponseEntity<Page<PostListResponse>> getPosts(@PageableDefault(size = 12, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        // 1. Repository에서 Page 객체로 데이터를 가져옵니다.
        // findAll(pageable)을 호출하면 내부적으로 limit, offset 쿼리가 실행됩니다.
        Page<Post> postPage = postRepository.findAll(pageable);

        // 2. 엔티티 Page를 DTO Page로 변환합니다.
        Page<PostListResponse> result = postPage.map(p -> new PostListResponse(p.getId(), p.getTitle()));

        // 디버그 정보
        log.info("현재 페이지: {}, 전체 페이지: {}, 전체 게시글 수: {}",
                result.getNumber(), result.getTotalPages(), result.getTotalElements());

        return ResponseEntity.ok(result);
    }

    // 특정 게시글 조회
    @GetMapping("/posts/{id}")
    public ResponseEntity<PostDetailResponse> getPost(@PathVariable Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));

        PostDetailResponse response = new PostDetailResponse(post.getId(), post.getTitle(), post.getContent(), post.getAuthor());

        log.info("게시글 상세 조회 성공: id={}", id);

        return ResponseEntity.ok(response);
    }
}
