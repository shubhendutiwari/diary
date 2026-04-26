package com.diary.repository;

import com.diary.model.Comment;
import com.diary.model.DiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByDiaryEntryOrderByCreatedAtDesc(DiaryEntry diaryEntry);
    long countByDiaryEntry(DiaryEntry diaryEntry);
    void deleteAllByDiaryEntry(DiaryEntry diaryEntry);
}
