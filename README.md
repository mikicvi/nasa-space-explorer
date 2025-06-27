# NASA Space Explorer 🚀

A modern web application that brings NASA's space data to your fingertips. Built with Next.js, Express.js, and TypeScript, featuring beautiful UI and real-time space data visualizations.

![NASA Space Explorer](https://img.shields.io/badge/NASA-API-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square)

## Features

-   **Astronomy Picture of the Day** - Daily space imagery with expert explanations
-   **Mars Rover Photos** - Browse images from Curiosity, Opportunity & Spirit with advanced filtering
-   **ISS Live Tracker** - Real-time International Space Station location tracking
-   **Near Earth Objects** - Monitor asteroids and comets with risk analysis
-   **NASA Image Gallery** - Search NASA's vast collection with favorites system

**Technical Highlights:**

-   Full TypeScript implementation
-   Responsive design with Tailwind CSS & shadcn/ui
-   API proxy architecture with rate limiting
-   Real-time updates and caching
-   Modern React patterns with Next.js 15

## Quick Start

### Prerequisites

-   Node.js 18+
-   NASA API key (optional - uses DEMO_KEY by default)

### Installation

1. **Clone and install dependencies**

    ```bash
    git clone https://github.com/mikicvi/nasa-space-explorer.git
    cd nasa-space-explorer
    npm run install:all  # Installs dependencies for both frontend and backend
    ```

2. **Setup environment files**

    ```bash
    # Backend
    cd backend && cp .env.example .env.local

    # Frontend
    cd ../frontend && cp .env.example .env.local
    ```

3. **Start development servers**

    ```bash
    # From root directory - starts both frontend and backend
    npm run dev
    ```

4. **Access the application**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:5001/health

## Architecture

```
nasa-space-explorer/
├── frontend/          # Next.js 15 + TypeScript + Tailwind CSS
│   ├── src/app/      # App Router pages
│   ├── src/components/  # UI components
│   └── src/services/    # API layer
├── backend/           # Express.js API server
│   ├── routes/       # API endpoints
│   └── services/     # NASA API integration
└── render.yaml       # Deployment configuration
```

## Deployment

**Recommended: Deploy to Render (both frontend & backend)**

1. Push to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → "New" → "Blueprint"
3. Connect your repository and select `render.yaml`
4. Set environment variables in Render dashboard for frontend - (open service and go to "Environment" tab):

    ```
    NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
    NEXT_PUBLIC_APP_URL=https://your-frontend-url.onrender.com
    ```

5. Set environment variables in Render dashboard for backend - (open service and go to "Environment" tab):

    ```
    NASA_API_KEY=your_actual_api_key
    FRONTEND_URL=https://your-frontend-url.onrender.com
    ```

6. Deploy!

## Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion  
**Backend:** Express.js, Axios, CORS, Helmet, Rate Limiting  
**APIs:** NASA APOD, Mars Rover Photos, NEO, ISS Tracking, Image Search  
**Testing:** Jest, React Testing Library

---

**Made with ❤️ for space enthusiasts by mikicvi**
