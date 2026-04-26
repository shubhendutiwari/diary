package com.diary.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "entry_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "entry_id"})
})
public class EntryLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entry_id", nullable = false)
    private DiaryEntry diaryEntry;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Constructors
    public EntryLike() {}

    public EntryLike(User user, DiaryEntry diaryEntry) {
        this.user = user;
        this.diaryEntry = diaryEntry;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public DiaryEntry getDiaryEntry() { return diaryEntry; }
    public void setDiaryEntry(DiaryEntry diaryEntry) { this.diaryEntry = diaryEntry; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
