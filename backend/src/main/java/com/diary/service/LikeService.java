package com.diary.service;

import com.diary.model.DiaryEntry;
import com.diary.model.EntryLike;
import com.diary.model.User;
import com.diary.repository.DiaryEntryRepository;
import com.diary.repository.EntryLikeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class LikeService {

    private final EntryLikeRepository entryLikeRepository;
    private final DiaryEntryRepository diaryEntryRepository;

    public LikeService(EntryLikeRepository entryLikeRepository, DiaryEntryRepository diaryEntryRepository) {
        this.entryLikeRepository = entryLikeRepository;
        this.diaryEntryRepository = diaryEntryRepository;
    }

    @Transactional
    public Map<String, Object> toggleLike(Long entryId, User user) {
        DiaryEntry entry = diaryEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        boolean alreadyLiked = entryLikeRepository.existsByDiaryEntryAndUser(entry, user);

        if (alreadyLiked) {
            entryLikeRepository.deleteByDiaryEntryAndUser(entry, user);
        } else {
            entryLikeRepository.save(new EntryLike(user, entry));
        }

        long newCount = entryLikeRepository.countByDiaryEntry(entry);
        return Map.of(
                "liked", !alreadyLiked,
                "likeCount", newCount
        );
    }

    public long getLikeCount(DiaryEntry entry) {
        return entryLikeRepository.countByDiaryEntry(entry);
    }

    public boolean isLikedByUser(DiaryEntry entry, User user) {
        if (user == null) return false;
        return entryLikeRepository.existsByDiaryEntryAndUser(entry, user);
    }
}
