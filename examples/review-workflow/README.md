# Review Authoring Workflow for FabricPop

A complete end-to-end workflow for creating blockchain-verified reviews for movies, TV shows, and video games.

## Overview

This workflow provides a structured, step-by-step process for users to:
1. Select the type of media they're reviewing (movie, TV show, or game)
2. Search and select the specific media item using TMDB or IGDB APIs
3. Rate the media using their preferred rating scale
4. Link to their published review
5. Generate a blockchain-ready review object

## Features

### ✅ Multi-Media Support
- **Movies** - via TMDB API integration
- **TV Shows** - via TMDB API integration
- **Video Games** - via IGDB API integration

### ⭐ Flexible Rating Systems
- **5 Stars** (0-5, half-star increments)
- **10 Stars** (0-10, half-star increments)
- **Numeric Score (0-10)** with decimal precision
- **Numeric Score (0-100)** integer scores
- **Letter Grades** (A+ through F)
- **Float** (0.0-1.0 direct input)

All ratings are normalized to a float value between 0.0-1.0 for blockchain storage.

### 🔗 Review URL Validation
Supports and validates URLs from:
- YouTube
- Medium
- Substack
- Spotify (podcasts)
- Apple Podcasts
- SoundCloud
- Letterboxd
- IMDb
- Rotten Tomatoes
- Any valid URL

### 📊 Data Formatting
- **Human-Readable** summary for display
- **Full JSON** object with all metadata
- **Compact Blockchain** format for efficient storage

## Files

### 1. `review-service.js`
Core service handling review logic.

**Key Methods:**
- `normalizeRating(value, scale)` - Convert any rating to 0.0-1.0
- `validateReviewUrl(url)` - Validate and categorize review URLs
- `createReview(params)` - Generate complete review object
- `formatForBlockchain(review)` - Create compact format
- `generateSummary(review)` - Human-readable summary

### 2. `review-demo.html`
Interactive demonstration of the complete workflow.

**5-Step Process:**
1. Select media type
2. Search & select media
3. Rate the media
4. Add review link
5. Review & submit

## Quick Start

### Prerequisites
Make sure both servers are running:

```bash
# Terminal 1: HTTP server for HTML/JS
python3 -m http.server 8000

# Terminal 2: IGDB proxy server (for game reviews)
cd examples/igdb-integration
node igdb-proxy-server.js
```

### Access the Demo
```bash
open http://localhost:8000/examples/review-workflow/review-demo.html
```

## Usage Examples

### Programmatic Usage

```javascript
import ReviewService from './review-service.js';

const reviewService = new ReviewService();

// Create a movie review
const review = reviewService.createReview({
  mediaType: 'movie',
  mediaId: 550, // Fight Club (TMDB ID)
  mediaTitle: 'Fight Club',
  mediaYear: 1999,
  mediaMetadata: { director: 'David Fincher' },
  ratingValue: 4.5,
  ratingScale: 'stars_5',
  reviewUrl: 'https://medium.com/@reviewer/fight-club-review',
  reviewerName: 'John Doe',
  notes: 'A masterpiece of cinema'
});

console.log(review);
// {
//   media: { type: 'movie', id: 550, title: 'Fight Club', year: 1999 },
//   rating: { normalized: 0.9, original: { value: 4.5, scale: 'stars_5' } },
//   review: { url: '...', platform: 'medium' },
//   reviewer: { name: 'John Doe', address: null },
//   metadata: { created: '2025-01-09T...', notes: '...' }
// }
```

### Rating Conversion Examples

```javascript
// 5 stars -> normalized
reviewService.normalizeRating(4, 'stars_5');
// Returns: 0.8

// Letter grade -> normalized
reviewService.normalizeRating('A-', 'letter_grade');
// Returns: 0.9

// Numeric (0-100) -> normalized
reviewService.normalizeRating(85, 'numeric_100');
// Returns: 0.85
```

### URL Validation

```javascript
const validation = reviewService.validateReviewUrl('https://youtube.com/watch?v=abc123');
console.log(validation);
// { valid: true, type: 'youtube', url: 'https://youtube.com/watch?v=abc123' }
```

## Review Data Model

### Full Review Object

```json
{
  "media": {
    "type": "movie|show|game",
    "id": 12345,
    "title": "Media Title",
    "year": 2024,
    "metadata": {}
  },
  "rating": {
    "normalized": 0.85,
    "original": {
      "value": 4.25,
      "scale": "stars_5"
    },
    "percentage": 85,
    "stars5": "4.3",
    "stars10": "8.5"
  },
  "review": {
    "url": "https://...",
    "platform": "medium"
  },
  "reviewer": {
    "name": "Reviewer Name",
    "address": "0x..."
  },
  "metadata": {
    "created": "2025-01-09T12:00:00.000Z",
    "notes": null
  }
}
```

### Blockchain Format (Compact)

```json
{
  "m": {
    "t": "movie",
    "i": 12345,
    "n": "Media Title",
    "y": 2024
  },
  "r": {
    "n": 0.85,
    "o": { "value": 4.25, "scale": "stars_5" }
  },
  "l": "https://...",
  "a": "0x...",
  "d": "2025-01-09T12:00:00.000Z"
}
```

## Rating Scales

### Scale Comparison

| Scale | Range | Precision | Example | Normalized |
|-------|-------|-----------|---------|------------|
| 5 Stars | 0-5 | 0.5 | 4.5 ★ | 0.9 |
| 10 Stars | 0-10 | 0.5 | 8.5 ★ | 0.85 |
| Numeric (10) | 0-10 | 0.1 | 8.5/10 | 0.85 |
| Numeric (100) | 0-100 | 1 | 85/100 | 0.85 |
| Letter Grade | A+-F | -- | A- | 0.9 |
| Float | 0.0-1.0 | 0.01 | 0.85 | 0.85 |

### Letter Grade Mapping

| Grade | Value | Normalized |
|-------|-------|------------|
| A+ | 100% | 1.00 |
| A | 95% | 0.95 |
| A- | 90% | 0.90 |
| B+ | 87% | 0.87 |
| B | 83% | 0.83 |
| B- | 80% | 0.80 |
| C+ | 77% | 0.77 |
| C | 73% | 0.73 |
| C- | 70% | 0.70 |
| D+ | 67% | 0.67 |
| D | 63% | 0.63 |
| D- | 60% | 0.60 |
| F | 0% | 0.00 |

## Integration with FabricPop

### Blockchain Submission Flow

```javascript
// 1. User creates review via workflow
const review = reviewService.createReview({ ... });

// 2. Connect wallet (using existing Polkadot integration)
const accounts = await web3Accounts();
const account = accounts[0];

// 3. Add blockchain address to review
review.reviewer.address = account.address;

// 4. Format for blockchain
const blockchainData = reviewService.formatForBlockchain(review);

// 5. Submit to blockchain
// (Blockchain submission logic goes here)
const hash = await submitToBlockchain(blockchainData, account);

// 6. Store review with transaction hash
review.metadata.blockchainHash = hash;
```

### Verifying Reviews

```javascript
// Retrieve review from blockchain
const blockchainReview = await getFromBlockchain(hash);

// Verify the review
const isValid = verifyReview(blockchainReview);

// Display review
console.log(reviewService.generateSummary(blockchainReview));
```

## Use Cases

### 1. Individual Reviewer
A movie critic publishes a video review on YouTube and wants to create a blockchain-verified record:
- Selects "Movie"
- Searches for "The Matrix"
- Rates it 5/5 stars
- Links to YouTube video
- Submits to blockchain

### 2. Publication
A gaming magazine publishes written reviews:
- Selects "Video Game"
- Searches for game
- Rates using their 0-100 scale
- Links to article URL
- Batch submits multiple reviews

### 3. Podcast
A movie podcast discusses films:
- Selects "Movie"
- Finds the discussed film
- Each host rates using letter grades
- Links to podcast episode
- Creates multiple reviews for same media

### 4. Community Platform
Users can browse and filter reviews:
- Query by normalized rating (0.8-1.0 for highly rated)
- Filter by media type
- Group by reviewer
- Verify authenticity via blockchain

## API Reference

### ReviewService

#### Constructor
```javascript
new ReviewService()
```

#### Methods

##### `normalizeRating(value, scale)`
Convert rating to normalized float (0.0-1.0).

**Parameters:**
- `value` (number|string): Rating value
- `scale` (string): Rating scale type

**Returns:** number (0.0-1.0)

**Throws:** Error if invalid value or scale

##### `validateReviewUrl(url)`
Validate and categorize review URL.

**Parameters:**
- `url` (string): Review URL

**Returns:** Object `{ valid, type, url, error }`

##### `createReview(params)`
Create complete review object.

**Parameters:**
- `mediaType` (string): 'movie', 'show', or 'game'
- `mediaId` (number): External API ID
- `mediaTitle` (string): Media title
- `mediaYear` (number): Release year
- `mediaMetadata` (Object): Additional metadata
- `ratingValue` (number|string): Rating value
- `ratingScale` (string): Rating scale
- `reviewUrl` (string): Review URL
- `reviewerName` (string): Reviewer name (optional)
- `reviewerAddress` (string): Blockchain address (optional)
- `notes` (string): Additional notes (optional)

**Returns:** Review object

**Throws:** Error if validation fails

##### `formatForBlockchain(review)`
Create compact blockchain format.

**Parameters:**
- `review` (Object): Full review object

**Returns:** Compact review object

##### `generateSummary(review)`
Generate human-readable summary.

**Parameters:**
- `review` (Object): Review object

**Returns:** string (formatted summary)

##### `getLetterGrades()`
Get available letter grade options.

**Returns:** Array of letter grade strings

##### `getRatingScaleInfo(scale)`
Get information about a rating scale.

**Parameters:**
- `scale` (string): Rating scale type

**Returns:** Object with scale info (label, min, max, step, format)

## Error Handling

The service provides clear error messages:

```javascript
try {
  const review = reviewService.createReview({ ... });
} catch (error) {
  console.error(error.message);
  // "Invalid media type. Must be one of: movie, show, game"
  // "Media ID is required"
  // "Rating value is required"
  // "Invalid review URL: URL is required"
  // "Invalid letter grade: Z+"
}
```

## Testing

### Manual Testing Checklist

- [ ] Create movie review with 5-star rating
- [ ] Create TV show review with numeric (0-10) rating
- [ ] Create game review with letter grade
- [ ] Test all rating scales
- [ ] Validate various URL formats
- [ ] Test with/without optional fields
- [ ] Verify normalized ratings are correct
- [ ] Check blockchain format is compact
- [ ] Test error cases

### Sample Test Data

```javascript
// Movie Review
{
  mediaType: 'movie',
  mediaId: 550,
  mediaTitle: 'Fight Club',
  mediaYear: 1999,
  ratingValue: 'A+',
  ratingScale: 'letter_grade',
  reviewUrl: 'https://youtube.com/watch?v=abc123'
}

// Game Review
{
  mediaType: 'game',
  mediaId: 1942,
  mediaTitle: 'The Witcher 3',
  mediaYear: 2015,
  ratingValue: 95,
  ratingScale: 'numeric_100',
  reviewUrl: 'https://medium.com/@gamer/witcher3'
}
```

## Future Enhancements

- [ ] Add aggregate rating calculation
- [ ] Support for review updates/edits
- [ ] Multi-reviewer consensus ratings
- [ ] Review moderation flags
- [ ] IPFS integration for review content
- [ ] Review reply/comment system
- [ ] Analytics dashboard
- [ ] Export to various formats

## Troubleshooting

### Issue: Can't search for games
**Solution**: Make sure the IGDB proxy server is running on port 3000

### Issue: Rating shows as "Invalid"
**Solution**: Ensure the value is within the valid range for the selected scale

### Issue: URL validation fails
**Solution**: Make sure the URL includes the protocol (https://)

## Resources

- [TMDB Integration](../tmdb-integration/README.md)
- [IGDB Integration](../igdb-integration/README.md)
- [FabricPop Main README](../../README.md)

---

**Ready to create blockchain-verified reviews!**

Start the demo: `http://localhost:8000/examples/review-workflow/review-demo.html`
