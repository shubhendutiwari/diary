package com.diary.controller;

import com.diary.dto.CommentRequest;
import com.diary.dto.CommentResponse;
import com.diary.dto.DiaryEntryRequest;
import com.diary.dto.DiaryEntryResponse;
import com.diary.model.User;
import com.diary.service.BookmarkService;
import com.diary.service.CommentService;
import com.diary.service.DiaryService;
import com.diary.service.LikeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DiaryController {

    private final DiaryService diaryService;
    private final LikeService likeService;
    private final CommentService commentService;
    private final BookmarkService bookmarkService;

    public DiaryController(DiaryService diaryService, LikeService likeService,
                           CommentService commentService, BookmarkService bookmarkService) {
        this.diaryService = diaryService;
        this.likeService = likeService;
        this.commentService = commentService;
        this.bookmarkService = bookmarkService;
    }

    // ─── Feed ───────────────────────────────────────────────

    @GetMapping("/feed")
    public ResponseEntity<List<DiaryEntryResponse>> getPublicFeed(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(diaryService.getPublicFeed(user));
    }

    // Search public feed
    @GetMapping("/feed/search")
    public ResponseEntity<List<DiaryEntryResponse>> searchPublicFeed(
            @RequestParam String q,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(diaryService.searchPublicEntries(q, user));
    }

    // ─── Diary CRUD ─────────────────────────────────────────

    @GetMapping("/diary")
    public ResponseEntity<List<DiaryEntryResponse>> getMyEntries(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(diaryService.getUserEntries(user));
    }

    // Search user's diary
    @GetMapping("/diary/search")
    public ResponseEntity<List<DiaryEntryResponse>> searchMyEntries(
            @RequestParam String q,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(diaryService.searchUserEntries(user, q));
    }

    @PostMapping("/diary")
    public ResponseEntity<DiaryEntryResponse> createEntry(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DiaryEntryRequest request) {
        return ResponseEntity.ok(diaryService.createEntry(user, request));
    }

    @PutMapping("/diary/{id}")
    public ResponseEntity<DiaryEntryResponse> updateEntry(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DiaryEntryRequest request) {
        return ResponseEntity.ok(diaryService.updateEntry(id, user, request));
    }

    @DeleteMapping("/diary/{id}")
    public ResponseEntity<Void> deleteEntry(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        diaryService.deleteEntry(id, user);
        return ResponseEntity.noContent().build();
    }

    // ─── Likes ──────────────────────────────────────────────

    @PostMapping("/diary/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(likeService.toggleLike(id, user));
    }

    // ─── Bookmarks ──────────────────────────────────────────

    @PostMapping("/diary/{id}/bookmark")
    public ResponseEntity<Map<String, Object>> toggleBookmark(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookmarkService.toggleBookmark(id, user));
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<List<DiaryEntryResponse>> getBookmarks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(diaryService.getBookmarkedEntries(user));
    }

    // ─── Comments ───────────────────────────────────────────

    @GetMapping("/diary/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getComments(id));
    }

    @PostMapping("/diary/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.addComment(id, user, request));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        commentService.deleteComment(id, user);
        return ResponseEntity.noContent().build();
    }

    // ─── Writing Prompts ────────────────────────────────────

    @GetMapping("/prompts")
    public ResponseEntity<List<String>> getWritingPrompts() {
        List<String> prompts = List.of(
                "What made you smile today?",
                "Describe a moment that surprised you recently.",
                "If you could relive one day from this year, which would it be?",
                "Write a letter to your future self.",
                "What's a small thing you're grateful for right now?",
                "Describe the view from your window right now.",
                "What's a lesson you learned the hard way?",
                "If today had a soundtrack, what song would it be?",
                "What's one thing you want to remember about today?",
                "Write about someone who made a difference in your life.",
                "What does your ideal morning look like?",
                "Describe a place that feels like home.",
                "What are you most curious about right now?",
                "Write about a fear you've overcome.",
                "What would you tell your younger self?"
        );
        // Return 3 random prompts
        java.util.Collections.shuffle(new java.util.ArrayList<>(prompts));
        return ResponseEntity.ok(prompts.subList(0, Math.min(3, prompts.size())));
    }
}
