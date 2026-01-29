package com.project.hobby.service;

import com.project.hobby.PostRepository;
import com.project.hobby.dto.PostDetailResponse;
import com.project.hobby.dto.PostListResponse;
import com.project.hobby.dto.PostUpdateRequest;
import com.project.hobby.entity.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public Page<PostListResponse> getPostList(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(PostListResponse::from);
    }

    @Transactional(readOnly = true)
    public PostDetailResponse getPost(Long id) {
        return postRepository.findById(id)
                .map(PostDetailResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
    }
}
