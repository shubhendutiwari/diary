import { useAuth } from '../hooks/useAuth';

export default function DiaryCard({ entry, onClick, showActions, onEdit, onDelete, onLike, onBookmark }) {
    const { user } = useAuth();

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const truncateContent = (text, maxLen = 150) =>
        text.length <= maxLen ? text : text.substring(0, maxLen) + '...';

    const handleLike = (e) => {
        e.stopPropagation();
        if (!user) { window.location.href = '/login'; return; }
        onLike?.(entry.id);
    };

    const handleBookmark = (e) => {
        e.stopPropagation();
        if (!user) { window.location.href = '/login'; return; }
        onBookmark?.(entry.id);
    };

    const handleShare = (e) => {
        e.stopPropagation();
        const url = `${window.location.origin}/entry/${entry.id}`;
        if (navigator.share) {
            navigator.share({ title: entry.title, text: truncateContent(entry.content, 100), url });
        } else {
            navigator.clipboard.writeText(url);
            // Show a quick visual feedback
            const btn = e.currentTarget;
            btn.textContent = '✅';
            setTimeout(() => { btn.textContent = '🔗'; }, 1200);
        }
    };

    const readingTime = entry.readingTimeSeconds
        ? entry.readingTimeSeconds < 60 ? '<1 min' : `${Math.round(entry.readingTimeSeconds / 60)} min read`
        : '';

    return (
        <div className="diary-card glass-card" onClick={onClick} id={`diary-card-${entry.id}`}>
            <div className="diary-card-header">
                <h3 className="diary-card-title">{entry.title}</h3>
                {entry.mood && <span className="diary-card-mood">{entry.mood}</span>}
            </div>

            <p className="diary-card-content">{truncateContent(entry.content)}</p>

            <div className="diary-card-footer">
                <div className="diary-card-meta">
                    <span className="diary-card-author">@{entry.authorUsername}</span>
                    <span>•</span>
                    <span className="diary-card-date">{formatDate(entry.createdAt)}</span>
                    {readingTime && <><span>•</span><span className="diary-card-reading">{readingTime}</span></>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`visibility-badge ${entry.public ? 'public' : 'private'}`}>
                        {entry.public ? '🌍 Public' : '🔒 Private'}
                    </span>

                    {showActions && (
                        <div className="diary-card-actions">
                            <button className="btn btn-icon btn-secondary" onClick={(e) => { e.stopPropagation(); onEdit?.(entry); }} title="Edit" id={`edit-entry-${entry.id}`}>✏️</button>
                            <button className="btn btn-icon btn-danger" onClick={(e) => { e.stopPropagation(); onDelete?.(entry.id); }} title="Delete" id={`delete-entry-${entry.id}`}>🗑️</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Social interaction bar */}
            <div className="diary-card-social">
                <button className={`social-btn like-btn ${entry.likedByCurrentUser ? 'liked' : ''}`} onClick={handleLike} id={`like-btn-${entry.id}`}>
                    <span className="like-icon">{entry.likedByCurrentUser ? '❤️' : '🤍'}</span>
                    <span className="like-count">{entry.likeCount || 0}</span>
                </button>

                <button className="social-btn comment-btn" onClick={(e) => { e.stopPropagation(); onClick?.(); }} id={`comment-btn-${entry.id}`}>
                    <span>💬</span><span>{entry.commentCount || 0}</span>
                </button>

                <button className={`social-btn bookmark-btn ${entry.bookmarkedByCurrentUser ? 'bookmarked' : ''}`} onClick={handleBookmark} id={`bookmark-btn-${entry.id}`}>
                    <span>{entry.bookmarkedByCurrentUser ? '🔖' : '📑'}</span>
                </button>

                {entry.public && (
                    <button className="social-btn share-btn" onClick={handleShare} id={`share-btn-${entry.id}`} title="Share">
                        🔗
                    </button>
                )}
            </div>
        </div>
    );
}
