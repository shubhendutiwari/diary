package com.diary.dto;

import com.diary.model.Comment;
import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;
    private String content;
    private String authorUsername;
    private Long authorId;
    private LocalDateTime createdAt;

    public CommentResponse() {}

    public static CommentResponse fromEntity(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setAuthorUsername(comment.getUser().getUsername());
        response.setAuthorId(comment.getUser().getId());
        response.setCreatedAt(comment.getCreatedAt());
        return response;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getAuthorUsername() { return authorUsername; }
    public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
