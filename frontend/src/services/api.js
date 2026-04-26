import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    oauthLogin: (data) => api.post('/auth/oauth', data),
    verifyEmail: (code) => api.post('/auth/verify-email', { code }),
    resendVerification: () => api.post('/auth/resend-verification'),
};

// Diary API
export const diaryAPI = {
    getMyEntries: () => api.get('/diary'),
    createEntry: (data) => api.post('/diary', data),
    updateEntry: (id, data) => api.put(`/diary/${id}`, data),
    deleteEntry: (id) => api.delete(`/diary/${id}`),
    getPublicFeed: () => api.get('/feed'),

    // Search
    searchMyEntries: (q) => api.get(`/diary/search?q=${encodeURIComponent(q)}`),
    searchPublicFeed: (q) => api.get(`/feed/search?q=${encodeURIComponent(q)}`),

    // Likes
    toggleLike: (id) => api.post(`/diary/${id}/like`),

    // Bookmarks
    toggleBookmark: (id) => api.post(`/diary/${id}/bookmark`),
    getBookmarks: () => api.get('/bookmarks'),

    // Comments
    getComments: (id) => api.get(`/diary/${id}/comments`),
    addComment: (id, content) => api.post(`/diary/${id}/comments`, { content }),
    deleteComment: (id) => api.delete(`/comments/${id}`),

    // Writing Prompts
    getPrompts: () => api.get('/prompts'),
};

// User API
export const userAPI = {
    getMe: () => api.get('/users/me'),
    updateProfile: (data) => api.put('/users/me', data),
};

export default api;
