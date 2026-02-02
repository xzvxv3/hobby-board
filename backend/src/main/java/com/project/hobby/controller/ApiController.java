package com.project.hobby.controller;

import com.project.hobby.dto.*;
import com.project.hobby.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

/**
 * 게시글 관련 REST API를 처리하는 컨트롤러입니다.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 서버 허용
@RequiredArgsConstructor
@Slf4j
public class ApiController {

    private final PostService postService;

    /**
     * 신규 게시글 등록
     * @param requestDto 등록할 게시글 정보 (제목, 내용, 작성자)
     * @return 생성된 게시글의 데이터베이스 ID
     */
    @PostMapping("/posts")
    public ResponseEntity<Long> save(@RequestBody PostCreateRequest requestDto) {
        log.info("[POST] 게시글 등록 수행 - Author: {}, Title: {}, Content: {}", requestDto.author(), requestDto.title(), requestDto.content());
        return ResponseEntity.ok(postService.save(requestDto));
    }

    /**
     * 게시글 목록 조회 (페이징 처리)
     * @param pageable 페이지 번호, 사이즈, 정렬 기준 (기본값: 최신순 12개)
     * @return 페이징 처리된 게시글 목록
     */
    @GetMapping
    public ResponseEntity<Page<PostListResponse>> getPosts(
            @PageableDefault(size = 12, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("[GET] 게시글 목록 조회 - Page: {}, Size: {}", pageable.getPageNumber() + 1, pageable.getPageSize());
        return ResponseEntity.ok(postService.getPostList(pageable));
    }

    /**
     * 게시글 상세 조회
     * @param id 조회할 게시글 번호
     * @return 게시글 상세 정보
     */
    @GetMapping("/posts/{id}")
    public ResponseEntity<PostDetailResponse> getPost(@PathVariable Long id) {
        log.info("[GET] 게시글 상세 조회 - ID: {}", id);
        return ResponseEntity.ok(postService.getPost(id));
    }

    /**
     * 게시글 수정 화면용 데이터 조회
     * @param id 수정할 게시글 번호
     * @return 수정 폼에 필요한 기존 데이터
     */
    @GetMapping("/posts/{id}/edit")
    public ResponseEntity<PostUpdateResponse> edit(@PathVariable Long id) {
        log.info("[GET] 게시글 수정 화면 데이터 요청 - ID: {}", id);
        return ResponseEntity.ok(postService.getPostForUpdate(id));
    }

    /**
     * 게시글 데이터 수정 수행
     * @param id 수정할 게시글 번호
     * @param requestDto 수정할 제목과 내용
     * @return 수정된 게시글 번호
     */
    @PutMapping("/posts/{id}")
    public ResponseEntity<Long> update(@PathVariable Long id, @RequestBody PostUpdateRequest requestDto) {
        log.info("[PUT] 게시글 수정 수행 - ID: {}, Title: {}, Content: {}", id, requestDto.title(), requestDto.content());
        return ResponseEntity.ok(postService.update(id, requestDto));
    }

    /**
     * 게시글 삭제 수행
     * @param id 삭제할 게시글 번호
     * @return 응답 본문 없음 (204 No Content)
     */
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("[DELETE] 게시글 삭제 수행 - ID: {}", id);
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}