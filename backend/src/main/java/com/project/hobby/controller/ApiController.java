package com.project.hobby.controller;

import com.project.hobby.PostRepository;
import com.project.hobby.dto.PostDetailResponse;
import com.project.hobby.dto.PostListResponse;
import com.project.hobby.entity.Post;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class ApiController {

    @Autowired
    private PostRepository postRepository;

    // 모든 게시글 조회 -> 메인 홈페이지용
    @GetMapping
    public ResponseEntity<List<PostListResponse>> getPosts() {
        // DB의 모든 게시글을 가져와 DTO로 변환해서 반환
        List<PostListResponse> result = postRepository.findAll().stream()
                .map(p -> new PostListResponse(p.getId(), p.getTitle()))
                .toList();

        // 디버그
        log.info("조회된 게시글 개수: {}", result.size());
        log.debug("상세 데이터: {}", result);

        return ResponseEntity.ok(result);
    }

    // 특정 게시글 조회
    @GetMapping("/posts/{id}")
    public ResponseEntity<PostDetailResponse> getPost(@PathVariable Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));

        PostDetailResponse response = new PostDetailResponse(post.getId(), post.getTitle(), post.getContent());

        log.info("게시글 상세 조회 성공: id={}", id);

        return ResponseEntity.ok(response);
    }
}
