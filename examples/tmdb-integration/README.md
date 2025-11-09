# TMDB Integration for FabricPop

This document describes the TMDB (The Movie Database) API integration for the FabricPop project.

## Overview

The integration provides movie and TV show lookup functionality using TMDB's official API v3. This allows users to search for movies/shows, view trending content, and access detailed information about media items.

## Files Included

### 1. `tmdb-service.js`
A standalone JavaScript ES6 module that handles all TMDB API interactions.

**Features:**
- Search movies and TV shows
- Get detailed movie/TV information
- Fetch trending content
- Get popular movies
- Image URL helpers (posters, backdrops)
- Data formatting utilities

**API Compliance:**
- Uses TMDB API v3 (base URL: `https://api.themoviedb.org/3`)
- Bearer token authentication via `Authorization` header
- Follows official TMDB documentation standards

### 2. `tmdb-demo.html`
A fully functional demonstration page showcasing all TMDB features.

**Demonstrates:**
- Search interface with type filtering (movies/TV/all)
- Trending content display
- Popular movies
- Interactive movie cards with hover effects
- Click-to-view details functionality
- Responsive grid layout

### 3. `.env`
Contains your TMDB API credentials:
```
TMDBREADAPI=<your-bearer-token>
TMDBAPIKey=<your-api-key>
```

## Quick Start

### 1. View the Demo
Simply open `tmdb-demo.html` in a web browser:
```bash
open tmdb-demo.html
```

Or serve it locally:
```bash
python -m http.server 8000
# Then visit http://localhost:8000/tmdb-demo.html
```

### 2. Try the Features
- **Search**: Type a movie or show name and click "Search"
- **Trending**: Click "Load Trending This Week" to see what's popular
- **Popular**: Click "Load Popular Movies" for top-rated movies
- **Details**: Click any card to see more information (logged to console)

## Integration Guide

### Using the TMDB Service in Your Code

#### Basic Setup
```javascript
import TMDBService from './tmdb-service.js';

// Initialize with your credentials
const tmdb = new TMDBService(
  'YOUR_API_KEY',
  'YOUR_BEARER_TOKEN'
);
```

#### Search for Movies/Shows
```javascript
// Search all content
const results = await tmdb.search('Inception', 'multi');

// Search only movies
const movies = await tmdb.search('Matrix', 'movie');

// Search only TV shows
const shows = await tmdb.search('Breaking Bad', 'tv');
```

#### Get Detailed Information
```javascript
// Get movie details (requires movie ID from search)
const movieDetails = await tmdb.getMovieDetails(550); // Fight Club

// Get TV show details
const showDetails = await tmdb.getTVDetails(1396); // Breaking Bad
```

#### Get Trending Content
```javascript
// Trending all (movies + TV) this week
const trendingWeek = await tmdb.getTrending('all', 'week');

// Trending movies today
const trendingToday = await tmdb.getTrending('movie', 'day');
```

#### Get Popular Movies
```javascript
const popular = await tmdb.getPopularMovies();
```

#### Format and Display Data
```javascript
// Format raw TMDB data for display
const formattedItem = tmdb.formatItem(rawItem);

console.log(formattedItem);
// {
//   id: 550,
//   title: "Fight Club",
//   originalTitle: "Fight Club",
//   overview: "A ticking-time-bomb insomniac...",
//   releaseDate: "1999-10-15",
//   posterUrl: "https://image.tmdb.org/t/p/w500/...",
//   backdropUrl: "https://image.tmdb.org/t/p/w1280/...",
//   voteAverage: "8.4",
//   voteCount: 26845,
//   popularity: 61.416,
//   mediaType: "movie",
//   genre_ids: [18]
// }
```

#### Get Image URLs
```javascript
// Get poster URL (default w500)
const posterUrl = tmdb.getPosterUrl('/posterPath.jpg');

// Get high-res poster
const hiresPoster = tmdb.getPosterUrl('/posterPath.jpg', 'original');

// Get backdrop/banner image
const backdropUrl = tmdb.getBackdropUrl('/backdropPath.jpg');
```

## API Reference

### TMDBService Class

#### Constructor
```javascript
new TMDBService(apiKey, readToken)
```
- `apiKey` (string): Your TMDB API key
- `readToken` (string): Your TMDB API read access token (Bearer token)

#### Methods

##### `search(query, type = 'multi')`
Search for movies and TV shows.
- **Parameters:**
  - `query` (string): Search term
  - `type` (string): 'movie', 'tv', or 'multi' (default)
- **Returns:** Promise<Array> of search results

##### `getMovieDetails(movieId)`
Get detailed movie information.
- **Parameters:**
  - `movieId` (number): TMDB movie ID
- **Returns:** Promise<Object> with movie details

##### `getTVDetails(tvId)`
Get detailed TV show information.
- **Parameters:**
  - `tvId` (number): TMDB TV show ID
- **Returns:** Promise<Object> with TV show details

##### `getTrending(mediaType = 'all', timeWindow = 'week')`
Get trending content.
- **Parameters:**
  - `mediaType` (string): 'movie', 'tv', or 'all'
  - `timeWindow` (string): 'day' or 'week'
- **Returns:** Promise<Array> of trending items

##### `getPopularMovies()`
Get popular movies.
- **Returns:** Promise<Array> of popular movies

##### `getPosterUrl(posterPath, size = 'w500')`
Generate poster image URL.
- **Parameters:**
  - `posterPath` (string): Poster path from TMDB
  - `size` (string): 'w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'
- **Returns:** string (full URL)

##### `getBackdropUrl(backdropPath, size = 'w1280')`
Generate backdrop image URL.
- **Parameters:**
  - `backdropPath` (string): Backdrop path from TMDB
  - `size` (string): 'w300', 'w780', 'w1280', 'original'
- **Returns:** string (full URL)

##### `formatItem(item)`
Format raw TMDB item for display.
- **Parameters:**
  - `item` (Object): Raw TMDB item
- **Returns:** Object with formatted data

## Integration with Existing FabricPop Code

To integrate this with your existing wallet-connected application:

### Option 1: Add to Existing Page

Add the search UI to `index.html`:
```html
<!-- Add after wallet connection section -->
<div class="search-section">
  <input type="text" id="searchInput" placeholder="Search movies..." />
  <button id="searchBtn">Search</button>
  <div id="results"></div>
</div>
```

Add the script:
```html
<script type="module">
  import TMDBService from './tmdb-service.js';

  const tmdb = new TMDBService('YOUR_KEY', 'YOUR_TOKEN');

  document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value;
    const results = await tmdb.search(query);
    // Display results...
  });
</script>
```

### Option 2: Create Review Flow

Combine wallet authentication with movie selection:

```javascript
// After wallet is connected...
const account = accounts[0];

// Let user search for a movie
const results = await tmdb.search('Inception');

// User selects a movie
const selectedMovie = results[0];
const movieDetails = await tmdb.getMovieDetails(selectedMovie.id);

// Create blockchain-verified review
const review = {
  movieId: movieDetails.id,
  movieTitle: movieDetails.title,
  reviewer: account.address,
  rating: 5,
  comment: "Amazing film!",
  timestamp: Date.now()
};

// Submit to blockchain...
```

## TMDB API Credentials

Your credentials are stored in `.env`:
- **API Key**: `800c9f48e7e68ed2bdc0bb4e999c7f47`
- **Read Token**: `eyJhbGciOiJIUzI1NiJ9...`

### Important Notes:
1. **Security**: In production, never expose API credentials in client-side code
2. **Rate Limiting**: TMDB enforces rate limits; implement caching if needed
3. **Attribution**: TMDB requires attribution - add "Powered by TMDB" to your UI
4. **CORS**: TMDB API requests must come from an HTTP server, not `file://` protocol (see CORS section below)

### Getting Your Own Credentials:
1. Visit https://www.themoviedb.org/
2. Create an account
3. Go to Settings → API
4. Request an API key
5. Use the "API Read Access Token" for Bearer authentication

## TMDB Attribution Requirements

According to TMDB's terms of use, you must include attribution:

```html
<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short.svg"
     alt="TMDB Logo" style="width: 100px;" />
<p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
```

## Example Use Cases for FabricPop

1. **Movie Review Creation**
   - User searches for a movie
   - Selects movie from results
   - Writes review with blockchain signature
   - Review is linked to TMDB movie ID

2. **Trending Reviews**
   - Show trending movies from TMDB
   - Display existing blockchain reviews for each
   - Highlight movies with most reviews

3. **User Profile**
   - Show all movies a user has reviewed
   - Display movie posters and metadata from TMDB
   - Calculate user's average rating

4. **Discovery**
   - Suggest movies based on TMDB popularity
   - Show which have blockchain reviews
   - Encourage users to review unwatched films

## CORS (Cross-Origin Resource Sharing) Considerations

### The Problem
TMDB's API enforces CORS policies, which means:
- ❌ **Will NOT work**: Opening HTML files directly (`file://` protocol)
- ✅ **Will work**: Serving files through HTTP server (`http://` protocol)

### Error You Might See
```
Origin null is not allowed by Access-Control-Allow-Origin. Status code: 0
```

This error occurs when trying to run the demo by double-clicking the HTML file.

### Solutions for Development

#### Option 1: Python HTTP Server (Recommended)
```bash
# Navigate to your project directory
cd /path/to/fabricpop

# Start server on port 8000
python3 -m http.server 8000

# Then visit: http://localhost:8000/tmdb-demo.html
```

#### Option 2: Node.js HTTP Server
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000

# Visit: http://localhost:8000/tmdb-demo.html
```

#### Option 3: VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click `tmdb-demo.html`
3. Select "Open with Live Server"

#### Option 4: PHP Built-in Server
```bash
php -S localhost:8000

# Visit: http://localhost:8000/tmdb-demo.html
```

### Production Solutions

For production deployments, you should **never** call TMDB directly from client-side code because:
1. **Security**: API keys are exposed in the browser
2. **Rate Limits**: Users can exhaust your API quota
3. **CORS**: Complicates client-side implementation

**Recommended Production Architecture:**

```
Browser → Your Backend API → TMDB API
```

#### Backend Proxy Example (Node.js/Express)
```javascript
// server.js
const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.get('/api/search', async (req, res) => {
  const { query, type = 'multi' } = req.query;

  const response = await fetch(
    `https://api.themoviedb.org/3/search/${type}?query=${query}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TMDB_READ_TOKEN}`
      }
    }
  );

  const data = await response.json();
  res.json(data);
});

app.listen(3000);
```

Then from your client:
```javascript
// No CORS issues, API key hidden on server
const results = await fetch(`/api/search?query=Inception&type=multi`);
```

### Why CORS Exists
CORS is a security feature that prevents malicious websites from making unauthorized requests. TMDB allows requests from any HTTP origin but blocks `file://` protocol for security reasons.

## Troubleshooting

### CORS Errors
See the **CORS Considerations** section above for detailed solutions.

**Quick Fix for Demo:**
```bash
python3 -m http.server 8000
# Visit http://localhost:8000/tmdb-demo.html
```

### API Errors
- **401 Unauthorized**: Check your Bearer token is correct
- **404 Not Found**: Verify the movie/TV ID exists
- **429 Too Many Requests**: You've hit rate limits; implement caching or backend proxy

### Module Import Errors
Ensure your HTML includes `type="module"` in the script tag:
```html
<script type="module">
  import TMDBService from './tmdb-service.js';
</script>
```

**Note**: ES6 modules also require HTTP server - they won't work with `file://` protocol.

## Resources

- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [TMDB API Reference](https://developer.themoviedb.org/reference/intro/getting-started)
- [TMDB Terms of Use](https://www.themoviedb.org/terms-of-use)
- [Image Configuration](https://developer.themoviedb.org/reference/configuration-details)

## License & Attribution

This integration code is part of the FabricPop project. The TMDB API is provided by The Movie Database and is subject to their terms of use. This product uses the TMDB API but is not endorsed or certified by TMDB.

---

**Questions or Issues?**
Check the demo page for working examples, or refer to the TMDB API documentation for detailed endpoint information.
