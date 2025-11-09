

<parameter name="content">
# IGDB Integration for FabricPop

This document describes the IGDB (Internet Game Database) API integration for the FabricPop project.

## Overview

The integration provides comprehensive game lookup and information retrieval using IGDB's official API v4. This enables users to search for games, view popular titles, and access detailed game information for blockchain-verified reviews.

## Files Included

### 1. `igdb-service.js`
A standalone JavaScript ES6 module that handles all IGDB API interactions.

**Features:**
- Automatic Twitch OAuth2 token management
- Search games by name
- Get detailed game information
- Fetch popular games
- Get top-rated games
- Filter games by genre
- Image URL helpers (covers, screenshots)
- Data formatting utilities

**API Compliance:**
- Uses IGDB API v4 (base URL: `https://api.igdb.com/v4`)
- Twitch OAuth2 authentication
- Apicalypse query language
- Automatic token refresh

### 2. `igdb-demo.html`
A fully functional demonstration page showcasing all IGDB features.

**Demonstrates:**
- Search interface for games
- Popular games display
- Top-rated games
- Interactive game cards with hover effects
- OAuth authentication status
- Click-to-view details functionality
- Responsive grid layout

### 3. `.env`
Contains your Twitch API credentials (required for IGDB):
```
TWITCH_CLIENT_ID=<your-client-id>
TWITCH_CLIENT_SECRET=<your-client-secret>
```

## Quick Start

### 1. View the Demo
Serve the files via HTTP server (required for CORS and ES6 modules):

```bash
# If you already have a server running
# Visit http://localhost:8000/examples/igdb-integration/igdb-demo.html

# Or start a new server
python3 -m http.server 8000
# Then visit http://localhost:8000/examples/igdb-integration/igdb-demo.html
```

### 2. Try the Features
- **Search**: Type a game name and click "Search"
- **Popular**: Click "Load Popular Games" to see trending titles
- **Top Rated**: Click "Load Top Rated" for highest-rated games
- **Details**: Click any card to see more information (logged to console)

## Authentication

IGDB uses **Twitch OAuth2** for authentication. The service automatically handles:

1. **Token Acquisition**: Fetches OAuth token on first request
2. **Token Caching**: Stores token until expiration
3. **Auto Refresh**: Automatically refreshes expired tokens
4. **Error Handling**: Clear error messages for auth failures

### Getting Twitch Credentials

1. Visit https://dev.twitch.tv/console/apps
2. Log in with your Twitch account (create one if needed)
3. Click "Register Your Application"
4. Fill in:
   - **Name**: FabricPop (or your app name)
   - **OAuth Redirect URLs**: http://localhost
   - **Category**: Website Integration
5. Click "Create"
6. Copy the **Client ID**
7. Click "New Secret" to generate a **Client Secret**
8. Add both to your `.env` file

## Integration Guide

### Using the IGDB Service in Your Code

#### Basic Setup
```javascript
import IGDBService from './igdb-service.js';

// Initialize with your Twitch credentials
const igdb = new IGDBService(
  'YOUR_TWITCH_CLIENT_ID',
  'YOUR_TWITCH_CLIENT_SECRET'
);
```

#### Search for Games
```javascript
// Search games (returns up to 10 by default)
const results = await igdb.searchGames('Zelda');

// Search with custom limit
const moreResults = await igdb.searchGames('Mario', 20);
```

#### Get Game Details
```javascript
// Get detailed information (requires game ID from search)
const gameDetails = await igdb.getGameDetails(1942); // The Witcher 3

console.log(gameDetails);
// Returns: name, cover, rating, platforms, genres, summary, etc.
```

#### Get Popular Games
```javascript
// Get popular games from the last 2 years
const popular = await igdb.getPopularGames(20);
```

#### Get Top Rated Games
```javascript
// Get highest rated games
const topRated = await igdb.getTopRatedGames(20);
```

#### Get Games by Genre
```javascript
// Search by genre name
const rpgs = await igdb.getGamesByGenre('RPG', 15);
const actionGames = await igdb.getGamesByGenre('Action', 15);
```

#### Format and Display Data
```javascript
// Format raw IGDB data for display
const formattedGame = igdb.formatGame(rawGame);

console.log(formattedGame);
// {
//   id: 1942,
//   name: "The Witcher 3: Wild Hunt",
//   summary: "An epic RPG adventure...",
//   releaseDate: "2015-05-19",
//   releaseYear: 2015,
//   rating: 92,
//   ratingCount: 2547,
//   coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/...",
//   platforms: "PC, PlayStation 4, Xbox One",
//   genres: "RPG, Adventure",
//   developers: "CD PROJEKT RED",
//   publishers: "CD PROJEKT RED",
//   screenshots: [...]
// }
```

#### Get Image URLs
```javascript
// Get cover URL (default: t_cover_big - 264x374)
const coverUrl = igdb.getCoverUrl(game.cover);

// Get high-res cover
const hdCover = igdb.getCoverUrl(game.cover, 't_1080p');

// Get screenshot URL
const screenshot = igdb.getScreenshotUrl(game.screenshots[0]);

// Available sizes
const sizes = igdb.getImageSizes();
console.log(sizes);
// {
//   covers: { t_thumb, t_cover_small, t_cover_big, t_720p, t_1080p },
//   screenshots: { t_screenshot_med, t_screenshot_big, t_screenshot_huge, ... }
// }
```

## API Reference

### IGDBService Class

#### Constructor
```javascript
new IGDBService(clientId, clientSecret)
```
- `clientId` (string): Your Twitch Client ID
- `clientSecret` (string): Your Twitch Client Secret

#### Methods

##### `getAccessToken()`
Get or refresh OAuth access token (handles caching automatically).
- **Returns:** Promise<string> - Access token

##### `searchGames(query, limit = 10)`
Search for games by name.
- **Parameters:**
  - `query` (string): Search term
  - `limit` (number): Maximum results (default: 10)
- **Returns:** Promise<Array> of game objects

##### `getGameDetails(gameId)`
Get detailed game information.
- **Parameters:**
  - `gameId` (number): IGDB game ID
- **Returns:** Promise<Object> with game details

##### `getPopularGames(limit = 20)`
Get popular games from the last 2 years.
- **Parameters:**
  - `limit` (number): Maximum results (default: 20)
- **Returns:** Promise<Array> of popular games

##### `getTopRatedGames(limit = 20)`
Get highest rated games.
- **Parameters:**
  - `limit` (number): Maximum results (default: 20)
- **Returns:** Promise<Array> of top-rated games

##### `getGamesByGenre(genreName, limit = 20)`
Get games filtered by genre.
- **Parameters:**
  - `genreName` (string): Genre name (e.g., "RPG", "Action")
  - `limit` (number): Maximum results (default: 20)
- **Returns:** Promise<Array> of games in genre

##### `getCoverUrl(cover, size = 't_cover_big')`
Generate cover image URL.
- **Parameters:**
  - `cover` (Object): Cover object from IGDB
  - `size` (string): Image size (see sizes below)
- **Returns:** string (full URL)

##### `getScreenshotUrl(screenshot, size = 't_screenshot_big')`
Generate screenshot image URL.
- **Parameters:**
  - `screenshot` (Object): Screenshot object from IGDB
  - `size` (string): Image size
- **Returns:** string (full URL)

##### `formatGame(game)`
Format raw IGDB game for display.
- **Parameters:**
  - `game` (Object): Raw IGDB game object
- **Returns:** Object with formatted data

##### `getImageSizes()`
Get available image size options.
- **Returns:** Object with size options for covers and screenshots

### Image Sizes

**Cover Sizes:**
- `t_thumb` - 90x90
- `t_cover_small` - 90x128
- `t_cover_big` - 264x374 (default)
- `t_720p` - 1280x720
- `t_1080p` - 1920x1080

**Screenshot Sizes:**
- `t_screenshot_med` - 569x320
- `t_screenshot_big` - 889x500 (default)
- `t_screenshot_huge` - 1280x720
- `t_720p` - 1280x720
- `t_1080p` - 1920x1080

## Integration with Existing FabricPop Code

To integrate this with your existing wallet-connected application:

### Option 1: Add to Existing Page

Add the search UI to your main application:
```html
<!-- Add after wallet connection section -->
<div class="search-section">
  <input type="text" id="gameSearchInput" placeholder="Search games..." />
  <button id="gameSearchBtn">Search</button>
  <div id="gameResults"></div>
</div>
```

Add the script:
```html
<script type="module">
  import IGDBService from './examples/igdb-integration/igdb-service.js';

  const igdb = new IGDBService('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET');

  document.getElementById('gameSearchBtn').addEventListener('click', async () => {
    const query = document.getElementById('gameSearchInput').value;
    const results = await igdb.searchGames(query);
    // Display results...
  });
</script>
```

### Option 2: Create Review Flow

Combine wallet authentication with game selection:

```javascript
// After wallet is connected...
const account = accounts[0];

// Let user search for a game
const results = await igdb.searchGames('Elden Ring');

// User selects a game
const selectedGame = results[0];
const gameDetails = await igdb.getGameDetails(selectedGame.id);

// Create blockchain-verified review
const review = {
  gameId: gameDetails.id,
  gameName: gameDetails.name,
  reviewer: account.address,
  rating: 5,
  comment: "Amazing game!",
  timestamp: Date.now()
};

// Submit to blockchain...
```

## Apicalypse Query Language

IGDB uses a custom query language called **Apicalypse**. The service handles this internally, but you can customize queries:

```javascript
// Example Apicalypse query
const query = `
  search "Zelda";
  fields name, cover.url, rating, platforms.name;
  where rating > 80;
  limit 10;
`;

const results = await igdb.request('games', query);
```

### Query Operators
- `search "term"` - Text search
- `fields a, b, c` - Select specific fields
- `where condition` - Filter results
- `sort field asc/desc` - Sort results
- `limit N` - Limit results
- `offset N` - Skip results

### Common Filters
- `rating > 80` - Highly rated games
- `first_release_date > timestamp` - Recent games
- `platforms = [6]` - PC games (6 = PC platform ID)
- `genres = [12]` - RPG games (12 = RPG genre ID)

## CORS Considerations

### The Problem
Like TMDB, IGDB API requests must come from an HTTP server:
- ❌ **Will NOT work**: Opening HTML files directly (`file://` protocol)
- ✅ **Will work**: Serving files through HTTP server (`http://` protocol)

### Solutions for Development

#### Python HTTP Server (Recommended)
```bash
cd /path/to/fabricpop
python3 -m http.server 8000
# Visit http://localhost:8000/examples/igdb-integration/igdb-demo.html
```

#### Node.js HTTP Server
```bash
npm install -g http-server
http-server -p 8000
```

#### VS Code Live Server
1. Install "Live Server" extension
2. Right-click `igdb-demo.html`
3. Select "Open with Live Server"

### Production Solutions

**Never call IGDB directly from client-side code in production** because:
1. **Security**: Client ID and Secret are exposed
2. **Rate Limits**: Users can exhaust your API quota
3. **CORS**: Complicates implementation

**Recommended Production Architecture:**
```
Browser → Your Backend API → Twitch OAuth → IGDB API
```

#### Backend Proxy Example (Node.js/Express)
```javascript
// server.js
const express = require('express');
const fetch = require('node-fetch');

const app = express();
let accessToken = null;
let tokenExpiry = null;

// Get OAuth token
async function getIGDBToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  );

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000);

  return accessToken;
}

// Proxy IGDB requests
app.post('/api/igdb/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const token = await getIGDBToken();

  const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain'
    },
    body: req.body
  });

  const data = await response.json();
  res.json(data);
});

app.listen(3000);
```

Then from your client:
```javascript
// No CORS issues, credentials hidden on server
const results = await fetch('/api/igdb/games', {
  method: 'POST',
  body: 'search "Zelda"; fields name, cover.url; limit 10;'
});
```

## Example Use Cases for FabricPop

1. **Game Review Creation**
   - User searches for a game
   - Selects game from results
   - Writes review with blockchain signature
   - Review is linked to IGDB game ID

2. **Trending Reviews**
   - Show popular games from IGDB
   - Display existing blockchain reviews for each
   - Highlight games with most reviews

3. **User Profile**
   - Show all games a user has reviewed
   - Display game covers and metadata from IGDB
   - Calculate user's average rating across games

4. **Discovery**
   - Suggest games based on IGDB popularity
   - Show which have blockchain reviews
   - Encourage users to review new releases

5. **Genre-Based Reviews**
   - Filter reviews by game genre
   - Compare ratings across similar games
   - Find top-rated games in each category

## Troubleshooting

### Authentication Errors

**Problem**: `OAuth error: 401` or `OAuth error: 403`
- **Solution**: Check that your Twitch Client ID and Secret are correct
- Verify credentials at https://dev.twitch.tv/console/apps

**Problem**: Token expires
- **Solution**: The service handles this automatically with token refresh
- If issues persist, check server time is correct

### CORS Errors

**Problem**: `Origin null is not allowed by Access-Control-Allow-Origin`
- **Solution**: Use an HTTP server instead of opening files directly
- See CORS Considerations section above

### API Errors

**Problem**: `IGDB API error: 400`
- **Solution**: Invalid Apicalypse query syntax
- Check the query format in service methods

**Problem**: `IGDB API error: 429`
- **Solution**: Rate limit exceeded
- Implement caching or backend proxy
- IGDB allows 4 requests per second

**Problem**: No results returned
- **Solution**: Game might not exist in IGDB database
- Try alternative search terms
- Check game spelling

### Module Import Errors

Ensure your HTML includes `type="module"`:
```html
<script type="module">
  import IGDBService from './igdb-service.js';
</script>
```

**Note**: ES6 modules require HTTP server - they won't work with `file://` protocol.

## Rate Limiting

IGDB enforces rate limits:
- **4 requests per second** (per IP address)
- No monthly quota limit

**Best Practices:**
1. Implement caching for frequently requested data
2. Use backend proxy for production
3. Batch related requests when possible
4. Store game data locally after first fetch

## Resources

- [IGDB API Documentation](https://api-docs.igdb.com/)
- [Apicalypse Query Language](https://api-docs.igdb.com/#apicalypse)
- [Twitch Developer Console](https://dev.twitch.tv/console/apps)
- [IGDB Postman Collection](https://www.postman.com/aceprosports/public/collection/tlq57t4/igdb-api)
- [IGDB Discord Community](https://discord.gg/JKsh9R7)

## Differences from TMDB Integration

| Feature | IGDB | TMDB |
|---------|------|------|
| **Auth Method** | Twitch OAuth2 | Bearer Token |
| **Query Language** | Apicalypse | REST endpoints |
| **Token Management** | Auto-refresh | Static token |
| **Rate Limits** | 4 req/sec | 50 req/sec |
| **Image Hosting** | IGDB CDN | TMDB CDN |
| **Search Results** | Game metadata | Movie/TV metadata |

## License & Attribution

This integration code is part of the FabricPop project. The IGDB API is provided by IGDB.com (owned by Twitch/Amazon) and requires Twitch authentication. This product uses the IGDB API but is not endorsed or certified by IGDB or Twitch.

---

**Questions or Issues?**
Check the demo page for working examples, or refer to the IGDB API documentation for detailed endpoint information.
