# NASA Space Explorer 🚀

A modern, interactive web application that brings NASA's amazing space data to your fingertips. Built with a **Next.js frontend** and **Express.js backend**, powered by multiple NASA APIs and featuring beautiful, responsive UI with interactive visualizations.

![NASA Space Explorer](https://img.shields.io/badge/NASA-API-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![Express.js](https://img.shields.io/badge/Express.js-4-green?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square)

## 🏗️ Architecture

This application follows a modern **frontend-backend separation** pattern:

-   **Frontend** (`/frontend`): Next.js 15 with TypeScript, shadcn/ui, and Tailwind CSS
-   **Backend** (`/backend`): Node.js Express server that acts as a proxy to NASA APIs
-   **Communication**: All frontend API calls go through the backend for security and rate limiting
-   **Deployment**: Frontend deploys to Vercel, backend can deploy to any Node.js hosting service

## ✨ Features

### 🌟 Implemented Core Features

-   **Astronomy Picture of the Day (APOD)** - Daily stunning space imagery with expert explanations
-   **Mars Rover Photos** - Explore Mars through Curiosity, Opportunity, and Spirit rover cameras with advanced filtering, search, and detailed photo modals
-   **ISS Live Tracker** - Real-time International Space Station location tracking with enhanced position data and location selection (_Note: Pass times temporarily unavailable due to API changes_)
-   **Near Earth Objects (NEO)** - Monitor asteroids and comets approaching Earth with date range filters, risk analysis, and detailed object information
-   **NASA Image Gallery** - Search through NASA's vast collection of space imagery with media type filtering, favorites system, and detailed modals

### 🎯 Interactive & Creative Features

-   **Advanced Search & Filtering** - Comprehensive filtering across all data types (rover cameras, dates, media types, object risk levels)
-   **Interactive Data Visualizations** - Statistics dashboards, real-time tracking, and responsive charts
-   **Responsive Design** - Seamlessly works on desktop, tablet, and mobile devices
-   **Beautiful UI/UX** - Modern design with smooth animations, loading states, and error handling
-   **Real-time Updates** - Live ISS tracking and automatic data refreshing
-   **Favorites System** - Save and manage favorite images and discoveries
-   **Detailed Modals** - Rich detail views for photos, objects, and data points
-   **Loading States** - Skeleton loaders and smooth transitions for better UX
-   **Error Boundaries** - Graceful error handling throughout the application

### 🛠️ Technical Features

-   **Type Safety** - Full TypeScript implementation across frontend and backend
-   **API Proxy Architecture** - Backend serves as secure proxy for all NASA API calls
-   **Rate Limiting & Security** - Protected APIs with proper error handling
-   **Performance Optimized** - Efficient data fetching, caching, and component optimization
-   **Accessibility** - WCAG compliant components and navigation
-   **Modern CSS** - Tailwind CSS with custom utility functions and responsive breakpoints

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn
-   NASA API key (optional - uses DEMO_KEY by default)

### Installation & Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/nasa-space-explorer.git
    cd nasa-space-explorer
    ```

2. **Install backend dependencies and setup**

    ```bash
    cd backend
    npm install
    cp .env.example .env.local
    ```

    Edit `backend/.env.local` if needed (defaults work for development):

    ```env
    NASA_API_KEY=DEMO_KEY
    NASA_API_BASE_URL=https://api.nasa.gov
    PORT=5001
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

3. **Install frontend dependencies and setup**

    ```bash
    cd ../frontend
    npm install
    cp .env.example .env.local
    ```

    Edit `frontend/.env.local` if needed (defaults work for development):

    ```env
    NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4. **Start both servers**

    **Option A: Start both with one command (recommended)**

    ```bash
    # From the root directory
    npm run dev
    ```

    **Option B: Start separately**

    Terminal 1 (Backend):

    ```bash
    cd backend
    npm run dev
    ```

    Terminal 2 (Frontend):

    ```bash
    cd frontend
    npm run dev
    ```

5. **Access the application**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:5001
    - Health check: http://localhost:5001/health

## 🏁 Application Structure

```
nasa-space-explorer/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js 15 App Router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   └── lib/             # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Express.js backend server
│   ├── routes/              # API route handlers
│   ├── services/            # NASA API integration
│   ├── middleware/          # Express middleware
│   └── server.js            # Main server file
└── README.md
```

## 📱 Features Overview

### Mars Rover Photos Explorer

-   **Multi-rover support**: Curiosity, Opportunity, Spirit
-   **Camera filtering**: All rover cameras with descriptions
-   **Date filtering**: Sol (Mars day) and Earth date options
-   **Search functionality**: Find specific photos by keywords
-   **Interactive modals**: Detailed photo information and metadata
-   **Responsive grid**: Optimized layout for all screen sizes

### ISS Live Tracker

-   **Real-time tracking**: Current ISS position with coordinates and velocity
-   **Pass predictions**: ⚠️ _Currently unavailable_ - The Open Notify API's pass times endpoint has been discontinued. For ISS pass predictions, users are directed to [NASA's Spot the Station](https://spotthestation.nasa.gov/) website
-   **Location selection**: Choose any city worldwide or use manual coordinates
-   **Enhanced data**: Altitude, velocity, visibility status, and daylight information
-   **Auto-refresh**: Live updates every 30 seconds

### Near Earth Objects Dashboard

-   **Date range filtering**: Customize observation periods
-   **Risk assessment**: Potentially hazardous object identification
-   **Detailed statistics**: Total objects, closest approaches, size data
-   **Interactive details**: Object composition, orbit details, discovery info
-   **Visual indicators**: Clear risk level and approach distance indicators

### NASA Image Gallery

-   **Advanced search**: Query NASA's vast image database
-   **Media filtering**: Images, videos, audio content
-   **Favorites system**: Save and manage favorite discoveries
-   **High-quality previews**: Full-resolution image viewing
-   **Metadata display**: Complete image information and descriptions

## 🛠️ Built With

### Frontend

-   **Next.js 15** - React framework with App Router
-   **TypeScript** - Type-safe JavaScript
-   **Tailwind CSS** - Utility-first CSS framework
-   **shadcn/ui** - Beautiful UI components
-   **Framer Motion** - Animations and interactions

### Backend

-   **Express.js** - Node.js web framework
-   **Axios** - HTTP client for NASA API calls
-   **CORS** - Cross-origin resource sharing
-   **Helmet** - Security middleware
-   **Rate Limiting** - API protection

### APIs

-   **NASA APIs** - Real space data

## 🚀 Deployment

### Frontend (Vercel)

1. **Push to GitHub**

    ```bash
    git add .
    git commit -m "Add NASA Explorer app"
    git push origin main
    ```

2. **Deploy to Vercel**
    - Import your repository on [Vercel](https://vercel.com)
    - Set the **Root Directory** to `frontend`
    - Add environment variables:
        ```
        NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
        NEXT_PUBLIC_APP_URL=https://your-frontend-url.vercel.app
        ```
    - Deploy!

### Backend Deployment Options

**Option 1: Render**

-   Connect your GitHub repository
-   Set **Root Directory** to `backend`
-   Add environment variables in Render dashboard

**Option 2: Railway**

```bash
cd backend
# Create railway.json for configuration
npm install -g @railway/cli
railway login
railway init
railway up
```

---

**Made with ❤️ for space enthusiasts** 🌌
