# Django Connect 🌐

A full-stack social media web application built with **Django REST Framework** for the backend and **React (Vite)** for the frontend. It includes real-time-like features such as posting, liking, commenting, and following other users.

---

## 🌍 Live Demo
🔗 [Deployed Website](https://your-deployed-site-link.vercel.app)  
🖥️ [Backend API (Render)](https://your-backend-api-link.onrender.com)

> Replace the above links with your actual deployed URLs.

---

## 🚀 Features

- User authentication using JWT (Login, Register, Logout)
- Profile picture upload & update
- Post creation with square image cropping
- Like, comment, and delete post functionality
- Explore feed (shows posts from users you don’t follow)
- Follow/Unfollow other users
- Search users by username
- Responsive UI for mobile and desktop

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Icons

### Backend
- Django 5.x
- Django REST Framework
- SimpleJWT for token authentication and refresh
- CORS headers
- Pillow for image handling

---

## 📁 Project Structure

```
Django-Connect/
├── Backend/
│   ├── core/                # Django project folder
│   ├── api/                 # Django app (users, posts, comments)
│   ├── media/               # Uploaded files (profile pics, posts)
│   ├── manage.py
│   └── requirements.txt
└── Frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    └── vite.config.js
```

---

## ⚙️ Backend Setup (Django)

1. Clone the repo:
```bash
git clone https://github.com/your-username/Django-Connect.git
cd Django-Connect/Backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Apply migrations:
```bash
python manage.py migrate
```

5. Create superuser (optional):
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

---

## 🖼 Media Files (Render Setup)

To persist profile pictures and post images on Render:

- Enable **Persistent Disk** in your Render backend service
- Set the media root in Django `settings.py`:
```python
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

- Update `urls.py`:
```python
from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## 🧪 Frontend Setup (React)

1. Navigate to frontend:
```bash
cd Django-Connect/Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Setup `.env` file:
```
VITE_API_URL=https://your-backend-api-link.onrender.com
```

4. Run dev server:
```bash
npm run dev
```

---

## 🚀 Deployment

### Backend (Render)
- Connect GitHub repo
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn core.wsgi:application`
- Add environment variable: `DJANGO_SECRET_KEY`, `ALLOWED_HOSTS`, etc.
- Enable disk for media

### Frontend (Vercel)
- Connect GitHub repo
- Set environment variable `VITE_API_URL`
- Framework preset: `Vite`
- Output directory: `dist`

---

## 👤 Author

Made with ❤️ by [Saurabh Chaudhary](https://www.linkedin.com/in/saurabh-chaudhary-a768a8241/)

---

## 📜 License

This project is licensed under the MIT License.
