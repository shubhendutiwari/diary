import { useState, useCallback } from 'react';
import { diaryAPI } from '../services/api';

export function useDiary() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMyEntries = useCallback(async () => {
        setLoading(true); setError(null);
        try { setEntries((await diaryAPI.getMyEntries()).data); }
        catch (err) { setError(err.response?.data?.error || 'Failed to load entries'); }
        finally { setLoading(false); }
    }, []);

    const fetchPublicFeed = useCallback(async () => {
        setLoading(true); setError(null);
        try { setEntries((await diaryAPI.getPublicFeed()).data); }
        catch (err) { setError(err.response?.data?.error || 'Failed to load feed'); }
        finally { setLoading(false); }
    }, []);

    const searchMyEntries = useCallback(async (query) => {
        if (!query.trim()) return fetchMyEntries();
        setLoading(true); setError(null);
        try { setEntries((await diaryAPI.searchMyEntries(query)).data); }
        catch (err) { setError('Search failed'); }
        finally { setLoading(false); }
    }, [fetchMyEntries]);

    const searchPublicFeed = useCallback(async (query) => {
        if (!query.trim()) return fetchPublicFeed();
        setLoading(true); setError(null);
        try { setEntries((await diaryAPI.searchPublicFeed(query)).data); }
        catch (err) { setError('Search failed'); }
        finally { setLoading(false); }
    }, [fetchPublicFeed]);

    const fetchBookmarks = useCallback(async () => {
        setLoading(true); setError(null);
        try { setEntries((await diaryAPI.getBookmarks()).data); }
        catch (err) { setError('Failed to load bookmarks'); }
        finally { setLoading(false); }
    }, []);

    const createEntry = useCallback(async (data) => (await diaryAPI.createEntry(data)).data, []);
    const updateEntry = useCallback(async (id, data) => (await diaryAPI.updateEntry(id, data)).data, []);

    const deleteEntry = useCallback(async (id) => {
        await diaryAPI.deleteEntry(id);
        setEntries((prev) => prev.filter((e) => e.id !== id));
    }, []);

    const toggleLike = useCallback(async (id) => {
        const res = await diaryAPI.toggleLike(id);
        setEntries((prev) => prev.map((e) =>
            e.id === id ? { ...e, likeCount: res.data.likeCount, likedByCurrentUser: res.data.liked } : e
        ));
        return res.data;
    }, []);

    const toggleBookmark = useCallback(async (id) => {
        const res = await diaryAPI.toggleBookmark(id);
        setEntries((prev) => prev.map((e) =>
            e.id === id ? { ...e, bookmarkedByCurrentUser: res.data.bookmarked } : e
        ));
        return res.data;
    }, []);

    return {
        entries, loading, error,
        fetchMyEntries, fetchPublicFeed,
        searchMyEntries, searchPublicFeed,
        fetchBookmarks,
        createEntry, updateEntry, deleteEntry,
        toggleLike, toggleBookmark,
    };
}
