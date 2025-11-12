# fabricpop

Web3 gamified movie/tv/game reviews

---

## Development

### Setup

1. Copy `.env.example` to `.env`
2. Add your API credentials to `.env`
3. Serve files via HTTP server (required for CORS)

### Running Locally

```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Technical Demos

The `examples/` directory contains fully-functional API integrations for FabricPop's review platform.

### TMDB Integration (Movies & TV Shows)

Full TMDB (The Movie Database) API integration for movie/show lookups.

**Features**: Search, trending content, popular movies, rich metadata

**Quick Start:**

```bash
# Start local server
python3 -m http.server 8000

# Visit the demo
open http://localhost:8000/examples/tmdb-integration/tmdb-demo.html
```

See [examples/tmdb-integration/README.md](examples/tmdb-integration/README.md) for full documentation.

### IGDB Integration (Games)

Full IGDB (Internet Game Database) API integration for game lookups.

**Features**: Search, popular games, top-rated, genre filtering, OAuth management

**Quick Start:**

```bash
# Start local server (if not already running)
python3 -m http.server 8000

# Visit the demo
open http://localhost:8000/examples/igdb-integration/igdb-demo.html
```

See [examples/igdb-integration/README.md](examples/igdb-integration/README.md) for full documentation.

### Review Authoring Workflow

Complete end-to-end review creation workflow combining TMDB and IGDB integrations.

**Features**: Multi-media support, flexible rating systems, URL validation, blockchain formatting

**Quick Start:**

```bash
# Terminal 1: HTTP server
python3 -m http.server 8000

# Terminal 2: IGDB proxy server (for game reviews)
cd examples/igdb-integration && node igdb-proxy-server.js

# Visit the demo
open http://localhost:8000/examples/review-workflow/review-demo.html
```

**Supported Rating Scales:**
- 5 Stars (0-5)
- 10 Stars (0-10)
- Numeric (0-10 or 0-100)
- Letter Grades (A+ through F)
- Float (0.0-1.0)

All ratings are normalized to 0.0-1.0 for blockchain storage.

See [examples/review-workflow/README.md](examples/review-workflow/README.md) for full documentation.
