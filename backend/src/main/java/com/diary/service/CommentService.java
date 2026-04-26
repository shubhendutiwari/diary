package com.diary.service;

import com.diary.dto.CommentRequest;
import com.diary.dto.CommentResponse;
import com.diary.model.Comment;
import com.diary.model.DiaryEntry;
import com.diary.model.User;
import com.diary.repository.CommentRepository;
import com.diary.repository.DiaryEntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final DiaryEntryRepository diaryEntryRepository;

    public CommentService(CommentRepository commentRepository, DiaryEntryRepository diaryEntryRepository) {
        this.commentRepository = commentRepository;
        this.diaryEntryRepository = diaryEntryRepository;
    }

    public List<CommentResponse> getComments(Long entryId) {
        DiaryEntry entry = diaryEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        return commentRepository.findByDiaryEntryOrderByCreatedAtDesc(entry)
                .stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public CommentResponse addComment(Long entryId, User user, CommentRequest request) {
        DiaryEntry entry = diaryEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        // Only allow commenting on public entries or own entries
        if (!entry.isPublic() && !entry.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Cannot comment on this entry");
        }

        Comment comment = new Comment(request.getContent(), user, entry);
        comment = commentRepository.save(comment);
        return CommentResponse.fromEntity(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    public long getCommentCount(DiaryEntry entry) {
        return commentRepository.countByDiaryEntry(entry);
    }
}
