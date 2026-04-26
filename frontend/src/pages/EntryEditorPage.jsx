import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useDiary } from '../hooks/useDiary';
import { diaryAPI } from '../services/api';
import MoodPicker from '../components/MoodPicker';
import ToggleSwitch from '../components/ToggleSwitch';

export default function EntryEditorPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [prompts, setPrompts] = useState([]);
    const [loadingPrompts, setLoadingPrompts] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const { createEntry, updateEntry } = useDiary();

    const isEditing = !!editId;

    useEffect(() => {
        if (isEditing && location.state?.entry) {
            const entry = location.state.entry;
            setTitle(entry.title);
            setContent(entry.content);
            setMood(entry.mood || '');
            setIsPublic(entry.public);
        }
    }, [isEditing, location.state]);

    // Load writing prompts on mount
    useEffect(() => {
        if (!isEditing) loadPrompts();
    }, [isEditing]);

    const loadPrompts = async () => {
        setLoadingPrompts(true);
        try {
            const res = await diaryAPI.getPrompts();
            setPrompts(res.data);
        } catch (err) { /* ignore */ }
        finally { setLoadingPrompts(false); }
    };

    const usePrompt = (prompt) => {
        setTitle(prompt);
        document.getElementById('entry-content')?.focus();
    };

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const data = { title, content, mood, isPublic };
            if (isEditing) {
                await updateEntry(editId, data);
            } else {
                await createEntry(data);
            }
            navigate('/my-diary');
        } catch (err) {
            const errData = err.response?.data;
            if (typeof errData === 'object' && !errData.error) {
                setError(Object.values(errData).join('. '));
            } else {
                setError(errData?.error || 'Failed to save entry');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page editor-page" id="entry-editor-page">
            <div className="page-header">
                <h1 className="page-title">{isEditing ? '✏️ Edit Entry' : '✨ Write New Entry'}</h1>
                <p className="page-subtitle">
                    {isEditing ? 'Update your thoughts' : 'Capture today\'s thoughts and feelings'}
                </p>
            </div>

            {/* Writing Prompts (only for new entries) */}
            {!isEditing && prompts.length > 0 && (
                <div className="writing-prompts glass-card" id="writing-prompts">
                    <div className="prompts-header">
                        <span>💡 Need inspiration?</span>
                        <button className="prompts-refresh" onClick={loadPrompts} disabled={loadingPrompts}>
                            {loadingPrompts ? '⏳' : '🔄'}
                        </button>
                    </div>
                    <div className="prompts-list">
                        {prompts.map((prompt, i) => (
                            <button key={i} className="prompt-chip" onClick={() => usePrompt(prompt)}>
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="editor-card glass-card">
                {error && <div className="auth-error" style={{ marginBottom: '20px' }}>{error}</div>}

                <form className="editor-form" onSubmit={handleSubmit} id="entry-form">
                    <div className="input-group">
                        <label htmlFor="entry-title">Title</label>
                        <input id="entry-title" className="input" type="text" placeholder="Give your entry a title..."
                            value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} autoFocus />
                    </div>

                    <div className="input-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor="entry-content">Your Thoughts</label>
                            <span className="word-counter" id="word-count">{wordCount} words</span>
                        </div>
                        <textarea id="entry-content" className="input" placeholder="What's on your mind today? Write freely..."
                            value={content} onChange={(e) => setContent(e.target.value)} required rows={8} style={{ minHeight: '200px' }} />
                    </div>

                    <div className="input-group">
                        <label>How are you feeling?</label>
                        <MoodPicker selected={mood} onSelect={setMood} />
                    </div>

                    <div className="editor-actions">
                        <div className="editor-actions-left">
                            <ToggleSwitch checked={isPublic} onChange={setIsPublic} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {isPublic ? 'Everyone can see this entry' : 'Only you can see this entry'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} id="cancel-btn">Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving} id="save-entry-btn">
                                {saving ? '⏳ Saving...' : isEditing ? '💾 Update' : '🚀 Publish'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
