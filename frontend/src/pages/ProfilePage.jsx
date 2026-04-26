import { useEffect, useState, useRef } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useDiary } from '../hooks/useDiary';
import { CameraIcon } from '../components/SocialIcons';

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const { entries, fetchMyEntries } = useDiary();
    const [profile, setProfile] = useState(null);
    const [editingBio, setEditingBio] = useState(false);
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadProfile();
        fetchMyEntries();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await userAPI.getMe();
            setProfile(res.data);
            setBio(res.data.bio || '');
        } catch (err) { /* ignore */ }
        finally { setLoading(false); }
    };

    const handleSaveBio = async () => {
        try {
            await userAPI.updateProfile({ bio });
            setEditingBio(false);
            loadProfile();
            refreshUser();
        } catch (err) { alert('Failed to update bio'); }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be under 2MB');
            return;
        }
        setUploadingAvatar(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                await userAPI.updateProfile({ avatarUrl: reader.result });
                loadProfile();
                refreshUser();
            } catch (err) {
                alert('Failed to upload photo');
            } finally {
                setUploadingAvatar(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const publicCount = entries.filter((e) => e.public).length;
    const totalLikes = entries.reduce((sum, e) => sum + (e.likeCount || 0), 0);
    const totalComments = entries.reduce((sum, e) => sum + (e.commentCount || 0), 0);

    if (loading) {
        return <div className="page"><div className="loading"><div className="loading-spinner"></div></div></div>;
    }

    const streakFire = profile?.streak > 0
        ? profile.streak >= 7 ? '🔥🔥🔥' : profile.streak >= 3 ? '🔥🔥' : '🔥'
        : '❄️';

    return (
        <div className="page" id="profile-page">
            <div className="profile-card glass-card">
                {/* Avatar with camera upload overlay */}
                <div className="profile-avatar-wrapper" onClick={() => fileInputRef.current?.click()} id="avatar-upload-trigger">
                    <div className="profile-avatar">
                        {profile?.avatarUrl ? (
                            <img src={profile.avatarUrl} alt="avatar" />
                        ) : (
                            profile?.username?.charAt(0).toUpperCase() || '?'
                        )}
                    </div>
                    <div className="avatar-camera-overlay">
                        {uploadingAvatar ? (
                            <div className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                        ) : (
                            <CameraIcon />
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        style={{ display: 'none' }}
                        id="profile-avatar-input"
                    />
                </div>

                <h1 className="profile-name">@{profile?.username}</h1>
                <p className="profile-email">{profile?.email}</p>

                {profile?.authProvider && profile.authProvider !== 'local' && (
                    <div className="provider-badge">
                        Connected via {profile.authProvider.charAt(0).toUpperCase() + profile.authProvider.slice(1)}
                    </div>
                )}

                <div className="verification-badge" style={{ marginTop: '8px' }}>
                    {profile?.emailVerified
                        ? <span style={{ color: 'var(--success)', fontSize: '0.8rem' }}>✅ Email Verified</span>
                        : <span style={{ color: 'var(--warning)', fontSize: '0.8rem' }}>⚠️ Email Not Verified</span>
                    }
                </div>

                {editingBio ? (
                    <div style={{ maxWidth: '500px', margin: '16px auto 0' }}>
                        <textarea className="input" value={bio} onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell the world about yourself..." rows={3} maxLength={300} id="bio-input" />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                            <button className="btn btn-secondary" onClick={() => setEditingBio(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSaveBio} id="save-bio-btn">Save Bio</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="profile-bio">{profile?.bio || 'No bio yet. Click edit to add one!'}</p>
                        <button className="btn btn-secondary" onClick={() => setEditingBio(true)} id="edit-bio-btn">✏️ Edit Bio</button>
                    </>
                )}

                <div className="streak-card glass-card" style={{ marginTop: '24px' }}>
                    <div className="streak-display">
                        <span className="streak-fire">{streakFire}</span>
                        <div>
                            <div className="streak-count">{profile?.streak || 0}</div>
                            <div className="streak-label">Day Streak</div>
                        </div>
                    </div>
                    <p className="streak-message">
                        {profile?.streak >= 7 ? 'Incredible! You\'re on fire! 🎉'
                            : profile?.streak >= 3 ? 'Great momentum! Keep it up! 💪'
                            : profile?.streak >= 1 ? 'Nice start! Write again tomorrow!'
                            : 'Write today to start your streak!'}
                    </p>
                </div>

                <div className="profile-stats">
                    <div className="profile-stat">
                        <div className="profile-stat-value">{entries.length}</div>
                        <div className="profile-stat-label">Entries</div>
                    </div>
                    <div className="profile-stat">
                        <div className="profile-stat-value">{publicCount}</div>
                        <div className="profile-stat-label">Public</div>
                    </div>
                    <div className="profile-stat">
                        <div className="profile-stat-value">{totalLikes}</div>
                        <div className="profile-stat-label">Likes</div>
                    </div>
                    <div className="profile-stat">
                        <div className="profile-stat-value">{totalComments}</div>
                        <div className="profile-stat-label">Comments</div>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '24px' }}>
                <p>Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '...'}</p>
            </div>
        </div>
    );
}
