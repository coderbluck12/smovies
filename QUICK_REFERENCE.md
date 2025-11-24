# Quick Reference: TMDB + Firebase Sync

## The Key Concept

**Movie ID is the bridge between TMDB and Firebase**

```
TMDB Movie ID (e.g., 550) = Firebase Document ID
```

## Finding Movie ID

| Source | How |
|--------|-----|
| **Movie Detail Page** | Check URL: `/movies/550` → ID is 550 |
| **TMDB Website** | Search movie → URL has ID: `themoviedb.org/movie/550-fight-club` |
| **TMDB API** | Search endpoint returns `id` field |

## Adding Download Links

### Step 1: Get Movie ID
```
Go to /movies/550 (or any movie)
Copy the ID from URL: 550
```

### Step 2: Login to Admin
```
URL: /admin/login
Email: your_admin_email@example.com
Password: your_password
```

### Step 3: Add Links
```
Dashboard → Movies Tab
Movie ID: 550
Movie Title: Fight Club
Add Links:
  - Quality: 720p
  - URL: https://example.com/download
  - Size: 1.2GB
Click Save
```

### Step 4: View on Frontend
```
Go to /movies/550
Download buttons appear below header
```

## Data Sync Flow

```
┌─────────────────────────────────────────┐
│  TMDB (Movie Details)                   │
│  - Title, Poster, Overview, etc.        │
└──────────────────┬──────────────────────┘
                   │ movieId=550
                   ▼
┌─────────────────────────────────────────┐
│  Movie Detail Page (/movies/550)        │
│  - Displays TMDB data                   │
│  - Passes movieId to DownloadSection    │
└──────────────────┬──────────────────────┘
                   │ movieId=550
                   ▼
┌─────────────────────────────────────────┐
│  Firebase (Download Links)              │
│  - Collection: movies                   │
│  - Document: 550                        │
│  - Data: {title, links[]}               │
└─────────────────────────────────────────┘
```

## Admin Panel Workflow

```
/admin/login
    ↓
/admin/dashboard
    ├─ Movies Tab
    │   ├─ Movie ID: [Enter TMDB ID]
    │   ├─ Movie Title: [For reference]
    │   ├─ Add Links: [Quality, URL, Size]
    │   └─ Save
    │
    └─ Series Tab
        ├─ Series ID: [Enter TMDB ID]
        ├─ Series Title: [For reference]
        ├─ Episodes: [Episode #, Name, Links]
        └─ Save
```

## Frontend Display

```
Movie Detail Page (/movies/550)
├─ Header (from TMDB)
├─ Download Links Section (from Firebase)
│  └─ Shows buttons if links exist
└─ Movie Details (from TMDB)
```

## API Calls

### Fetch Downloads
```
GET /api/downloads/movie/550
→ Returns links from Firebase
```

### Add Downloads (Admin)
```
POST /api/admin/downloads/movie
Authorization: Bearer {token}
Body: {movieId, title, links}
→ Saves to Firebase
```

### Delete Downloads (Admin)
```
DELETE /api/admin/downloads/movie?movieId=550
Authorization: Bearer {token}
→ Removes from Firebase
```

## Firebase Structure

```
movies/
├── 550/
│   ├── movieId: 550
│   ├── title: "Fight Club"
│   ├── links: [{quality, url, size}, ...]
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

## Common IDs

| Movie | TMDB ID |
|-------|---------|
| Fight Club | 550 |
| The Shawshank Redemption | 278 |
| The Dark Knight | 155 |
| Inception | 27205 |
| Pulp Fiction | 680 |

## Checklist

- [ ] Firebase project created
- [ ] Firestore database set up
- [ ] Authentication enabled
- [ ] Admin user created
- [ ] .env.local configured
- [ ] npm install completed
- [ ] Dev server running
- [ ] Admin login works
- [ ] Can add movie links
- [ ] Links display on movie page

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Links not showing | Check movieId matches, verify Firebase document exists |
| Can't login | Verify admin user in Firebase Auth |
| 404 on download | Check URL is correct and accessible |
| "Unauthorized" error | Ensure logged in, token valid |

## File Locations

| File | Purpose |
|------|---------|
| `/app/(home)/movies/[movieId]/page.tsx` | Movie detail page |
| `/components/UI/DownloadLinksSection.tsx` | Download display component |
| `/app/admin/login/page.tsx` | Admin login |
| `/app/admin/dashboard/page.tsx` | Admin dashboard |
| `/app/api/downloads/movie/[movieId]/route.ts` | Fetch downloads API |
| `/app/api/admin/downloads/movie/route.ts` | Admin add/update API |
