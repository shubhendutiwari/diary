package com.diary.repository;

import com.diary.model.DiaryEntry;
import com.diary.model.EntryLike;
import com.diary.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EntryLikeRepository extends JpaRepository<EntryLike, Long> {
    Optional<EntryLike> findByDiaryEntryAndUser(DiaryEntry diaryEntry, User user);
    boolean existsByDiaryEntryAndUser(DiaryEntry diaryEntry, User user);
    long countByDiaryEntry(DiaryEntry diaryEntry);
    void deleteByDiaryEntryAndUser(DiaryEntry diaryEntry, User user);
    void deleteAllByDiaryEntry(DiaryEntry diaryEntry);
}
