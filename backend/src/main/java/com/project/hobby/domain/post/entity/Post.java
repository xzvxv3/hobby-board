package com.project.hobby.domain.post.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "posts")
public class Post {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String content;
    private String author;
    private String date;

    /**
     * 게시글 생성을 위한 전용 빌더 생성자
     * * @Builder를 클래스 레벨이 아닌 생성자 레벨에 선언하여,
     * DB가 자동 생성하는 ID나 생성일시(createdAt) 등을 제외하고
     * 실제 서비스 로직에서 필요한 필드만으로 객체를 생성하도록 제한함.
     */

    // TODO
    // Date을 LocalDateTime으로 변경할것
    @Builder
    public Post(String title, String content, String author, String date) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.date = date;
    }

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }
}
