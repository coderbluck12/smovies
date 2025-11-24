# TMDB + Firebase Sync - Visual Diagrams

## 1. Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                          USER VISITS MOVIE PAGE                            │
│                         /movies/550 (Fight Club)                           │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│              Next.js Server-Side Rendering (SSR)                           │
│         MainMovieDetails Component (async server component)                │
│                                                                             │
│  1. Extract movieId from URL params: movieId = 550                         │
│  2. Call getMovieDetails(550)                                              │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    TMDB API (Server-Side Request)                          │
│                                                                             │
│  GET https://api.themoviedb.org/3/movie/550?language=en-US                 │
│  Authorization: Bearer {READ_ACCESS_TOKEN}                                 │
│                                                                             │
│  Response: {                                                               │
│    id: 550,                                                                │
│    title: "Fight Club",                                                    │
│    overview: "...",                                                        │
│    backdrop_path: "/path/to/image",                                        │
│    poster_path: "/path/to/poster",                                         │
│    release_date: "1999-10-15",                                             │
│    genres: [{id: 18, name: "Drama"}, ...],                                 │
│    ...                                                                     │
│  }                                                                         │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│              Render Movie Details Page with TMDB Data                      │
│                                                                             │
│  - Header with backdrop image                                              │
│  - Movie title, year, genres (from TMDB)                                   │
│  - Overview, release date (from TMDB)                                      │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│         DownloadLinksSection Component (Client-Side)                       │
│                                                                             │
│  Props: {                                                                  │
│    movieId: 550,          ← From TMDB movieDetails.id                      │
│    type: "movie"                                                           │
│  }                                                                         │
│                                                                             │
│  useEffect(() => {                                                         │
│    fetch(`/api/downloads/movie/550`)                                       │
│  }, [movieId])                                                             │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│              Next.js API Route (Server-Side)                               │
│           /api/downloads/movie/[movieId]/route.ts                          │
│                                                                             │
│  1. Extract movieId from URL: 550                                          │
│  2. Query Firebase Firestore:                                              │
│     db.collection("movies").doc("550").get()                               │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    Firebase Firestore Database                             │
│                                                                             │
│  Collection: movies                                                        │
│  Document ID: "550"                                                        │
│                                                                             │
│  {                                                                         │
│    movieId: 550,                                                           │
│    title: "Fight Club",                                                    │
│    links: [                                                                │
│      {                                                                     │
│        quality: "720p",                                                    │
│        url: "https://example.com/fight-club-720p",                         │
│        size: "1.2GB"                                                       │
│      },                                                                    │
│      {                                                                     │
│        quality: "1080p",                                                   │
│        url: "https://example.com/fight-club-1080p",                        │
│        size: "2.5GB"                                                       │
│      }                                                                     │
│    ],                                                                      │
│    createdAt: 1700000000,                                                  │
│    updatedAt: 1700000000                                                   │
│  }                                                                         │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│              API Response (JSON)                                           │
│                                                                             │
│  {                                                                         │
│    movieId: 550,                                                           │
│    title: "Fight Club",                                                    │
│    links: [                                                                │
│      {quality: "720p", url: "...", size: "1.2GB"},                         │
│      {quality: "1080p", url: "...", size: "2.5GB"}                         │
│    ],                                                                      │
│    createdAt: 1700000000,                                                  │
│    updatedAt: 1700000000                                                   │
│  }                                                                         │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│         DownloadLinksSection Component (Render)                            │
│                                                                             │
│  Display Download Options Section:                                         │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │ Download Options                                            │           │
│  │ [720p (1.2GB)] [1080p (2.5GB)]                              │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Admin Panel Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    ADMIN ADDS DOWNLOAD LINKS                               │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                      /admin/login Page                                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────┐               │
│  │ Admin Login                                             │               │
│  │                                                         │               │
│  │ Email: [____________________]                           │               │
│  │ Password: [____________________]                        │               │
│  │                                                         │               │
│  │ [Login Button]                                          │               │
│  └─────────────────────────────────────────────────────────┘               │
│                                                                             │
│  1. Enter email and password                                               │
│  2. Firebase Auth validates credentials                                    │
│  3. Get ID token from Firebase                                             │
│  4. Store token in localStorage                                            │
│  5. Redirect to /admin/dashboard                                           │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                   /admin/dashboard Page                                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────┐               │
│  │ MovieMex Admin Panel                        [Logout]    │               │
│  ├─────────────────────────────────────────────────────────┤               │
│  │ [Movies] [Series]                                       │               │
│  ├─────────────────────────────────────────────────────────┤               │
│  │                                                         │               │
│  │ Add Movie Download Links                                │               │
│  │                                                         │               │
│  │ Movie ID: [550________________]                          │               │
│  │ Movie Title: [Fight Club_____]                           │               │
│  │                                                         │               │
│  │ Download Links:                                         │               │
│  │ ┌─────────────────────────────────────────────────────┐ │               │
│  │ │ Quality: [720p▼] URL: [___________] Size: [1.2GB] │ │               │
│  │ │ Quality: [1080p▼] URL: [___________] Size: [2.5GB] │ │               │
│  │ └─────────────────────────────────────────────────────┘ │               │
│  │                                                         │               │
│  │ [+ Add Another Quality]                                 │               │
│  │                                                         │               │
│  │ [Save Download Links]                                   │               │
│  └─────────────────────────────────────────────────────────┘               │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│              Admin Fills Form & Clicks Save                                │
│                                                                             │
│  Data Collected:                                                           │
│  {                                                                         │
│    movieId: 550,                                                           │
│    title: "Fight Club",                                                    │
│    links: [                                                                │
│      {quality: "720p", url: "https://example.com/720p", size: "1.2GB"},    │
│      {quality: "1080p", url: "https://example.com/1080p", size: "2.5GB"}   │
│    ]                                                                       │
│  }                                                                         │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│              POST /api/admin/downloads/movie                               │
│                                                                             │
│  Headers: {                                                                │
│    "Content-Type": "application/json",                                     │
│    "Authorization": "Bearer {adminToken}"                                  │
│  }                                                                         │
│                                                                             │
│  Body: {                                                                   │
│    movieId: 550,                                                           │
│    title: "Fight Club",                                                    │
│    links: [...]                                                            │
│  }                                                                         │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│              API Route Validates Token                                     │
│                                                                             │
│  1. Extract token from Authorization header                                │
│  2. Verify token with Firebase Admin SDK                                   │
│  3. If valid, proceed; if invalid, return 401 Unauthorized                 │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│              Save to Firebase Firestore                                    │
│                                                                             │
│  db.collection("movies").doc("550").set({                                  │
│    movieId: 550,                                                           │
│    title: "Fight Club",                                                    │
│    links: [...],                                                           │
│    updatedAt: Date.now()                                                   │
│  }, { merge: true })                                                       │
│                                                                             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│              Success Response                                              │
│                                                                             │
│  {                                                                         │
│    message: "Movie download links updated successfully"                    │
│  }                                                                         │
│                                                                             │
│  Toast notification: "Movie download links saved successfully!"            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3. Movie ID Sync Point

```
                    ┌─────────────────────┐
                    │   TMDB Movie ID     │
                    │      (e.g., 550)    │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │   TMDB API   │ │  Movie URL   │ │  Firebase    │
        │              │ │              │ │  Document ID │
        │ GET /movie   │ │ /movies/550  │ │ movies/550   │
        │ /550         │ │              │ │              │
        └──────────────┘ └──────────────┘ └──────────────┘
                │              │              │
                └──────────────┼──────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Single Source of   │
                    │  Truth: Movie ID    │
                    │      (550)          │
                    └─────────────────────┘
```

## 4. Data Structure Alignment

```
TMDB Response                          Firebase Document
┌──────────────────────────┐          ┌──────────────────────────┐
│ {                        │          │ {                        │
│   id: 550,               │◄────────►│   movieId: 550,          │
│   title: "Fight Club",   │          │   title: "Fight Club",   │
│   overview: "...",       │          │   links: [               │
│   backdrop_path: "...",  │          │     {                    │
│   poster_path: "...",    │          │       quality: "720p",   │
│   release_date: "...",   │          │       url: "...",        │
│   genres: [...],         │          │       size: "1.2GB"      │
│   ...                    │          │     }                    │
│ }                        │          │   ],                     │
│                          │          │   createdAt: ...,        │
│                          │          │   updatedAt: ...         │
│                          │          │ }                        │
└──────────────────────────┘          └──────────────────────────┘
        │                                      │
        └──────────────┬───────────────────────┘
                       │
            Both use same movieId (550)
            as the primary key
```

## 5. Component Hierarchy

```
MainMovieDetails (Server Component)
├─ Fetches from TMDB
├─ movieDetails = {id: 550, title: "Fight Club", ...}
│
└─ Renders:
   ├─ Header (TMDB backdrop image)
   │
   ├─ DownloadLinksSection (Client Component)
   │  ├─ Props: {movieId: 550, type: "movie"}
   │  │
   │  └─ useEffect:
   │     └─ fetch(`/api/downloads/movie/550`)
   │        └─ Firebase returns links
   │           └─ Render download buttons
   │
   └─ Movie Details Section (TMDB data)
      ├─ Title
      ├─ Overview
      ├─ Genres
      └─ Release Date
```

## 6. Request/Response Flow

```
User Browser                    Next.js Server              Firebase
     │                               │                          │
     │──── GET /movies/550 ─────────►│                          │
     │                               │                          │
     │                               │──── GET TMDB ────────────┤
     │                               │◄─── Movie Data ──────────│
     │                               │                          │
     │◄─── HTML Page ────────────────│                          │
     │     (with movieId=550)        │                          │
     │                               │                          │
     │──── GET /api/downloads/movie/550 ──────────────────────►│
     │                               │                          │
     │                               │◄─── Download Links ──────│
     │◄─── JSON Response ────────────│                          │
     │                               │                          │
     │ Render Download Buttons       │                          │
     │                               │                          │
```
