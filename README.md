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
