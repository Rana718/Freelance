# Flancer - A Freelance Project Marketplace

Flancer is a modern web application built with Next.js for the frontend and FastAPI for the backend, designed to connect freelancers with projects.

## Project Structure

```
flancer/
├── frontend/          # Next.js frontend application
└── backend/          # FastAPI backend application
```

## Backend Setup

The backend is built with FastAPI and can be set up using either `uv` (recommended) or `pip`.

### Option 1: Setup with UV (Recommended)


1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
uv venv
.venv\Scripts\activate 
```

3. Install dependencies:
```bash
uv pip install -r pyproject.toml
```

### Option 2: Setup with Pip

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv .venv
.venv/bin/activate 
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Backend

1. Create a `.env` file in the backend directory with necessary environment variables:
```env
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
```

2. Start the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Create a `.env.local` file with necessary environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The frontend will be available at `http://localhost:3000`

## API Routes

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Project Routes
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

## Tech Stack

### Frontend
- Next.js 15.3
- React 19
- TypeScript
- TailwindCSS
- Framer Motion
- Zustand for state management
- Next Auth for authentication

### Backend
- FastAPI
- MongoDB with Motor
- Python 3.11+
- UV package manager
- JWT Authentication

## Development

- Frontend uses Turbopack for faster development experience
- Backend includes hot-reload for development
- ESLint and Prettier are configured for code formatting
- TypeScript for type safety in frontend

## Production

To build for production:

### Frontend
```bash
npm run build
npm start
```

### Backend
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```