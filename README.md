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

### TMDB Integration

Full TMDB (The Movie Database) API integration for movie/show lookups.

**Quick Start:**

```bash
# Start local server
python3 -m http.server 8000

# Visit the demo
open http://localhost:8000/examples/tmdb-integration/tmdb-demo.html
```

See [examples/tmdb-integration/README.md](examples/tmdb-integration/README.md) for full documentation.
