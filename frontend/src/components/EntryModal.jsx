import CommentSection from './CommentSection';

export default function EntryModal({ entry, onClose, onLike, onBookmark }) {
    if (!entry) return null;

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const handleShare = () => {
        const url = `${window.location.origin}/entry/${entry.id}`;
        if (navigator.share) {
            navigator.share({ title: entry.title, text: entry.content.substring(0, 100), url });
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    };

    const readingTime = entry.readingTimeSeconds
        ? entry.readingTimeSeconds < 60 ? '<1 min read' : `${Math.round(entry.readingTimeSeconds / 60)} min read`
        : '';

    return (
        <div className="modal-backdrop" onClick={onClose} id="entry-modal">
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{entry.title}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                            <span className="diary-card-author">@{entry.authorUsername}</span>
                            <span className={`visibility-badge ${entry.public ? 'public' : 'private'}`}>
                                {entry.public ? '🌍 Public' : '🔒 Private'}
                            </span>
                            {readingTime && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱️ {readingTime}</span>}
                            {entry.wordCount > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📝 {entry.wordCount} words</span>}
                        </div>
                    </div>
                    {entry.mood && <span style={{ fontSize: '2.5rem' }}>{entry.mood}</span>}
                </div>

                <div className="modal-body">{entry.content}</div>

                {/* Social bar */}
                <div className="modal-social">
                    <button className={`social-btn like-btn ${entry.likedByCurrentUser ? 'liked' : ''}`}
                        onClick={() => onLike?.(entry.id)} id="modal-like-btn">
                        <span className="like-icon">{entry.likedByCurrentUser ? '❤️' : '🤍'}</span>
                        <span className="like-count">{entry.likeCount || 0} likes</span>
                    </button>

                    <button className={`social-btn bookmark-btn ${entry.bookmarkedByCurrentUser ? 'bookmarked' : ''}`}
                        onClick={() => onBookmark?.(entry.id)} id="modal-bookmark-btn">
                        <span>{entry.bookmarkedByCurrentUser ? '🔖 Saved' : '📑 Save'}</span>
                    </button>

                    {entry.public && (
                        <button className="social-btn share-btn" onClick={handleShare} id="modal-share-btn">
                            🔗 Share
                        </button>
                    )}
                </div>

                <div className="modal-meta">
                    <span>📅 {formatDate(entry.createdAt)}</span>
                    {entry.updatedAt !== entry.createdAt && <span>✏️ Updated {formatDate(entry.updatedAt)}</span>}
                </div>

                <CommentSection entryId={entry.id} />

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button className="btn btn-secondary" onClick={onClose} id="close-modal-btn">Close</button>
                </div>
            </div>
        </div>
    );
}
