# 📖 Innerflow — Social Diary App

A beautiful, full-stack social diary platform where people can write their thoughts daily, share them publicly, and engage with the community through likes, comments, and bookmarks.

> **Live Demo:** [https://shubhendutiwari.github.io/diary/](https://shubhendutiwari.github.io/diary/)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-6DB33F?logo=springboot&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Java](https://img.shields.io/badge/Java-17+-ED8B00?logo=openjdk&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### Core Diary
- ✏️ **Daily Journaling** — Write entries with titles, content, and mood selection
- 🔒 **Public / Private** — Toggle visibility per entry; private entries are yours alone
- 🎭 **Mood Tracker** — Tag each entry with a mood emoji (😊 😢 😡 🤔 😌 😴)
- 📊 **Word Count & Reading Time** — Live stats while writing

### Social Features
- 🌐 **Public Feed** — Discover entries shared by the community
- ❤️ **Likes** — React to entries you enjoy
- 💬 **Comments** — Engage in conversations on public entries
- 🔖 **Bookmarks** — Save entries to read later
- 🔗 **Share** — Web Share API with clipboard fallback

### Authentication
- 🔐 **JWT Auth** — Secure token-based login/register
- 🟢 **Google Login** — OAuth2 integration (SVG branded button)
- 🔵 **Facebook Login** — OAuth2 integration (SVG branded button)
- 🟣 **Instagram Login** — OAuth2 integration (SVG branded button)
- 📧 **Email Verification** — 6-character OTP code verification

### Modern Engagement
- 🔍 **Full-Text Search** — Real-time search with debounce on feed and diary
- 🔥 **Writing Streaks** — Duolingo-style daily streak tracker (❄️ → 🔥 → 🔥🔥 → 🔥🔥🔥)
- 💡 **Writing Prompts** — Random inspiration from a pool of 15 prompts
- 📸 **Profile Photo Upload** — Click the camera icon on your avatar to upload
- 🏷️ **Filter Pills** — Filter your diary by All / Public / Private

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, React Router 7, Axios |
| **Backend** | Spring Boot 3.4, Java 17+, Spring Security, JPA/Hibernate |
| **Database** | H2 (dev) — swap to PostgreSQL/MySQL for production |
| **Auth** | JWT + OAuth2 (Google, Facebook, Instagram) |
| **Styling** | Vanilla CSS with glassmorphism dark theme, Inter font |
| **Deployment** | GitHub Pages (frontend), GitHub Actions CI/CD |

---

## 📁 Project Structure

```
diary/
├── .github/workflows/       # CI/CD pipeline
│   └── webpack.yml           # Vite build + GitHub Pages deploy
├── backend/                  # Spring Boot API
│   └── src/main/java/com/diary/
│       ├── config/           # DataInit (demo data seeder)
│       ├── controller/       # REST endpoints
│       ├── dto/              # Request/Response objects
│       ├── model/            # JPA entities (User, DiaryEntry, Comment, etc.)
│       ├── repository/       # Spring Data JPA repos
│       ├── security/         # JWT filter, SecurityConfig
│       └── service/          # Business logic
├── frontend/                 # React SPA
│   └── src/
│       ├── components/       # Navbar, DiaryCard, CommentSection, etc.
│       ├── hooks/            # useAuth, useDiary (custom hooks)
│       ├── pages/            # Login, Register, Feed, MyDiary, Profile, etc.
│       ├── services/         # Axios API client
│       └── index.css         # Full design system
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+** — [Download](https://adoptium.net/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **Git** — [Download](https://git-scm.com/)

### 1. Clone the repo

```bash
git clone https://github.com/shubhendutiwari/diary.git
cd diary
```

### 2. Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will start at **http://localhost:8080**. Demo data is auto-loaded with 3 users and 6 entries.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens at **http://localhost:5173**

### 4. Login with demo accounts

| Username | Password | Entries |
|---|---|---|
| `alice` | `password123` | 3 entries (1 private, 2 public) |
| `bob` | `password123` | 2 public entries |
| `charlie` | `password123` | 1 public entry |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ✗ | Register a new user |
| POST | `/api/auth/login` | ✗ | Login with credentials |
| POST | `/api/auth/oauth` | ✗ | Social login (Google/FB/IG) |
| POST | `/api/auth/verify-email` | ✓ | Verify email with OTP code |
| POST | `/api/auth/resend-verification` | ✓ | Resend verification code |

### Diary Entries
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/feed` | ✗ | Get public feed |
| GET | `/api/feed/search?q=` | ✗ | Search public entries |
| GET | `/api/diary` | ✓ | Get your entries |
| GET | `/api/diary/search?q=` | ✓ | Search your entries |
| POST | `/api/diary` | ✓ | Create a new entry |
| PUT | `/api/diary/{id}` | ✓ | Update an entry |
| DELETE | `/api/diary/{id}` | ✓ | Delete an entry |

### Social
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/diary/{id}/like` | ✓ | Toggle like on an entry |
| POST | `/api/diary/{id}/bookmark` | ✓ | Toggle bookmark |
| GET | `/api/bookmarks` | ✓ | List bookmarked entries |
| GET | `/api/diary/{id}/comments` | ✗ | Get comments for an entry |
| POST | `/api/diary/{id}/comments` | ✓ | Add a comment |
| DELETE | `/api/comments/{id}` | ✓ | Delete your comment |

### Other
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/prompts` | ✗ | Get 3 random writing prompts |
| GET | `/api/users/me` | ✓ | Get your profile + streak |
| PUT | `/api/users/me` | ✓ | Update bio / avatar |

---

## 🔑 Setting Up OAuth (Optional)

The social login buttons are ready in the UI. To enable them with real providers:

### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Set redirect URI: `http://localhost:8080/api/auth/oauth`
4. Add to `backend/src/main/resources/application.properties`:

```properties
google.client.id=YOUR_CLIENT_ID
google.client.secret=YOUR_CLIENT_SECRET
```

### Facebook / Instagram

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create an app and set up Facebook Login
3. Add to `application.properties`:

```properties
facebook.client.id=YOUR_APP_ID
facebook.client.secret=YOUR_APP_SECRET
```

---

## 🌐 Deployment

### Frontend (GitHub Pages)

The project includes a GitHub Actions workflow that automatically:
1. Builds the Vite frontend on push to `main`
2. Deploys to GitHub Pages

**Setup:** Go to **Settings → Pages → Source → GitHub Actions**

Your app will be live at `https://<username>.github.io/diary/`

### Backend (Production)

For production, update `application.properties`:

```properties
# Switch from H2 to PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/innerflow
spring.datasource.driverClassName=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update

# Use a strong JWT secret
jwt.secret=YOUR_PRODUCTION_SECRET
```

---

## 📱 Mobile App Ready

The codebase is designed for easy conversion to mobile:

- **React Native** — Components use logical CSS that maps well to React Native styles
- **Capacitor/Ionic** — Wrap the Vite build as a native app
- **API-first** — The backend REST API works with any client (iOS, Android, Web)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using React + Spring Boot
</p>
