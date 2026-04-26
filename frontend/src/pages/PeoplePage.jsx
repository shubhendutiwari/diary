import { useEffect, useState, useCallback } from 'react';
import { connectionAPI } from '../services/api';

const TABS = [
    { id: 'discover', label: '🔍 Discover', icon: '🌍' },
    { id: 'friends', label: '👥 Friends', icon: '👥' },
    { id: 'requests', label: '📩 Requests', icon: '📩' },
    { id: 'sent', label: '📤 Sent', icon: '📤' },
];

export default function PeoplePage() {
    const [activeTab, setActiveTab] = useState('discover');
    const [people, setPeople] = useState([]);
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [sent, setSent] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [counts, setCounts] = useState({ friends: 0, pending: 0 });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [peopleRes, friendsRes, pendingRes, sentRes, countsRes] = await Promise.all([
                connectionAPI.searchPeople(search),
                connectionAPI.getFriends(),
                connectionAPI.getPending(),
                connectionAPI.getSent(),
                connectionAPI.getCounts(),
            ]);
            setPeople(peopleRes.data);
            setFriends(friendsRes.data);
            setPending(pendingRes.data);
            setSent(sentRes.data);
            setCounts(countsRes.data);
        } catch (err) { /* ignore */ }
        finally { setLoading(false); }
    }, [search]);

    useEffect(() => {
        const timer = setTimeout(loadData, 300);
        return () => clearTimeout(timer);
    }, [loadData]);

    const handleAction = async (action, id, label) => {
        setActionLoading(id + action);
        try {
            await action(id);
            await loadData();
        } catch (err) {
            alert(err.response?.data?.error || `Failed to ${label}`);
        } finally {
            setActionLoading(null);
        }
    };

    const renderUserCard = (person) => {
        const status = person.connectionStatus;
        const isLoading = actionLoading?.startsWith(String(person.id)) || actionLoading?.startsWith(String(person.connectionId));

        return (
            <div className="people-card glass-card" key={person.id || person.connectionId} id={`person-${person.id}`}>
                <div className="people-card-avatar">
                    {person.avatarUrl ? (
                        <img src={person.avatarUrl} alt={person.username} />
                    ) : (
                        <span>{person.username?.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <div className="people-card-info">
                    <h3 className="people-card-name">@{person.username}</h3>
                    <p className="people-card-bio">{person.bio || 'No bio yet'}</p>
                    <span className="people-card-friends">{person.friendCount || 0} friends</span>
                </div>
                <div className="people-card-actions">
                    {status === 'none' && (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleAction(connectionAPI.sendRequest, person.id, 'send request')}
                            disabled={isLoading}
                        >
                            {isLoading ? '...' : '➕ Add Friend'}
                        </button>
                    )}
                    {status === 'pending_sent' && (
                        <button className="btn btn-secondary btn-sm" disabled>
                            ⏳ Pending
                        </button>
                    )}
                    {status === 'pending_received' && (
                        <div className="people-card-btn-group">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleAction(connectionAPI.acceptRequest, person.connectionId, 'accept')}
                                disabled={isLoading}
                            >
                                ✅ Accept
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleAction(connectionAPI.rejectRequest, person.connectionId, 'reject')}
                                disabled={isLoading}
                            >
                                ✗
                            </button>
                        </div>
                    )}
                    {status === 'friends' && (
                        <button
                            className="btn btn-secondary btn-sm people-friends-btn"
                            onClick={() => {
                                if (confirm(`Remove @${person.username} from friends?`)) {
                                    handleAction(connectionAPI.removeFriend, person.id, 'unfriend');
                                }
                            }}
                            disabled={isLoading}
                        >
                            ✓ Friends
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const getActiveList = () => {
        switch (activeTab) {
            case 'friends': return friends;
            case 'requests': return pending;
            case 'sent': return sent;
            default: return people;
        }
    };

    const activeList = getActiveList();

    return (
        <div className="page" id="people-page">
            <div className="page-header">
                <h1 className="page-title gradient-text">👥 Find Friends</h1>
                <p className="page-subtitle">Connect with people and grow your community</p>
            </div>

            {/* Search bar (only on Discover tab) */}
            {activeTab === 'discover' && (
                <div className="search-bar glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
                    <span className="search-icon">🔍</span>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search by username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        id="people-search-input"
                    />
                    {search && (
                        <button className="search-clear" onClick={() => setSearch('')}>✕</button>
                    )}
                </div>
            )}

            {/* Tabs */}
            <div className="people-tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`people-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        id={`tab-${tab.id}`}
                    >
                        {tab.label}
                        {tab.id === 'friends' && counts.friends > 0 && (
                            <span className="people-tab-count">{counts.friends}</span>
                        )}
                        {tab.id === 'requests' && counts.pending > 0 && (
                            <span className="people-tab-badge">{counts.pending}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading"><div className="loading-spinner"></div></div>
            ) : activeList.length === 0 ? (
                <div className="empty-state glass-card">
                    <div className="empty-state-icon">
                        {activeTab === 'discover' ? '🌍' : activeTab === 'friends' ? '👥' : activeTab === 'requests' ? '📩' : '📤'}
                    </div>
                    <p className="empty-state-text">
                        {activeTab === 'discover' ? 'No users found. Try a different search!' :
                         activeTab === 'friends' ? 'No friends yet. Start connecting!' :
                         activeTab === 'requests' ? 'No pending requests' :
                         'No sent requests'}
                    </p>
                </div>
            ) : (
                <div className="people-grid">
                    {activeList.map(renderUserCard)}
                </div>
            )}
        </div>
    );
}
