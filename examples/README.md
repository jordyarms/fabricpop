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
TMDB (The Movie Database) API integration for movie and TV show lookups.

**Includes:**
- `tmdb-service.js` - Reusable TMDB API service module
- `tmdb-demo.html` - Interactive demonstration page
- `README.md` - Complete integration documentation

**Use Case:** Add movie/show search and metadata to FabricPop for blockchain-verified reviews.

---

## Using Examples in Development

Examples can be imported and tested during development:

```javascript
// Example: Using TMDB service in development
import TMDBService from './examples/tmdb-integration/tmdb-service.js';
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
