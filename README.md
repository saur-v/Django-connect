# Django Connect 🌐

A full-stack **social media app** built with **Django (REST API)** and **React (Vite)**, featuring authentication, image upload, likes, comments, user profiles, and an explore feed.

---

## 🛠 Tech Stack

### 🔹 Backend (Django)
- Django 5.2
- Django REST Framework
- Simple JWT (Authentication)
- Pillow (Image handling)
- CORS Headers

### 🔹 Frontend (React)
- React (Vite)
- Axios for API calls
- Tailwind CSS for UI
- React Router DOM

---

## 🚀 Features

- User authentication (register/login/logout with JWT)
- Profile picture upload and post image uploads
- Like and comment system
- Explore feed (excluding current user and followed users)
- Responsive UI with smooth user interactions
- Post deletion, profile following, and real-time UI updates

---

## 🔐 Authentication

Implemented using **JWT (access/refresh tokens)**. Tokens are automatically refreshed via an Axios interceptor.

---

## 🔄 Auto Token Refresh Logic

If a request fails with 401 (token expired), the frontend automatically refreshes the access token and retries the request.

---

## 🗂 Folder Structure (Important)

```
project-root/
├── Backend/
│   ├── core/                # Django project
│   ├── users/               # Custom user app
│   ├── posts/               # Post and comment logic
│   └── media/               # Uploaded images
├── Frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.jsx
│       └── axios.js
├── requirements.txt
└── README.md
```

---

## 🌍 Deployment

### Backend (Render)
- Add a `requirements.txt`
- Create a web service on Render
- Add environment variable: `DJANGO_SECRET_KEY`, `ALLOWED_HOSTS`, etc.
- Use `gunicorn core.wsgi` as start command
- Enable persistent media storage if needed

### Frontend (Vercel)
- Set `VITE_API_URL` in Vercel project settings (e.g. `https://your-backend.onrender.com`)
- Push code to GitHub
- Import project into Vercel

---

## 📸 Screenshots

> You can add screenshots of:
- Explore feed
- Profile page
- Post view with like & comments

---

## 📌 Author

Built with ❤️ by **Saurav Chaudhary**  
[LinkedIn](https://www.linkedin.com/in/saurabh-chaudhary-a768a8241/)