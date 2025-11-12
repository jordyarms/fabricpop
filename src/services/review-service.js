/**
 * Review Service
 * Handles review creation, rating conversion, and data formatting
 * for FabricPop blockchain-verified reviews
 */

class ReviewService {
  constructor() {
    this.ratingScales = {
      STARS_5: 'stars_5',
      STARS_10: 'stars_10',
      NUMERIC_10: 'numeric_10',
      NUMERIC_100: 'numeric_100',
      LETTER_GRADE: 'letter_grade',
      FLOAT: 'float'
    };

    this.letterGradeMap = {
      'A+': 1.0, 'A': 0.95, 'A-': 0.9,
      'B+': 0.87, 'B': 0.83, 'B-': 0.8,
      'C+': 0.77, 'C': 0.73, 'C-': 0.7,
      'D+': 0.67, 'D': 0.63, 'D-': 0.6,
      'F': 0.0
    };
  }

  /**
   * Convert rating from various scales to normalized float (0.0-1.0)
   * @param {number|string} value - Rating value
   * @param {string} scale - Rating scale type
   * @returns {number} Normalized rating (0.0-1.0)
   */
  normalizeRating(value, scale) {
    switch (scale) {
      case this.ratingScales.STARS_5:
        // 0-5 stars
        return Math.max(0, Math.min(1, parseFloat(value) / 5));

      case this.ratingScales.STARS_10:
        // 0-10 stars
        return Math.max(0, Math.min(1, parseFloat(value) / 10));

      case this.ratingScales.NUMERIC_10:
        // 0-10 numeric
        return Math.max(0, Math.min(1, parseFloat(value) / 10));

      case this.ratingScales.NUMERIC_100:
        // 0-100 numeric
        return Math.max(0, Math.min(1, parseFloat(value) / 100));

      case this.ratingScales.LETTER_GRADE:
        // Letter grade (A+, A, B+, etc.)
        const normalized = this.letterGradeMap[value.toUpperCase()];
        if (normalized === undefined) {
          throw new Error(`Invalid letter grade: ${value}`);
        }
        return normalized;

      case this.ratingScales.FLOAT:
        // Direct float value (0.0-1.0)
        const floatVal = parseFloat(value);
        if (isNaN(floatVal)) {
          throw new Error('Invalid float value');
        }
        return Math.max(0, Math.min(1, floatVal));

      default:
        throw new Error(`Unknown rating scale: ${scale}`);
    }
  }

  /**
   * Validate review URL
   * @param {string} url - Review URL
   * @returns {Object} Validation result {valid: boolean, type: string, error: string}
   */
  validateReviewUrl(url) {
    if (!url || !url.trim()) {
      return { valid: false, error: 'URL is required' };
    }

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      // Detect platform type
      let type = 'other';
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        type = 'youtube';
      } else if (hostname.includes('medium.com')) {
        type = 'medium';
      } else if (hostname.includes('substack.com')) {
        type = 'substack';
      } else if (hostname.includes('spotify.com')) {
        type = 'podcast';
      } else if (hostname.includes('podcasts.apple.com')) {
        type = 'podcast';
      } else if (hostname.includes('soundcloud.com')) {
        type = 'podcast';
      } else if (hostname.includes('letterboxd.com')) {
        type = 'letterboxd';
      } else if (hostname.includes('imdb.com')) {
        type = 'imdb';
      } else if (hostname.includes('rottentomatoes.com')) {
        type = 'rottentomatoes';
      }

      return { valid: true, type, url: url.trim() };
    } catch (error) {
      return { valid: false, error: 'Invalid URL format' };
    }
  }

  /**
   * Create a review object
   * @param {Object} params - Review parameters
   * @returns {Object} Formatted review object
   */
  createReview({
    mediaType,      // 'movie', 'show', 'game'
    mediaId,        // External API ID (TMDB or IGDB)
    mediaTitle,     // Title of the media
    mediaYear,      // Release year
    mediaMetadata,  // Additional metadata (optional)
    ratingValue,    // User's rating value
    ratingScale,    // Rating scale used
    reviewUrl,      // Link to the actual review
    reviewerName,   // Optional reviewer name
    reviewerAddress, // Blockchain address (optional for now)
    notes           // Optional notes
  }) {
    // Validate media type
    const validMediaTypes = ['movie', 'show', 'game'];
    if (!validMediaTypes.includes(mediaType)) {
      throw new Error(`Invalid media type. Must be one of: ${validMediaTypes.join(', ')}`);
    }

    // Validate required fields
    if (!mediaId) throw new Error('Media ID is required');
    if (!mediaTitle) throw new Error('Media title is required');
    if (ratingValue === undefined || ratingValue === null) throw new Error('Rating value is required');
    if (!ratingScale) throw new Error('Rating scale is required');

    // Normalize rating
    const normalizedRating = this.normalizeRating(ratingValue, ratingScale);

    // Validate review URL
    const urlValidation = this.validateReviewUrl(reviewUrl);
    if (!urlValidation.valid) {
      throw new Error(`Invalid review URL: ${urlValidation.error}`);
    }

    // Create review object
    const review = {
      // Media information
      media: {
        type: mediaType,
        id: mediaId,
        title: mediaTitle,
        year: mediaYear || null,
        metadata: mediaMetadata || {}
      },

      // Rating information
      rating: {
        normalized: normalizedRating, // 0.0-1.0
        original: {
          value: ratingValue,
          scale: ratingScale
        },
        percentage: Math.round(normalizedRating * 100), // For display
        stars5: (normalizedRating * 5).toFixed(1), // Convert to 5-star for display
        stars10: (normalizedRating * 10).toFixed(1) // Convert to 10-star for display
      },

      // Review link
      review: {
        url: urlValidation.url,
        platform: urlValidation.type
      },

      // Reviewer information
      reviewer: {
        name: reviewerName || 'Anonymous',
        address: reviewerAddress || null
      },

      // Metadata
      metadata: {
        created: new Date().toISOString(),
        notes: notes || null
      }
    };

    return review;
  }

  /**
   * Format review for blockchain submission
   * This creates a compact, hash-friendly representation
   * @param {Object} review - Review object
   * @returns {Object} Blockchain-ready review
   */
  formatForBlockchain(review) {
    return {
      m: {
        t: review.media.type,
        i: review.media.id,
        n: review.media.title,
        y: review.media.year
      },
      r: {
        n: review.rating.normalized,
        o: review.rating.original
      },
      l: review.review.url,
      a: review.reviewer.address,
      d: review.metadata.created
    };
  }

  /**
   * Generate a human-readable summary of the review
   * @param {Object} review - Review object
   * @returns {string} Review summary
   */
  generateSummary(review) {
    const mediaTypeLabel = {
      'movie': 'Movie',
      'show': 'TV Show',
      'game': 'Video Game'
    }[review.media.type];

    return `${mediaTypeLabel} Review: "${review.media.title}" (${review.media.year || 'N/A'})
Rating: ${review.rating.stars5}/5.0 stars (${review.rating.percentage}%)
Reviewed by: ${review.reviewer.name}
Platform: ${review.review.platform}
URL: ${review.review.url}
Created: ${new Date(review.metadata.created).toLocaleDateString()}`;
  }

  /**
   * Get available letter grades
   * @returns {Array} Array of letter grade options
   */
  getLetterGrades() {
    return Object.keys(this.letterGradeMap).sort((a, b) => {
      return this.letterGradeMap[b] - this.letterGradeMap[a];
    });
  }

  /**
   * Get rating scale info
   * @param {string} scale - Rating scale type
   * @returns {Object} Scale information
   */
  getRatingScaleInfo(scale) {
    const info = {
      [this.ratingScales.STARS_5]: {
        label: '5 Stars',
        min: 0,
        max: 5,
        step: 0.5,
        format: (v) => `${v} ★`
      },
      [this.ratingScales.STARS_10]: {
        label: '10 Stars',
        min: 0,
        max: 10,
        step: 0.5,
        format: (v) => `${v} ★`
      },
      [this.ratingScales.NUMERIC_10]: {
        label: 'Score (0-10)',
        min: 0,
        max: 10,
        step: 0.1,
        format: (v) => `${v}/10`
      },
      [this.ratingScales.NUMERIC_100]: {
        label: 'Score (0-100)',
        min: 0,
        max: 100,
        step: 1,
        format: (v) => `${v}/100`
      },
      [this.ratingScales.LETTER_GRADE]: {
        label: 'Letter Grade',
        options: this.getLetterGrades(),
        format: (v) => v
      },
      [this.ratingScales.FLOAT]: {
        label: 'Float (0.0-1.0)',
        min: 0,
        max: 1,
        step: 0.01,
        format: (v) => v.toFixed(2)
      }
    };

    return info[scale] || null;
  }
}

export default ReviewService;
