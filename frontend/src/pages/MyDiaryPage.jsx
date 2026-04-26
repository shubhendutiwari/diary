import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiary } from '../hooks/useDiary';
import DiaryCard from '../components/DiaryCard';
import EntryModal from '../components/EntryModal';

export default function MyDiaryPage() {
    const { entries, loading, error, fetchMyEntries, searchMyEntries, deleteEntry, toggleLike, toggleBookmark } = useDiary();
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('all'); // all, public, private
    const searchTimeout = useRef(null);
    const navigate = useNavigate();

    useEffect(() => { fetchMyEntries(); }, [fetchMyEntries]);

    const handleSearch = (value) => {
        setSearchQuery(value);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            if (value.trim()) searchMyEntries(value);
            else fetchMyEntries();
        }, 400);
    };

    const handleEdit = (entry) => navigate(`/write?edit=${entry.id}`, { state: { entry } });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try { await deleteEntry(id); }
            catch { alert('Failed to delete entry'); }
        }
    };

    const handleLike = async (id) => {
        try {
            const result = await toggleLike(id);
            if (selectedEntry?.id === id)
                setSelectedEntry((p) => ({ ...p, likeCount: result.likeCount, likedByCurrentUser: result.liked }));
        } catch (err) { /* ignore */ }
    };

    const handleBookmark = async (id) => {
        try {
            const result = await toggleBookmark(id);
            if (selectedEntry?.id === id)
                setSelectedEntry((p) => ({ ...p, bookmarkedByCurrentUser: result.bookmarked }));
        } catch (err) { /* ignore */ }
    };

    const filteredEntries = viewMode === 'all' ? entries
        : viewMode === 'public' ? entries.filter((e) => e.public)
        : entries.filter((e) => !e.public);

    const publicCount = entries.filter((e) => e.public).length;
    const privateCount = entries.filter((e) => !e.public).length;

    return (
        <div className="page" id="my-diary-page">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 className="page-title">📝 My Diary</h1>
                    <p className="page-subtitle">
                        {entries.length} {entries.length === 1 ? 'entry' : 'entries'} • {publicCount} public • {privateCount} private
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/write')} id="new-entry-btn">
                    ✨ Write New Entry
                </button>
            </div>

            {/* Search + Filter Bar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="search-bar glass-card" style={{ flex: 1, minWidth: '200px' }}>
                    <span className="search-icon">🔍</span>
                    <input className="search-input" type="text" placeholder="Search your entries..."
                        value={searchQuery} onChange={(e) => handleSearch(e.target.value)} id="diary-search" />
                    {searchQuery && <button className="search-clear" onClick={() => handleSearch('')}>✕</button>}
                </div>
                <div className="filter-pills">
                    {['all', 'public', 'private'].map((mode) => (
                        <button key={mode} className={`filter-pill ${viewMode === mode ? 'active' : ''}`}
                            onClick={() => setViewMode(mode)} id={`filter-${mode}`}>
                            {mode === 'all' ? '📋 All' : mode === 'public' ? '🌍 Public' : '🔒 Private'}
                        </button>
                    ))}
                </div>
            </div>

            {loading && <div className="loading"><div className="loading-spinner"></div></div>}
            {error && <div className="auth-error">{error}</div>}

            {!loading && filteredEntries.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">{searchQuery ? '🔍' : '📖'}</div>
                    <h2 className="empty-state-title">{searchQuery ? 'No matching entries' : 'Your diary is empty'}</h2>
                    <p className="empty-state-text">
                        {searchQuery ? 'Try a different search term' : 'Start writing your first entry and capture today\'s thoughts.'}
                    </p>
                    {!searchQuery && (
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/write')} id="empty-write-btn">
                            ✨ Write Your First Entry
                        </button>
                    )}
                </div>
            )}

            <div className="cards-grid">
                {filteredEntries.map((entry) => (
                    <DiaryCard key={entry.id} entry={entry} showActions onClick={() => setSelectedEntry(entry)}
                        onEdit={handleEdit} onDelete={handleDelete} onLike={handleLike} onBookmark={handleBookmark} />
                ))}
            </div>

            {selectedEntry && (
                <EntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)}
                    onLike={handleLike} onBookmark={handleBookmark} />
            )}
        </div>
    );
}
