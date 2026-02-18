package com.project.hobby.domain.post.service;

import com.project.hobby.domain.post.repository.PostRepository;
import com.project.hobby.domain.post.dto.*;
import com.project.hobby.dto.*;
import com.project.hobby.domain.post.entity.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 게시글 비즈니스 로직을 처리하는 서비스 클래스입니다.
 */
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    /**
     * 신규 게시글을 생성하여 저장합니다.
     * @param requestDto 등록 요청 데이터 (DTO)
     * @return 저장된 게시글의 ID
     */
    @Transactional
    public Long save(PostCreateRequest requestDto) {
        Post post = Post.builder()
                .author(requestDto.author())
                .title(requestDto.title())
                .content(requestDto.content())
                .date(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build();

        return postRepository.save(post).getId();
    }

    /**
     * 전체 게시글 목록을 페이징하여 조회합니다.
     * @param pageable 페이징 및 정렬 정보
     * @return 페이징된 게시글 목록 DTO
     */
    @Transactional(readOnly = true)
    public Page<PostListResponse> getPostList(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(PostListResponse::from);
    }

    /**
     * 특정 게시글의 상세 내용을 조회합니다.
     * @param id 조회할 게시글 번호
     * @return 게시글 상세 정보 DTO
     * @throws IllegalArgumentException 해당 ID의 게시글이 존재하지 않을 경우 발생
     */
    @Transactional(readOnly = true)
    public PostDetailResponse getPost(Long id) {
        return postRepository.findById(id)
                .map(PostDetailResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
    }

    /**
     * 수정을 위한 기존 게시글 데이터를 조회합니다.
     * @param id 수정할 게시글 번호
     * @return 수정 화면용 게시글 데이터 DTO
     * @throws IllegalArgumentException 해당 ID의 게시글이 존재하지 않을 경우 발생
     */
    @Transactional(readOnly = true)
    public PostUpdateResponse getPostForUpdate(Long id) {
        return postRepository.findById(id)
                .map(PostUpdateResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
    }

    /**
     * 게시글의 제목과 내용을 수정합니다. (변경 감지 활용)
     * @param id 수정할 게시글 번호
     * @param requestDto 수정할 정보가 담긴 요청 데이터
     * @return 수정 완료된 게시글 번호
     */
    @Transactional
    public Long update(Long id, PostUpdateRequest requestDto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다 id=" + id));

        // Dirty Checking을 통해 변경 사항이 트랜잭션 종료 시점에 DB에 반영됨
        post.update(requestDto.title(), requestDto.content());

        return id;
    }

    /**
     * 게시글을 영구 삭제합니다.
     * @param id 삭제할 게시글 번호
     */
    @Transactional
    public void delete(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다 id=" + id));

        postRepository.delete(post);
    }
}