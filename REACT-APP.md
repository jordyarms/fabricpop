# FabricPop React App

Production-ready React application for creating blockchain-verified reviews.

## Overview

A clean, simple React app built with:
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Pico CSS (Pink Theme)** - Minimal, semantic CSS framework
- **Polkadot Extension** - Web3 wallet integration

## Features

✅ **Wallet Connection** - Connect Polkadot/Talisman wallets
✅ **5-Step Review Workflow**:
  1. Select media type (Movie/Show/Game)
  2. Search & select media (TMDB/IGDB)
  3. Rate with flexible scales
  4. Add review link
  5. Review & submit

✅ **Multi-Media Support** - Movies, TV shows, and games
✅ **Rating Normalization** - All ratings converted to 0.0-1.0
✅ **Clean UI** - Pico CSS Pink theme with semantic HTML
✅ **API Integration** - TMDB and IGDB services
✅ **Blockchain Ready** - Formatted for on-chain storage

## Quick Start

### Prerequisites
- Node.js 18+ (for React app)
- Python 3 (for IGDB proxy server)

### Installation

```bash
# Install dependencies
npm install

# Start IGDB proxy server (in separate terminal)
cd examples/igdb-integration
node igdb-proxy-server.js

# Start React dev server
npm run dev
```

Visit: **http://localhost:3001**

## Project Structure

```
fabricpop/
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx
│   │   ├── WalletConnect.jsx
│   │   ├── ReviewWorkflow.jsx
│   │   ├── MediaTypeSelector.jsx
│   │   ├── MediaSearch.jsx
│   │   ├── RatingInput.jsx
│   │   ├── ReviewLinkInput.jsx
│   │   └── ReviewSummary.jsx
│   ├── services/            # API services
│   │   ├── review-service.js
│   │   ├── tmdb-service.js
│   │   └── igdb-service.js
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/
│   ├── css/
│   │   └── pico.pink.min.css
│   └── fabricpop-logo.png
├── examples/                # Demo implementations
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

## Component Overview

### Header
Logo, title, and tagline.

### WalletConnect
Polkadot wallet connection with account display.

### ReviewWorkflow
Main workflow orchestrator managing all review creation steps.

### MediaTypeSelector
Choose between Movie, TV Show, or Video Game.

### MediaSearch
Search and select media using TMDB or IGDB APIs.

### RatingInput
Rate media with multiple scale options, shows normalized value.

### ReviewLinkInput
Add review URL with platform detection and validation.

### ReviewSummary
Final review before submission with formatted display.

## API Services

### ReviewService
- `normalizeRating()` - Convert ratings to 0.0-1.0
- `validateReviewUrl()` - Validate and categorize URLs
- `createReview()` - Generate complete review object
- `formatForBlockchain()` - Create compact format

### TMDBService
- `search()` - Search movies/TV shows
- `getMovieDetails()` - Get movie details
- `getTVDetails()` - Get TV show details

### IGDBService
- `searchGames()` - Search games
- `getGameDetails()` - Get game details
- `getPopularGames()` - Get popular games

## Configuration

### Environment Variables

Create `.env.local` for custom API keys:

```env
VITE_TMDB_API_KEY=your_tmdb_key
VITE_TMDB_READ_TOKEN=your_tmdb_token
```

IGDB proxy runs on port 3000 (configured in `vite.config.js`).

## Development

### Start Dev Server
```bash
npm run dev
```
Runs on http://localhost:3001 with hot reload.

### Build for Production
```bash
npm run build
```
Creates optimized build in `dist/`.

### Preview Production Build
```bash
npm run preview
```

## Styling

Uses **Pico CSS Pink Theme** - a minimal, semantic CSS framework.

### Key Features:
- Dark theme by default
- Semantic HTML (no classes needed)
- Responsive by default
- Accessible components
- Pink/magenta accent color

### Custom Styles
Additional styles in `index.html`:
- Gradient text effect
- Logo shadow
- Poppins font family

## API Integration

### TMDB (Movies & TV)
Direct API calls with Bearer token authentication.

### IGDB (Games)
Proxied through Node.js server on port 3000 (handles OAuth).

**Vite Proxy Configuration** (`vite.config.js`):
```javascript
proxy: {
  '/api/igdb': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}
```

## Deployment

### Build
```bash
npm run build
```

### Serve Static Files
```bash
# Serve dist/ folder
npx serve dist

# Or use any static hosting:
# - Vercel
# - Netlify
# - GitHub Pages
# - AWS S3 + CloudFront
```

### Important for Production

1. **Move API keys to backend** - Don't expose in client code
2. **Proxy all API requests** - Through your backend
3. **Implement rate limiting** - Protect API quotas
4. **Add caching** - Reduce API calls
5. **Set up blockchain submission** - Connect to Polkadot network

## Troubleshooting

### Wallet Won't Connect
- Install Talisman or Polkadot.js extension
- Refresh page after installing
- Check browser console for errors

### IGDB Search Fails
- Ensure proxy server is running on port 3000
- Check `examples/igdb-integration/igdb-proxy-server.js` is started
- Verify Twitch credentials in proxy server

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Scripts

```json
{
  "dev": "vite",                    // Start dev server
  "build": "vite build",            // Build for production
  "preview": "vite preview"         // Preview production build
}
```

## Dependencies

### Core
- `react` ^18.2.0
- `react-dom` ^18.2.0

### Web3
- `@polkadot/extension-dapp` ^0.47.4

### Dev
- `vite` ^5.0.8
- `@vitejs/plugin-react` ^4.2.1

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires ES6+ support and Web3 wallet extension.

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test locally
5. Submit pull request

## License

See main project README.

---

**Built with React + Vite + Pico CSS**

Start creating: `npm run dev` → http://localhost:3001
