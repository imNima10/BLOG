# 📝 BLOG Project

A modern blog application built with **Node.js**, **Express**, and **MongoDB**, featuring user authentication, admin management, and post control.  
The **frontend UI** was **generated and designed using AI tools**, providing a clean and modern experience.

---

## 🚀 Features

- **User Authentication**
  - Login & Register (Local)
  - Google OAuth Login
  - OTP verification

- **AI-Generated Frontend**
  - Responsive and clean design created with AI assistance
  - EJS + Vanilla CSS templates

- **User Panel**
  - Edit profile (username, profile image)
  - View personal posts

- **Admin Panel**
  - Dashboard showing total users, posts, and banned users
  - View and delete posts
  - View all users
  - Ban / Unban users
  - Change user roles
  - View banned users

- **Error Handling**
  - Custom 404, 403, 401, and 500 pages with clean UI

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Authentication | Passport.js (Local + Google) |
| Validation | Yup |
| Template Engine | HTML / EJS |
| CSS | Vanilla CSS |
| Frontend | AI-Generated Design |
| Caching | Redis |
| Session | express-session |

---

## 🔗 API Overview

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/auth/login` | GET | Login page |
| `/auth/google` | GET | Login with Google (OAuth) |
| `/auth/google/callback` | GET | Google OAuth callback |
| `/auth/local/verify` | POST | Local login with verification |
| `/auth/local/:userKey` | GET | OTP verification page |
| `/auth/local` | POST | Send OTP code |
| `/user/logout` | POST | Logout current user |
| `/user/me` | GET | Get current user profile |
| `/user/update` | POST | Update user profile (with profile image upload) |
| `/` | GET | Home / Index page |
| `/post/create` | GET | Create post page |
| `/post/create` | POST | Create a new post (with cover image) |
| `/post/my` | GET | List user's own posts |
| `/post/update/:id` | GET | Get update post page |
| `/post/update/:id` | POST | Update post (with cover image) |
| `/post/delete/:id` | POST | Delete a post |
| `/post/:slug` | GET | Get single post by slug |
| `/admin/` | GET | Admin dashboard overview |
| `/admin/posts` | GET | Admin view all posts |
| `/admin/post/:id/delete` | POST | Admin delete a post |
| `/admin/post/:slug` | GET | Admin view single post by slug |
| `/admin/users` | GET | Admin view all users |
| `/admin/users/:id/change-role` | POST | Admin change user role |
| `/admin/users/:id/ban` | POST | Admin ban a user |
| `/admin/banned-users` | GET | Admin view banned users |


---

## 🧠 Environment Variables

Create a `.env` file in the root directory and add your configs:

```env
# 🌐 Server
PORT=4000
DOMAIN="http://localhost:4000"

# 🗄️ Database
MONGO_URI=mongodb://localhost:27017/BLOG
REDIS_URI=redis://localhost:6379

# 🔐 JWT Tokens
ACCESS_TOKEN_SECRET_KEY= # your access token secret key
ACCESS_TOKEN_EXPIRES_IN=10 # minutes
REFRESH_TOKEN_SECRET_KEY= # your refresh token secret key
REFRESH_TOKEN_EXPIRES_IN=7 # days

# 🔑 Google OAuth
GOOGLE_CLIENT_ID= # your Google client ID
GOOGLE_CLIENT_SECRET= # your Google client secret

# 📧 OTP Email Configuration
OTP_EMAIL_USER= # your email address
OTP_EMAIL_PASSWORD= # your email password
OTP_EMAIL_FROM= # email sender name

# 🧩 Session
SESSION_SECRET= # your session secret key
```

---

## 🛠 Installation & Run

```bash
# 1️⃣ Clone the project
git clone https://github.com/imNima10/BLOG.git
cd BLOG

# 2️⃣ Install dependencies
npm install

# 3️⃣ Run the server
npm run dev
```

Visit 👉 **http://localhost:4000**

---

## 🔐 Security

- Session-based authentication  
- Role-based access (admin/user)  
- Secure cookies (HttpOnly)  
- Input validation  
- Custom error handling  

---

## 📊 Admin Dashboard Sections

| Section | Description |
|----------|-------------|
| 🏠 Dashboard | Overview (total users, posts, banned users) |
| 📝 Posts | View & delete posts |
| 👥 Users | Manage users, roles, and bans |
| 🚫 Banned Users | View banned list, unban option |
| 🔙 Back to site | Return to main blog |

---

## 🧾 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and share with credit to **[@imNima10](https://github.com/imNima10)** 💜

---

## 🤝 Contributing

Pull requests and ideas are always welcome!  
If you find a bug or want to improve something, open an issue or PR.

---

**Author:** [@imNima10](https://github.com/imNima10)  
Built with 💻 + ☕ + 🤖 (AI-Generated Frontend)
