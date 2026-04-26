package com.diary.service;

import com.diary.model.Bookmark;
import com.diary.model.DiaryEntry;
import com.diary.model.User;
import com.diary.repository.BookmarkRepository;
import com.diary.repository.DiaryEntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final DiaryEntryRepository diaryEntryRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository, DiaryEntryRepository diaryEntryRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.diaryEntryRepository = diaryEntryRepository;
    }

    @Transactional
    public Map<String, Object> toggleBookmark(Long entryId, User user) {
        DiaryEntry entry = diaryEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        boolean alreadyBookmarked = bookmarkRepository.existsByUserAndDiaryEntry(user, entry);

        if (alreadyBookmarked) {
            bookmarkRepository.deleteByUserAndDiaryEntry(user, entry);
        } else {
            bookmarkRepository.save(new Bookmark(user, entry));
        }

        return Map.of("bookmarked", !alreadyBookmarked);
    }

    public boolean isBookmarkedByUser(DiaryEntry entry, User user) {
        if (user == null) return false;
        return bookmarkRepository.existsByUserAndDiaryEntry(user, entry);
    }
}
