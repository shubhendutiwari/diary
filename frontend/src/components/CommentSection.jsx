import { useState, useEffect } from 'react';
import { diaryAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function CommentSection({ entryId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [entryId]);

    const loadComments = async () => {
        try {
            const res = await diaryAPI.getComments(entryId);
            setComments(res.data);
        } catch (err) {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || submitting) return;

        setSubmitting(true);
        try {
            const res = await diaryAPI.addComment(entryId, newComment.trim());
            setComments([res.data, ...comments]);
            setNewComment('');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await diaryAPI.deleteComment(commentId);
            setComments(comments.filter((c) => c.id !== commentId));
        } catch (err) {
            alert('Failed to delete comment');
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="comment-section" id="comment-section">
            <h3 className="comment-section-title">
                💬 Comments {comments.length > 0 && <span className="comment-count-badge">{comments.length}</span>}
            </h3>

            {/* Add comment form */}
            {user ? (
                <form className="comment-form" onSubmit={handleSubmit} id="comment-form">
                    <input
                        className="comment-input input"
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        maxLength={500}
                        id="comment-input"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary btn-comment-submit"
                        disabled={submitting || !newComment.trim()}
                        id="comment-submit-btn"
                    >
                        {submitting ? '...' : '→'}
                    </button>
                </form>
            ) : (
                <p className="comment-login-hint">
                    <a href="/login">Log in</a> to leave a comment
                </p>
            )}

            {/* Comment list */}
            {loading ? (
                <div className="loading" style={{ padding: '16px' }}>
                    <div className="loading-spinner" style={{ width: '24px', height: '24px' }}></div>
                </div>
            ) : comments.length === 0 ? (
                <p className="comment-empty">No comments yet. Be the first!</p>
            ) : (
                <div className="comment-list">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment-item" id={`comment-${comment.id}`}>
                            <div className="comment-item-header">
                                <div className="comment-author-avatar">
                                    {comment.authorUsername.charAt(0).toUpperCase()}
                                </div>
                                <div className="comment-item-meta">
                                    <span className="comment-author">@{comment.authorUsername}</span>
                                    <span className="comment-time">{formatDate(comment.createdAt)}</span>
                                </div>
                                {user && user.id === comment.authorId && (
                                    <button
                                        className="comment-delete-btn"
                                        onClick={() => handleDelete(comment.id)}
                                        title="Delete comment"
                                        id={`delete-comment-${comment.id}`}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <p className="comment-content">{comment.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
