# Youtube_Clone
# 🎬 YouTube Clone – MERN Stack

A full-featured YouTube clone built with the MERN stack (MongoDB, Express.js, React, and Node.js). This project replicates core YouTube functionality including authentication, video upload, channel management, subscriptions, comments, playlists, watch history, and more.

---

## ✨ Features

### 🔐 Authentication
- JWT-based authentication
- Register / Login with password validation (minimum 6 characters, 1 uppercase, 1 number, 1 special character)
- Password hashing with bcryptjs
- Token persistence via localStorage
- Protected routes for authenticated users

### 📺 Video Management
- Upload videos with title, description, thumbnail, category, and video URL
- Edit / delete videos (owner only)
- Search videos by title (case-insensitive)
- Category filters for 6 categories: Web Development, JavaScript, Data Structures, Music, Gaming, and Education
- Shorts toggle for vertical videos under 60 seconds
- View count increment using atomic updates
- Like / dislike toggle with optimistic UI updates

### 👥 Channels
- Create a channel (one per user)
- Auto-generate unique @handle from the channel name
- Edit channel details such as name, description, banner, and avatar
- Subscribe / unsubscribe toggle
- Subscriber count tracking with atomic updates
- Channel page with a video grid

### 💬 Comments
- Add comments on videos
- Edit / delete comments (owner only)
- Newest-first comment sorting
- Comment count display

### 📚 User Library
- Watch History
- Watch Later
- Downloads
- Liked Videos
- Your Videos
- Subscriptions Feed
- Playlists

### 🎨 UI/UX
- Dark, YouTube-inspired UI
- Responsive design for mobile, tablet, and desktop
- Debounced search (400ms)
- Category and search filters are mutually exclusive
- URL state persistence for shareable links and back-button support
- Toast notifications with react-hot-toast
- Skeleton loading states

---

## 🛠️ Tech Stack

### Backend (backend/)
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for validation
- cors + morgan middleware

### Frontend (frontend/)
- React 18 + Vite
- React Router v6
- Context API for auth state
- Axios for API requests
- react-hot-toast for notifications
- Custom CSS for the dark theme

### Database
- MongoDB (local or Atlas)
- Collections: users, channels, videos, comments, playlists

---

## 📁 Folder Structure

```text
youtube_clone/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── seed/
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── hooks/
    │   ├── services/
    │   ├── utils/
    │   ├── constants/
    │   ├── styles/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/youtube-clone.git
cd youtube-clone
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5050
MONGO_URI=mongodb://localhost:27017/youtube-clone
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_BASE_URL=http://localhost:5050/api
```

Start the frontend development server:

```bash
npm run dev
```

### 4. Seed the Database (Optional)

```bash
cd backend
npm run seed
```

Seed users (password: `password123`):

| Username | Email |
|----------|-------|
| john_codes | john@example.com |
| priya_dev | priya@example.com |
| alex_builds | alex@example.com |
| nikhil_xo | nikhil@example.com |
| sara_music | sara@example.com |
| dev_anon | dev@example.com |
| gamer_rahul | rahul@example.com |
| learnwithme | learn@example.com |

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login user |
| GET | `/me` | Get current user (protected) |

### Channels (`/api/channels`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a channel (protected) |
| GET | `/:id` | Get channel by ID |
| PUT | `/:id` | Update channel (owner only) |
| POST | `/:id/subscribe` | Toggle subscribe |

### Videos (`/api/videos`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get videos (search, category, shorts filters) |
| GET | `/:id` | Get single video |
| POST | `/` | Upload video |
| PUT | `/:id` | Update video |
| DELETE | `/:id` | Delete video |
| POST | `/:id/like` | Toggle like |
| POST | `/:id/dislike` | Toggle dislike |

### Comments (`/api/comments`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/video/:videoId` | Get comments for a video |
| POST | `/` | Add comment |
| PUT | `/:id` | Update comment |
| DELETE | `/:id` | Delete comment |

### Users (`/api/users/me`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/history` | Get watch history |
| POST | `/history/:videoId` | Add to history |
| DELETE | `/history/:videoId` | Remove from history |
| DELETE | `/history` | Clear history |
| GET | `/watch-later` | Get watch later list |
| POST | `/watch-later/:videoId` | Toggle watch later |
| GET | `/downloads` | Get downloads list |
| POST | `/downloads/:videoId` | Toggle download |
| GET | `/liked-videos` | Get liked videos |
| GET | `/videos` | Get uploaded videos |
| GET | `/subscriptions` | Get subscription feed |
| GET | `/video-status/:videoId` | Get video save status |

### Playlists (`/api/playlists`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user playlists |
| POST | `/` | Create playlist |
| GET | `/:id` | Get playlist by ID |
| PUT | `/:id` | Rename playlist |
| DELETE | `/:id` | Delete playlist |
| POST | `/:id/videos/:videoId` | Add video to playlist |
| DELETE | `/:id/videos/:videoId` | Remove video from playlist |

---

## 🧪 Test Credentials

Password for all seed users: `password123`

| Username | Email |
|----------|-------|
| john_codes | john@example.com |
| priya_dev | priya@example.com |
| alex_builds | alex@example.com |
| nikhil_xo | nikhil@example.com |
| sara_music | sara@example.com |
| dev_anon | dev@example.com |
| gamer_rahul | rahul@example.com |
| learnwithme | learn@example.com |

Example registration payload:

```json
{
  "username": "tech_geek",
  "email": "tech@example.com",
  "password": "Secure@123"
}
```

---

## 📸 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Video feed with search and category filters |
| Video Player | `/video/:id` | Watch video, like/dislike, comments |
| Channel | `/channel/:id` | Channel info, videos, subscribe |
| Create Channel | `/channel/new` | Create a new channel |
| Upload | `/upload` | Upload a new video |
| Edit Video | `/upload/:id` | Edit an existing video |
| Shorts | `/shorts` | Filtered shorts videos |
| Subscriptions | `/subscriptions` | Videos from subscribed channels |
| History | `/history` | Watch history |
| Watch Later | `/watch-later` | Saved videos |
| Liked Videos | `/liked` | Liked videos |
| Your Videos | `/your-videos` | User's uploaded videos |
| Downloads | `/downloads` | Downloaded videos |
| Playlists | `/playlists` | All playlists |
| Playlist Detail | `/playlists/:id` | Single playlist |
| Login | `/login` | Login page |
| Register | `/register` | Register page |

---

## 🤝 Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add some feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🙏 Acknowledgements

- YouTube for design inspiration
- MongoDB for the database
- React for the frontend
- Vite for the build tool
- FontAwesome for icons
- Unsplash for placeholder images

---

## 📬 Contact

Your Name – developakhilesh01@gmail.com

GitHub:https://github.com/DevelopAkhilesh/Youtube_Clone.git

Testing Video : https://drive.google.com/file/d/1QeHA4SJEdeuERMaTBKtDgUg2s6OwdnlF/view?usp=sharing

Made with ❤️ by Akhilesh Guleria
