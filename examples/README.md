# Examples & Demos

This directory contains example code, demonstrations, and integrations that are **not included in production builds**.

## Purpose

The `examples/` folder serves as:
- Reference implementations for developers
- Proof-of-concept integrations
- Demonstrations for upstream authors and contributors
- Learning resources for the FabricPop project

## Important Notes

⚠️ **Build Exclusion**: Files in this directory should be excluded from production builds. Configure your build tools accordingly.

✅ **Source Control**: Examples are kept in git for documentation and reference purposes.

## Available Examples

### [tmdb-integration/](tmdb-integration/)
**TMDB (The Movie Database) API integration for movie and TV show lookups.**

**Includes:**
- `tmdb-service.js` - Reusable TMDB API service module
- `tmdb-demo.html` - Interactive demonstration page
- `README.md` - Complete integration documentation

**Features:**
- Search movies and TV shows
- Get trending and popular content
- Rich metadata and images
- Bearer token authentication

**Use Case:** Add movie/show search and metadata to FabricPop for blockchain-verified reviews.

**Quick Start:**
```bash
python3 -m http.server 8000
# Visit http://localhost:8000/examples/tmdb-integration/tmdb-demo.html
```

---

### [igdb-integration/](igdb-integration/)
**IGDB (Internet Game Database) API integration for game lookups and reviews.**

**Includes:**
- `igdb-service.js` - Reusable IGDB API service module
- `igdb-demo.html` - Interactive demonstration page
- `README.md` - Complete integration documentation

**Features:**
- Search games by name
- Get popular and top-rated games
- Filter by genre
- Automatic OAuth token management
- Game covers and screenshots

**Use Case:** Add game search and metadata to FabricPop for blockchain-verified game reviews.

**Quick Start:**
```bash
python3 -m http.server 8000
# Visit http://localhost:8000/examples/igdb-integration/igdb-demo.html
```

---

### [review-workflow/](review-workflow/)
**Complete Review Authoring Workflow for Movies, TV Shows, and Games.**

**Includes:**
- `review-service.js` - Review creation and rating normalization
- `review-demo.html` - Interactive 5-step workflow
- `README.md` - Complete workflow documentation

**Features:**
- Multi-media support (movies, TV shows, games)
- Flexible rating systems (5-star, 10-point, letter grades, etc.)
- Rating normalization to 0.0-1.0
- Review URL validation
- Blockchain-ready data formatting

**Use Case:** End-to-end review creation workflow integrating TMDB and IGDB with normalized ratings.

**Quick Start:**
```bash
# Terminal 1: HTTP server
python3 -m http.server 8000

# Terminal 2: IGDB proxy (for game reviews)
cd examples/igdb-integration && node igdb-proxy-server.js

# Visit http://localhost:8000/examples/review-workflow/review-demo.html
```

---

## Using Examples in Development

Examples can be imported and tested during development:

```javascript
// Example: Using TMDB service
import TMDBService from './examples/tmdb-integration/tmdb-service.js';
const tmdb = new TMDBService(apiKey, readToken);
const movies = await tmdb.search('Inception');

// Example: Using IGDB service
import IGDBService from './examples/igdb-integration/igdb-service.js';
const igdb = new IGDBService(clientId, clientSecret);
const games = await igdb.searchGames('Zelda');
```

## Build Configuration

### Webpack Example
```javascript
// webpack.config.js
module.exports = {
  // Exclude examples from bundle
  externals: {
    './examples': 'commonjs ./examples'
  }
};
```

### Vite Example
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      external: [/^\/examples\//]
    }
  }
};
```

### Manual Copy Script
```json
// package.json
{
  "scripts": {
    "build": "rm -rf dist && mkdir dist && cp -r !(examples|node_modules) dist/"
  }
}
```

---

## Contributing Examples

When adding new examples:

1. Create a subdirectory: `examples/your-example/`
2. Include a README with:
   - What the example demonstrates
   - How to run it
   - Integration instructions
3. Keep examples self-contained when possible
4. Update this main README with a link to your example

---

**Questions?** Check individual example READMEs or open an issue.
