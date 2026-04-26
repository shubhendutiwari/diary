package com.diary.repository;

import com.diary.model.DiaryEntry;
import com.diary.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, Long> {
    List<DiaryEntry> findByUserOrderByCreatedAtDesc(User user);
    List<DiaryEntry> findByIsPublicTrueOrderByCreatedAtDesc();

    // Search user's entries by title or content
    @Query("SELECT e FROM DiaryEntry e WHERE e.user = :user AND (LOWER(e.title) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(e.content) LIKE LOWER(CONCAT('%',:q,'%'))) ORDER BY e.createdAt DESC")
    List<DiaryEntry> searchUserEntries(@Param("user") User user, @Param("q") String query);

    // Search public entries
    @Query("SELECT e FROM DiaryEntry e WHERE e.isPublic = true AND (LOWER(e.title) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(e.content) LIKE LOWER(CONCAT('%',:q,'%'))) ORDER BY e.createdAt DESC")
    List<DiaryEntry> searchPublicEntries(@Param("q") String query);
}
