import { useEffect, useState, useRef } from 'react';
import { useDiary } from '../hooks/useDiary';
import DiaryCard from '../components/DiaryCard';
import EntryModal from '../components/EntryModal';

export default function FeedPage() {
    const { entries, loading, error, fetchPublicFeed, searchPublicFeed, toggleLike, toggleBookmark } = useDiary();
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const searchTimeout = useRef(null);

    useEffect(() => { fetchPublicFeed(); }, [fetchPublicFeed]);

    const handleSearch = (value) => {
        setSearchQuery(value);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            if (value.trim()) searchPublicFeed(value);
            else fetchPublicFeed();
        }, 400);
    };

    const handleLike = async (id) => {
        try {
            const result = await toggleLike(id);
            if (selectedEntry?.id === id) {
                setSelectedEntry((p) => ({ ...p, likeCount: result.likeCount, likedByCurrentUser: result.liked }));
            }
        } catch (err) { /* user not logged in */ }
    };

    const handleBookmark = async (id) => {
        try {
            const result = await toggleBookmark(id);
            if (selectedEntry?.id === id) {
                setSelectedEntry((p) => ({ ...p, bookmarkedByCurrentUser: result.bookmarked }));
            }
        } catch (err) { /* user not logged in */ }
    };

    return (
        <div className="page" id="feed-page">
            <div className="page-header">
                <h1 className="page-title">🌍 Public Feed</h1>
                <p className="page-subtitle">Explore thoughts shared by the community</p>
            </div>

            {/* Search Bar */}
            <div className="search-bar-container">
                <div className="search-bar glass-card">
                    <span className="search-icon">🔍</span>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search entries..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        id="feed-search"
                    />
                    {searchQuery && (
                        <button className="search-clear" onClick={() => handleSearch('')}>✕</button>
                    )}
                </div>
            </div>

            {loading && <div className="loading"><div className="loading-spinner"></div></div>}
            {error && <div className="auth-error">{error}</div>}

            {!loading && entries.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">{searchQuery ? '🔍' : '🌎'}</div>
                    <h2 className="empty-state-title">{searchQuery ? 'No results found' : 'No public entries yet'}</h2>
                    <p className="empty-state-text">{searchQuery ? 'Try a different search term' : 'Be the first to share your thoughts!'}</p>
                </div>
            )}

            <div className="cards-grid">
                {entries.map((entry) => (
                    <DiaryCard key={entry.id} entry={entry} onClick={() => setSelectedEntry(entry)}
                        onLike={handleLike} onBookmark={handleBookmark} />
                ))}
            </div>

            {selectedEntry && (
                <EntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)}
                    onLike={handleLike} onBookmark={handleBookmark} />
            )}
        </div>
    );
}
