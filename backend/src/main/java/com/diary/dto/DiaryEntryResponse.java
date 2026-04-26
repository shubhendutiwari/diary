package com.diary.dto;

import com.diary.model.DiaryEntry;
import java.time.LocalDateTime;

public class DiaryEntryResponse {

    private Long id;
    private String title;
    private String content;
    private String mood;
    private boolean isPublic;
    private String authorUsername;
    private Long authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long likeCount;
    private long commentCount;
    private boolean likedByCurrentUser;
    private boolean bookmarkedByCurrentUser;
    private int wordCount;
    private int readingTimeSeconds;

    public DiaryEntryResponse() {}

    public static DiaryEntryResponse fromEntity(DiaryEntry entry) {
        return fromEntity(entry, 0, 0, false, false);
    }

    public static DiaryEntryResponse fromEntity(DiaryEntry entry, long likeCount, long commentCount,
                                                  boolean likedByCurrentUser, boolean bookmarkedByCurrentUser) {
        DiaryEntryResponse response = new DiaryEntryResponse();
        response.setId(entry.getId());
        response.setTitle(entry.getTitle());
        response.setContent(entry.getContent());
        response.setMood(entry.getMood());
        response.setPublic(entry.isPublic());
        response.setAuthorUsername(entry.getUser().getUsername());
        response.setAuthorId(entry.getUser().getId());
        response.setCreatedAt(entry.getCreatedAt());
        response.setUpdatedAt(entry.getUpdatedAt());
        response.setLikeCount(likeCount);
        response.setCommentCount(commentCount);
        response.setLikedByCurrentUser(likedByCurrentUser);
        response.setBookmarkedByCurrentUser(bookmarkedByCurrentUser);

        // Calculate word count and reading time
        String text = entry.getContent();
        int words = text == null || text.isBlank() ? 0 : text.trim().split("\\s+").length;
        response.setWordCount(words);
        response.setReadingTimeSeconds(Math.max(1, words * 60 / 200)); // 200 WPM

        return response;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }

    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean aPublic) { isPublic = aPublic; }

    public String getAuthorUsername() { return authorUsername; }
    public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public long getLikeCount() { return likeCount; }
    public void setLikeCount(long likeCount) { this.likeCount = likeCount; }

    public long getCommentCount() { return commentCount; }
    public void setCommentCount(long commentCount) { this.commentCount = commentCount; }

    public boolean isLikedByCurrentUser() { return likedByCurrentUser; }
    public void setLikedByCurrentUser(boolean likedByCurrentUser) { this.likedByCurrentUser = likedByCurrentUser; }

    public boolean isBookmarkedByCurrentUser() { return bookmarkedByCurrentUser; }
    public void setBookmarkedByCurrentUser(boolean b) { this.bookmarkedByCurrentUser = b; }

    public int getWordCount() { return wordCount; }
    public void setWordCount(int wordCount) { this.wordCount = wordCount; }

    public int getReadingTimeSeconds() { return readingTimeSeconds; }
    public void setReadingTimeSeconds(int readingTimeSeconds) { this.readingTimeSeconds = readingTimeSeconds; }
}
