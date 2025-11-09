/**
 * IGDB API Service
 * Handles all interactions with the Internet Game Database (IGDB) API v4
 * Uses Twitch OAuth2 for authentication
 *
 * Base URL: https://api.igdb.com/v4
 * Authentication: Twitch Client ID + OAuth Access Token
 */

const IGDB_BASE_URL = 'https://api.igdb.com/v4';
const TWITCH_OAUTH_URL = 'https://id.twitch.tv/oauth2/token';
const IGDB_IMAGE_BASE_URL = 'https://images.igdb.com/igdb/image/upload';

class IGDBService {
  constructor(clientId, accessToken) {
    this.clientId = clientId;
    this.accessToken = accessToken;
  }

  /**
   * Make a request to IGDB API
   * @param {string} endpoint - API endpoint (e.g., 'games', 'search')
   * @param {string} body - Apicalypse query string
   * @returns {Promise<Object>} API response
   */
  async request(endpoint, body) {
    try {
      const response = await fetch(`${IGDB_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'text/plain'
        },
        body: body
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`IGDB API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`IGDB request error (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Search for games
   * @param {string} query - Search query
   * @param {number} limit - Maximum results (default: 10)
   * @returns {Promise<Array>} Search results
   */
  async searchGames(query, limit = 10) {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    const apicalypseQuery = `
      search "${query}";
      fields name, cover.url, first_release_date, rating, rating_count,
             summary, platforms.name, genres.name, involved_companies.company.name,
             storyline, screenshots.url;
      where version_parent = null;
      limit ${limit};
    `.trim();

    return await this.request('games', apicalypseQuery);
  }

  /**
   * Get game details by ID
   * @param {number} gameId - IGDB game ID
   * @returns {Promise<Object>} Game details
   */
  async getGameDetails(gameId) {
    const apicalypseQuery = `
      fields name, cover.url, cover.image_id, first_release_date, rating, rating_count,
             summary, storyline, platforms.name, genres.name, themes.name,
             involved_companies.company.name, involved_companies.developer,
             involved_companies.publisher, websites.*, videos.video_id,
             screenshots.url, screenshots.image_id, similar_games.name,
             similar_games.cover.url, aggregated_rating, aggregated_rating_count;
      where id = ${gameId};
    `.trim();

    const results = await this.request('games', apicalypseQuery);
    return results[0] || null;
  }

  /**
   * Get popular/trending games
   * @param {number} limit - Maximum results (default: 20)
   * @returns {Promise<Array>} Popular games
   */
  async getPopularGames(limit = 20) {
    // Get games from the last 2 years, sorted by rating count and rating
    const twoYearsAgo = Math.floor(Date.now() / 1000) - (2 * 365 * 24 * 60 * 60);

    const apicalypseQuery = `
      fields name, cover.url, first_release_date, rating, rating_count,
             summary, platforms.name, genres.name;
      where rating_count > 10 & first_release_date > ${twoYearsAgo};
      sort rating_count desc;
      limit ${limit};
    `.trim();

    return await this.request('games', apicalypseQuery);
  }

  /**
   * Get highly rated games
   * @param {number} limit - Maximum results (default: 20)
   * @returns {Promise<Array>} Top rated games
   */
  async getTopRatedGames(limit = 20) {
    const apicalypseQuery = `
      fields name, cover.url, first_release_date, rating, rating_count,
             summary, platforms.name, genres.name;
      where rating_count > 50 & rating != null;
      sort rating desc;
      limit ${limit};
    `.trim();

    return await this.request('games', apicalypseQuery);
  }

  /**
   * Get games by genre
   * @param {string} genreName - Genre name (e.g., "RPG", "Action")
   * @param {number} limit - Maximum results (default: 20)
   * @returns {Promise<Array>} Games in genre
   */
  async getGamesByGenre(genreName, limit = 20) {
    // First, get the genre ID
    const genreQuery = `
      search "${genreName}";
      fields name;
      limit 1;
    `.trim();

    const genres = await this.request('genres', genreQuery);
    if (!genres.length) {
      return [];
    }

    const genreId = genres[0].id;

    const gamesQuery = `
      fields name, cover.url, first_release_date, rating, rating_count,
             summary, platforms.name, genres.name;
      where genres = [${genreId}] & rating_count > 5;
      sort rating desc;
      limit ${limit};
    `.trim();

    return await this.request('games', gamesQuery);
  }

  /**
   * Get cover image URL
   * @param {Object} cover - Cover object from IGDB
   * @param {string} size - Image size (t_thumb, t_cover_small, t_cover_big, t_screenshot_med, t_1080p)
   * @returns {string} Full image URL
   */
  getCoverUrl(cover, size = 't_cover_big') {
    if (!cover || !cover.image_id) {
      // Try to extract image_id from url if present
      if (cover && cover.url) {
        const match = cover.url.match(/\/([^\/]+)\.jpg$/);
        if (match) {
          return `${IGDB_IMAGE_BASE_URL}/${size}/${match[1]}.jpg`;
        }
      }
      return 'https://via.placeholder.com/264x352?text=No+Cover';
    }
    return `${IGDB_IMAGE_BASE_URL}/${size}/${cover.image_id}.jpg`;
  }

  /**
   * Get screenshot URL
   * @param {Object} screenshot - Screenshot object from IGDB
   * @param {string} size - Image size (default: t_screenshot_big)
   * @returns {string} Full image URL
   */
  getScreenshotUrl(screenshot, size = 't_screenshot_big') {
    if (!screenshot || !screenshot.image_id) {
      if (screenshot && screenshot.url) {
        const match = screenshot.url.match(/\/([^\/]+)\.jpg$/);
        if (match) {
          return `${IGDB_IMAGE_BASE_URL}/${size}/${match[1]}.jpg`;
        }
      }
      return 'https://via.placeholder.com/1280x720?text=No+Screenshot';
    }
    return `${IGDB_IMAGE_BASE_URL}/${size}/${screenshot.image_id}.jpg`;
  }

  /**
   * Format game data for display
   * @param {Object} game - Raw IGDB game object
   * @returns {Object} Formatted game data
   */
  formatGame(game) {
    // Convert Unix timestamp to date
    const releaseDate = game.first_release_date
      ? new Date(game.first_release_date * 1000).toISOString().split('T')[0]
      : null;

    return {
      id: game.id,
      name: game.name,
      summary: game.summary || 'No summary available',
      storyline: game.storyline || '',
      releaseDate: releaseDate,
      releaseYear: releaseDate ? new Date(game.first_release_date * 1000).getFullYear() : 'TBA',
      rating: game.rating ? Math.round(game.rating) : null,
      ratingCount: game.rating_count || 0,
      coverUrl: this.getCoverUrl(game.cover),
      platforms: game.platforms ? game.platforms.map(p => p.name).join(', ') : 'Unknown',
      genres: game.genres ? game.genres.map(g => g.name).join(', ') : 'Unknown',
      developers: game.involved_companies
        ? game.involved_companies.filter(c => c.developer).map(c => c.company.name).join(', ')
        : 'Unknown',
      publishers: game.involved_companies
        ? game.involved_companies.filter(c => c.publisher).map(c => c.company.name).join(', ')
        : 'Unknown',
      screenshots: game.screenshots
        ? game.screenshots.map(s => this.getScreenshotUrl(s))
        : []
    };
  }

  /**
   * Get available image size options
   * @returns {Object} Size options and descriptions
   */
  getImageSizes() {
    return {
      covers: {
        't_thumb': '90x90',
        't_cover_small': '90x128',
        't_cover_big': '264x374',
        't_720p': '1280x720',
        't_1080p': '1920x1080'
      },
      screenshots: {
        't_screenshot_med': '569x320',
        't_screenshot_big': '889x500',
        't_screenshot_huge': '1280x720',
        't_720p': '1280x720',
        't_1080p': '1920x1080'
      }
    };
  }
}

export default IGDBService;
