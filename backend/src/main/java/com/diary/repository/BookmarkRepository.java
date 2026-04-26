package com.diary.repository;

import com.diary.model.Bookmark;
import com.diary.model.DiaryEntry;
import com.diary.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByUserAndDiaryEntry(User user, DiaryEntry entry);
    boolean existsByUserAndDiaryEntry(User user, DiaryEntry entry);
    List<Bookmark> findByUserOrderByCreatedAtDesc(User user);
    void deleteByUserAndDiaryEntry(User user, DiaryEntry entry);
    void deleteAllByDiaryEntry(DiaryEntry entry);
}
