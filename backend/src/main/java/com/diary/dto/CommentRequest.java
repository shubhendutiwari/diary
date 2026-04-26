package com.diary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CommentRequest {

    @NotBlank(message = "Comment cannot be empty")
    @Size(max = 500, message = "Comment must be at most 500 characters")
    private String content;

    public CommentRequest() {}

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
