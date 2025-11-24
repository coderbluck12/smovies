# MovieMex TMDB & Firebase Sync Guide

## How It Works

Your MovieMex app now syncs movie data from TMDB with download links stored in Firebase. Here's the complete flow:

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    TMDB API (Movie Data)                        │
│  - Title, Overview, Poster, Backdrop, Release Date, Genres      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│            Next.js Movie Detail Page (/movies/[movieId])        │
│  - Fetches movie details from TMDB using movieId                │
│  - Passes movieId to DownloadLinksSection component             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│          DownloadLinksSection Component (Client-Side)           │
│  - Receives movieId from parent component                       │
│  - Calls GET /api/downloads/movie/{movieId}                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│           Firebase Firestore (Download Links)                   │
│  - Collection: movies                                           │
│  - Document ID: movieId (same as TMDB movieId)                  │
│  - Data: {movieId, title, links[], createdAt, updatedAt}        │
└─────────────────────────────────────────────────────────────────┘
```

## Key Sync Points

### 1. Movie ID is the Universal Key

**TMDB** → **Firebase** → **Frontend**

```
TMDB Movie ID (e.g., 550)
    ↓
Used in URL: /movies/550
    ↓
Passed to DownloadLinksSection as movieId={550}
    ↓
Fetches from Firebase: movies/{550}
    ↓
Displays download links for that movie
```

### 2. Movie Title Sync

When you add a download link in the admin panel:

1. You enter the **TMDB Movie ID** (e.g., 550)
2. You enter the **Movie Title** (e.g., "Fight Club")
3. This gets stored in Firebase as:
   ```json
   {
     "movieId": 550,
     "title": "Fight Club",
     "links": [...]
   }
   ```

4. On the frontend, the movie title comes from TMDB, but the download links come from Firebase

### 3. How to Know Which Movie You're Adding Links To

**In the Admin Panel:**

```
Step 1: Go to /admin/dashboard
Step 2: Click "Movies" tab
Step 3: Enter Movie ID (from TMDB)
        - You can find this by:
          a) Going to the movie detail page (/movies/550)
          b) Checking the URL
          c) Or searching TMDB directly
Step 4: Enter Movie Title (for your reference in Firebase)
Step 5: Add download links
Step 6: Click "Save"
```

**Example:**
- Movie: "Fight Club"
- TMDB ID: 550
- URL: `http://localhost:3000/movies/550`
- Admin Panel: Enter movieId=550, title="Fight Club"
- Firebase stores: `movies/550`

## Step-by-Step: Adding Download Links

### Finding the Movie ID

**Method 1: From Movie Detail Page**
```
1. Go to /movies/[movieId]
2. Look at the URL: http://localhost:3000/movies/550
3. The movieId is 550
```

**Method 2: From TMDB Website**
```
1. Go to https://www.themoviedb.org/
2. Search for movie
3. Look at URL: https://www.themoviedb.org/movie/550-fight-club
4. The ID is 550
```

### Adding the Link

```
1. Login to /admin/login
2. Go to /admin/dashboard
3. In "Movies" tab:
   - Movie ID: 550
   - Movie Title: Fight Club
   - Add Links:
     * Quality: 720p
     * URL: https://example.com/download/fight-club-720p
     * Size: 1.2GB
4. Click "Save Download Links"
```

### What Happens Next

1. Data saved to Firebase: `movies/550`
2. Go to `/movies/550` in your app
3. Below the header, you'll see "Download Options" section
4. Download buttons appear with the links you added

## Frontend Integration

### Movie Detail Page

```tsx
// app/(home)/movies/[movieId]/page.tsx

const MainMovieDetails = async ({ params }: { params: any }) => {
  const movieDetails = await getMovieDetails(params);
  
  return (
    <>
      <header>
        {/* Movie header from TMDB */}
      </header>

      {/* Download links from Firebase */}
      <DownloadLinksSection 
        movieId={movieDetails.id}  // TMDB movie ID
        type="movie" 
      />

      <section>
        {/* Movie details from TMDB */}
      </section>
    </>
  );
};
```

### DownloadLinksSection Component

```tsx
// components/UI/DownloadLinksSection.tsx

export default function DownloadLinksSection({
  movieId,
  type,
}: DownloadLinksSectionProps) {
  useEffect(() => {
    // Fetch from Firebase using movieId
    const response = await fetch(`/api/downloads/movie/${movieId}`);
    const data = await response.json();
    setLinks(data.links);
  }, [movieId]);

  return (
    <div>
      {/* Display download buttons */}
    </div>
  );
}
```

## Database Structure

### Firebase Firestore

**Collection: `movies`**

```
movies/
├── 550/  (Document ID = TMDB Movie ID)
│   ├── movieId: 550
│   ├── title: "Fight Club"
│   ├── links: [
│   │   {
│   │     quality: "720p",
│   │     url: "https://example.com/download/720p",
│   │     size: "1.2GB"
│   │   },
│   │   {
│   │     quality: "1080p",
│   │     url: "https://example.com/download/1080p",
│   │     size: "2.5GB"
│   │   }
│   │ ]
│   ├── createdAt: 1234567890
│   └── updatedAt: 1234567890
│
├── 278/  (Another movie)
│   ├── movieId: 278
│   ├── title: "The Shawshank Redemption"
│   ├── links: [...]
│   └── ...
```

## API Endpoints

### Get Movie Downloads

```
GET /api/downloads/movie/550

Response:
{
  "movieId": 550,
  "title": "Fight Club",
  "links": [
    {
      "quality": "720p",
      "url": "https://example.com/download/720p",
      "size": "1.2GB"
    }
  ],
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

### Add/Update Movie Downloads (Admin)

```
POST /api/admin/downloads/movie
Authorization: Bearer {adminToken}

Body:
{
  "movieId": 550,
  "title": "Fight Club",
  "links": [
    {
      "quality": "720p",
      "url": "https://example.com/download/720p",
      "size": "1.2GB"
    }
  ]
}
```

## Common Questions

### Q: How do I find the TMDB Movie ID?
**A:** 
- Option 1: Check the URL on the movie detail page
- Option 2: Visit TMDB.org and search for the movie
- Option 3: Use TMDB API to search

### Q: What if I add a link for a movie that doesn't exist on TMDB?
**A:** The link won't display because the movie detail page won't load. Always use valid TMDB movie IDs.

### Q: Can I have multiple download links for the same movie?
**A:** Yes! Add multiple links with different qualities (480p, 720p, 1080p, 4K).

### Q: What if I update a movie's download links?
**A:** The changes appear immediately on the frontend. The component fetches fresh data each time.

### Q: How do I delete download links?
**A:** Use the DELETE endpoint:
```
DELETE /api/admin/downloads/movie?movieId=550
Authorization: Bearer {adminToken}
```

## Workflow Summary

```
1. User visits /movies/550
   ↓
2. Page fetches movie data from TMDB
   ↓
3. DownloadLinksSection component loads
   ↓
4. Component fetches download links from Firebase using movieId=550
   ↓
5. If links exist in Firebase, they display
   ↓
6. User can click to download

---

Admin Workflow:

1. Admin goes to /admin/login
   ↓
2. Admin logs in with Firebase credentials
   ↓
3. Admin goes to /admin/dashboard
   ↓
4. Admin enters movieId (from TMDB)
   ↓
5. Admin adds download links
   ↓
6. Data saved to Firebase: movies/{movieId}
   ↓
7. Links now appear on /movies/{movieId}
```

## Troubleshooting

### Download links not showing?
1. Check that you added links in admin panel
2. Verify movieId matches TMDB ID
3. Check Firebase Firestore has the document
4. Check browser console for errors

### Can't login to admin panel?
1. Verify Firebase Authentication is set up
2. Check that admin user exists in Firebase
3. Verify .env.local has correct Firebase config

### Links showing but not working?
1. Verify the download URLs are correct
2. Check that URLs are publicly accessible
3. Test URLs in browser directly
