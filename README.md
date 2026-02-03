# NoteIt - Personal Note Taking App

A modern, full-stack note-taking application that allows users to create, edit, and organize personal notes with todo items. Built with Next.js, Django, and MySQL.

## 🎯 Overview

NoteIt is a device-based note-taking application where users can:
- **Create notes** with title, content, and associated todo items
- **Organize notes** by marking them as favorites
- **Search and filter** notes in real-time
- **Edit and delete** notes with full history management
- **Manage todos** within each note (add, complete, delete)

All data is stored per device using a unique device identifier, allowing for persistent notes across sessions without user authentication.

## 🏗️ Architecture

### Full-Stack Structure

```
noteit/
├── noteit_backend/          # Django REST API
│   ├── noteit_backend/      # Project settings
│   ├── noteit/              # Main app with models, views, serializers
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
├── noteit_frontend/         # Next.js frontend
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── context/             # Context API providers
│   ├── utils/               # API client functions
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml       # Docker orchestration
```

## 💻 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **React Context API** - State management
- **Fetch API** - HTTP client for backend communication

### Backend
- **Django 5.0+** - Python web framework
- **Django REST Framework** - API development
- **Django CORS Headers** - Cross-origin requests
- **MySQL** - Relational database
- **Python 3.12** - Runtime

### DevOps
- **Docker** - Container orchestration
- **Docker Compose** - Multi-container setup

## 📋 Features

### Note Management
- ✅ Create notes with title and content
- ✅ Edit existing notes
- ✅ Delete notes
- ✅ Mark notes as favorites (with visual indicator)
- ✅ Automatic timestamp tracking (updated_at)
- ✅ Real-time note list updates

### Todo Items
- ✅ Add multiple todos per note
- ✅ Mark todos as complete/incomplete
- ✅ Delete individual todos
- ✅ Todos persist with notes

### Search & Filter
- ✅ Real-time search across note titles and content
- ✅ Filter to show only favorite notes
- ✅ Combined search + filter functionality

### Device-Based Storage
- ✅ Automatic device ID generation and storage
- ✅ All notes associated with device
- ✅ No user authentication required

## 🚀 Getting Started

### Prerequisites

- **Docker & Docker Compose** - For containerized setup
- **Python 3.12** (optional, for local development)
- **Node.js 18+** (optional, for local development)
- **MySQL 8.0+** (if running without Docker)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd noteit
```

2. **Create environment file**
```bash
# Create .env file in the root directory
cat > .env << EOF
# Django Settings
DB_NAME=noteit_db
DB_USER=root
DB_PASSWORD=root
DB_HOST=mysql
DB_PORT=3306

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
EOF
```

3. **Build and start with Docker**
```bash
docker compose build
docker compose up -d
```

4. **Run migrations**
```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Django Admin: http://localhost:8000/admin

### Local Development (Without Docker)

#### Backend Setup
```bash
cd noteit_backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start development server
python manage.py runserver
```

#### Frontend Setup
```bash
cd noteit_frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start development server
npm run dev
```

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### Get All Notes
```http
GET /notes/?deviceId={deviceId}
```
Returns all notes for a specific device.

#### Get Note Details
```http
GET /notes/{noteId}/
```
Returns note with all associated todos.

#### Create Note
```http
POST /notes/create/
Content-Type: application/json

{
  "deviceId": "device_xxx",
  "title": "Note Title",
  "content": "Note content...",
  "isFavorite": false,
  "todos": [
    {
      "title": "Todo item",
      "completed": false
    }
  ]
}
```

#### Update Note
```http
PUT /notes/{noteId}/update/
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "isFavorite": true,
  "todos": [...]
}
```

#### Delete Note
```http
DELETE /notes/{noteId}/delete/
```

#### Update Favorite Status
```http
PATCH /notes/{noteId}/favorite/
Content-Type: application/json

{
  "isFavorite": true
}
```

## 📁 Project Structure

### Backend Structure
```
noteit_backend/
├── noteit/
│   ├── models.py           # Note and Todo models
│   ├── serializers.py      # DRF serializers
│   ├── views.py            # API endpoints
│   ├── urls.py             # URL routing
│   ├── admin.py            # Django admin config
│   └── migrations/         # Database migrations
├── noteit_backend/
│   ├── settings.py         # Django settings
│   ├── urls.py             # Main URL config
│   └── wsgi.py             # WSGI application
└── manage.py               # Django CLI
```

### Frontend Structure
```
noteit_frontend/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page with note list
│   ├── globals.css         # Global styles
│   └── components/
│       ├── NoteForm.tsx    # Create/edit note modal
│       ├── NoteView.tsx    # View note details modal
│       └── GlassmorphicButton.tsx
├── context/
│   └── NotesContext.tsx    # Global state management
├── utils/
│   └── api.ts              # API client functions
└── public/                 # Static assets
```

## 🗄️ Database Schema

### Notes Table
```sql
CREATE TABLE notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  deviceId VARCHAR(255) NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  isFavorite BOOLEAN DEFAULT FALSE
);
```

### Todos Table
```sql
CREATE TABLE todos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  noteId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (noteId) REFERENCES notes(id) ON DELETE CASCADE
);
```

## 🔄 State Management

The application uses **React Context API** for global state management:

### NotesContext
Located in `noteit_frontend/context/NotesContext.tsx`

**Methods:**
- `getAllNotes()` - Fetch all notes for the device
- `viewNote(noteId)` - Fetch single note with todos
- `createNote(title, content, todos, isFavorite)` - Create new note
- `updateNote(noteId, title, content, isFavorite, todos)` - Update existing note
- `deleteNote(noteId)` - Delete a note
- `updateFavorite(noteId, isFavorite)` - Toggle favorite status

**State:**
- `notes` - Array of all notes
- `currentNote` - Currently viewed note details
- `loading` - Loading state
- `error` - Error message

## 🎨 UI Components

### NoteForm
Modal component for creating and editing notes. Features:
- Auto-populate when editing
- Dynamic todo item management
- Form validation
- Loading and error states
- Close button with backdrop

### NoteView
Modal component for viewing note details. Features:
- Full note content display
- All todos with completion status (read-only)
- Favorite toggle button
- Edit button (opens NoteForm)
- Delete button with confirmation

### GlassmorphicButton
Reusable button component with glassmorphic design effect.

## 🔐 Security Considerations

- **Device-based storage**: No user authentication (suitable for personal devices)
- **CORS enabled**: Configured for frontend origin only
- **Input validation**: All inputs validated on both frontend and backend
- **Database relationships**: Foreign key constraints ensure referential integrity

## 📝 Environment Variables

### Backend (.env)
```
DB_NAME=noteit_db
DB_USER=root
DB_PASSWORD=root
DB_HOST=mysql
DB_PORT=3306
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🧪 Testing

Currently no automated tests. To add:
- Jest for frontend unit tests
- pytest for backend unit tests
- Playwright for E2E tests

## 📦 Deployment

### Docker Compose
```bash
# Build all services
docker compose build

# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Production Considerations
- Set `DEBUG = False` in Django settings
- Use a production database (managed MySQL service)
- Configure allowed hosts properly
- Use environment-specific settings
- Enable HTTPS/SSL
- Set up proper logging and monitoring

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check logs
docker compose logs backend

# Rebuild container
docker compose build --no-cache backend
docker compose up -d backend
```

### Database connection error
```bash
# Ensure MySQL is running
docker compose logs mysql

# Verify credentials in .env
# Re-run migrations if needed
docker compose exec backend python manage.py migrate
```

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in Django
- Ensure backend is running on correct port

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Created**: February 2026  
**Last Updated**: February 3, 2026
