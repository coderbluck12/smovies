# New Pages Guide - SMovies

## Overview
Three new pages have been created to enhance the movie browsing experience with consistent UI design and color palette.

## Pages Created

### 1. **Explore Page** (`/explore`)
**Purpose:** Browse and discover movies with advanced filtering

**Features:**
- Search functionality to find movies by title
- Genre filtering (20+ genres available)
- Pagination for browsing through results
- Sorted by popularity by default
- Responsive grid layout (2-4 columns based on screen size)
- Loading states and error handling

**Color Scheme:** Rose/Red (`rose-600`, `rose-500`)

**Key Components:**
- Search bar with icon
- Genre filter buttons
- Movie grid with showcase cards
- Pagination controls

**API Endpoint:** `https://api.themoviedb.org/3/discover/movie`

---

### 2. **TV Series Page** (`/tv-series`)
**Purpose:** Discover and browse TV series

**Features:**
- Browse popular TV series
- Pagination for multiple pages
- Featured section explaining benefits of TV series
- Responsive design matching home page
- Loading states

**Color Scheme:** Purple (`purple-600`, `purple-500`)

**Key Components:**
- Hero section with TV icon
- Popular series grid
- Featured benefits section
- Pagination controls

**API Endpoint:** `https://api.themoviedb.org/3/discover/tv`

---

### 3. **Upcoming Page** (`/upcoming`)
**Purpose:** View movies coming soon to theaters

**Features:**
- Timeline view of upcoming releases (top 3)
- Full grid view of all upcoming movies
- Sort by release date or popularity
- Release date display with countdown
- Rating information
- Pagination support
- Info section about upcoming releases

**Color Scheme:** Amber/Orange (`amber-600`, `orange-500`)

**Key Components:**
- Hero section with calendar icon
- Timeline cards for featured upcoming movies
- Sort controls (Date/Popularity)
- Movie grid
- Info section with benefits
- Pagination controls

**API Endpoint:** `https://api.themoviedb.org/3/movie/upcoming`

---

## Design Consistency

### Color Palette
- **Explore:** Rose/Red theme
- **TV Series:** Purple theme
- **Upcoming:** Amber/Orange theme
- **Common:** Dark gray backgrounds (`gray-900`, `gray-800`)

### Layout Components
All pages use:
- Consistent Navbar with updated links
- Footer component
- MovieDetailsShowcase component for movie cards
- Responsive grid (2 columns mobile, 3 columns tablet, 3 columns desktop)
- Consistent spacing and padding

### Typography
- Hero titles: `text-4xl md:text-5xl font-bold`
- Section titles: `text-3xl font-bold`
- Consistent font weights and sizes across pages

### Interactive Elements
- Hover effects on buttons and cards
- Smooth transitions (`duration-200`, `duration-300`)
- Active state indicators
- Loading spinners
- Disabled states for pagination

---

## Navigation Updates

The Navbar has been updated with new links:

```
Home → /
Explore → /explore
TV Series → /tv-series
Upcoming → /upcoming
Pricing → #
```

All navigation links are functional and highlight the current page.

---

## Environment Variables Required

For these pages to work, ensure your `.env` file includes:

```
NEXT_PUBLIC_TMDB_READ_TOKEN=your_tmdb_token_here
```

Or use the existing `READ_ACCESS_TOKEN` from your environment.

---

## Features Implemented

### Search & Filter (Explore Page)
- Real-time search filtering
- Genre-based filtering
- Pagination support
- Responsive grid layout

### Sorting (Upcoming Page)
- Sort by release date (ascending)
- Sort by popularity (descending)
- Dynamic API calls based on sort selection

### Timeline View (Upcoming Page)
- Featured upcoming releases in timeline format
- Release date display
- Rating badges
- Numbered cards for visual hierarchy

### Loading States
- Animated spinners
- Loading messages
- Skeleton/placeholder states

### Error Handling
- Graceful error messages
- Empty state displays
- Fallback content

---

## Mobile Responsiveness

All pages are fully responsive:
- **Mobile (< 640px):** 2-column grid
- **Tablet (640px - 1024px):** 2-3 column grid
- **Desktop (> 1024px):** 3-4 column grid

Navigation adapts:
- Mobile: Hamburger menu with full-screen overlay
- Desktop: Inline navigation with search bar

---

## Testing Checklist

- [ ] Navigate to `/explore` - Should load with popular movies
- [ ] Search for a movie on explore page
- [ ] Filter by different genres
- [ ] Test pagination on explore page
- [ ] Navigate to `/tv-series` - Should load TV series
- [ ] Navigate to `/upcoming` - Should load upcoming movies
- [ ] Test sort by date/popularity on upcoming page
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Verify navbar links highlight current page
- [ ] Check loading states
- [ ] Verify movie cards are clickable and link to detail pages

---

## Future Enhancements

- [ ] Add watchlist functionality
- [ ] Add rating/review system
- [ ] Add sharing functionality
- [ ] Add advanced filters (year, rating range, etc.)
- [ ] Add favorites/bookmarks
- [ ] Add user preferences/recommendations
- [ ] Add infinite scroll instead of pagination
- [ ] Add movie comparison feature
- [ ] Add trailer preview modal
- [ ] Add download link integration for each movie

---

## File Structure

```
app/(home)/
├── explore/
│   └── page.tsx          # Explore page with search & filters
├── tv-series/
│   └── page.tsx          # TV series browsing page
├── upcoming/
│   └── page.tsx          # Upcoming movies page
└── ...
```

---

## Notes

- All pages use client-side rendering (`"use client"`) for interactivity
- TMDB API calls are made directly from the client
- Movie cards use the existing `MovieDetailsShowcase` component
- Consistent styling with existing home page
- All pages include Navbar and Footer
- Responsive design follows mobile-first approach
