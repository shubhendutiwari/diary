package com.diary.service;

import com.diary.dto.DiaryEntryRequest;
import com.diary.dto.DiaryEntryResponse;
import com.diary.model.DiaryEntry;
import com.diary.model.User;
import com.diary.repository.BookmarkRepository;
import com.diary.repository.CommentRepository;
import com.diary.repository.DiaryEntryRepository;
import com.diary.repository.EntryLikeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiaryService {

    private final DiaryEntryRepository diaryEntryRepository;
    private final EntryLikeRepository entryLikeRepository;
    private final CommentRepository commentRepository;
    private final BookmarkRepository bookmarkRepository;

    public DiaryService(DiaryEntryRepository diaryEntryRepository,
                        EntryLikeRepository entryLikeRepository,
                        CommentRepository commentRepository,
                        BookmarkRepository bookmarkRepository) {
        this.diaryEntryRepository = diaryEntryRepository;
        this.entryLikeRepository = entryLikeRepository;
        this.commentRepository = commentRepository;
        this.bookmarkRepository = bookmarkRepository;
    }

    private DiaryEntryResponse toResponse(DiaryEntry entry, User currentUser) {
        long likeCount = entryLikeRepository.countByDiaryEntry(entry);
        long commentCount = commentRepository.countByDiaryEntry(entry);
        boolean likedByCurrentUser = currentUser != null
                && entryLikeRepository.existsByDiaryEntryAndUser(entry, currentUser);
        boolean bookmarkedByCurrentUser = currentUser != null
                && bookmarkRepository.existsByUserAndDiaryEntry(currentUser, entry);
        return DiaryEntryResponse.fromEntity(entry, likeCount, commentCount, likedByCurrentUser, bookmarkedByCurrentUser);
    }

    public List<DiaryEntryResponse> getUserEntries(User user) {
        return diaryEntryRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(entry -> toResponse(entry, user))
                .collect(Collectors.toList());
    }

    public List<DiaryEntryResponse> getPublicFeed(User currentUser) {
        return diaryEntryRepository.findByIsPublicTrueOrderByCreatedAtDesc()
                .stream()
                .map(entry -> toResponse(entry, currentUser))
                .collect(Collectors.toList());
    }

    // Search user's own entries
    public List<DiaryEntryResponse> searchUserEntries(User user, String query) {
        return diaryEntryRepository.searchUserEntries(user, query)
                .stream()
                .map(entry -> toResponse(entry, user))
                .collect(Collectors.toList());
    }

    // Search public entries
    public List<DiaryEntryResponse> searchPublicEntries(String query, User currentUser) {
        return diaryEntryRepository.searchPublicEntries(query)
                .stream()
                .map(entry -> toResponse(entry, currentUser))
                .collect(Collectors.toList());
    }

    // Get bookmarked entries
    public List<DiaryEntryResponse> getBookmarkedEntries(User user) {
        return bookmarkRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(b -> toResponse(b.getDiaryEntry(), user))
                .collect(Collectors.toList());
    }

    public DiaryEntryResponse createEntry(User user, DiaryEntryRequest request) {
        DiaryEntry entry = new DiaryEntry(
                user,
                request.getTitle(),
                request.getContent(),
                request.getMood(),
                request.isPublic());
        entry = diaryEntryRepository.save(entry);
        return toResponse(entry, user);
    }

    public DiaryEntryResponse updateEntry(Long id, User user, DiaryEntryRequest request) {
        DiaryEntry entry = diaryEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        if (!entry.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to edit this entry");
        }

        entry.setTitle(request.getTitle());
        entry.setContent(request.getContent());
        entry.setMood(request.getMood());
        entry.setPublic(request.isPublic());

        entry = diaryEntryRepository.save(entry);
        return toResponse(entry, user);
    }

    @Transactional
    public void deleteEntry(Long id, User user) {
        DiaryEntry entry = diaryEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        if (!entry.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this entry");
        }

        // Clean up associated likes, comments, and bookmarks first
        entryLikeRepository.deleteAllByDiaryEntry(entry);
        commentRepository.deleteAllByDiaryEntry(entry);
        bookmarkRepository.deleteAllByDiaryEntry(entry);
        diaryEntryRepository.delete(entry);
    }

    public DiaryEntryResponse getEntryById(Long id, User currentUser) {
        DiaryEntry entry = diaryEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entry not found"));
        return toResponse(entry, currentUser);
    }
}
