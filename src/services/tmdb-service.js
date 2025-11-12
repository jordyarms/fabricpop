/**
 * TMDB API Service - v3 Compliant
 * Handles all interactions with The Movie Database API
 * Base URL: https://api.themoviedb.org/3
 * Authentication: Bearer token in Authorization header
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

class TMDBService {
  constructor(readToken, apiKey) {
    this.apiKey = apiKey;
    this.readToken = readToken;
    // TMDB v3 supports both API key query param and Bearer token
    // Using Bearer token is the recommended approach
    this.headers = {
      'Authorization': `Bearer ${readToken}`,
      'Content-Type': 'application/json;charset=utf-8'
    };
  }

  /**
   * Search for movies and TV shows
   * @param {string} query - Search query
   * @param {string} type - 'movie', 'tv', or 'multi' (default)
   * @returns {Promise<Array>} Search results
   */
  async search(query, type = 'multi') {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    const endpoint = type === 'multi'
      ? `${TMDB_BASE_URL}/search/multi`
      : `${TMDB_BASE_URL}/search/${type}`;

    const url = `${endpoint}?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data = await response.json();
      // For multi search, filter by media type. For specific searches, return all results
      if (type === 'multi') {
        return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
      }
      return data.results;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a movie
   * Endpoint: GET /movie/{movie_id}
   * @param {number} movieId - TMDB movie ID
   * @returns {Promise<Object>} Movie details
   */
  async getMovieDetails(movieId) {
    const url = `${TMDB_BASE_URL}/movie/${movieId}?language=en-US&append_to_response=credits,videos,release_dates`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get movie details error:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a TV show
   * Endpoint: GET /tv/{series_id}
   * @param {number} tvId - TMDB TV show ID
   * @returns {Promise<Object>} TV show details
   */
  async getTVDetails(tvId) {
    const url = `${TMDB_BASE_URL}/tv/${tvId}?language=en-US&append_to_response=credits,videos`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get TV details error:', error);
      throw error;
    }
  }

  /**
   * Get trending movies/shows
   * Endpoint: GET /trending/{media_type}/{time_window}
   * @param {string} mediaType - 'movie', 'tv', or 'all'
   * @param {string} timeWindow - 'day' or 'week'
   * @returns {Promise<Array>} Trending items
   */
  async getTrending(mediaType = 'all', timeWindow = 'week') {
    const url = `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?language=en-US`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Get trending error:', error);
      throw error;
    }
  }

  /**
   * Get popular movies
   * Endpoint: GET /movie/popular
   * @returns {Promise<Array>} Popular movies
   */
  async getPopularMovies() {
    const url = `${TMDB_BASE_URL}/movie/popular?language=en-US&page=1`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Get popular movies error:', error);
      throw error;
    }
  }

  /**
   * Get poster URL for an item
   * Images base URL: https://image.tmdb.org/t/p
   * @param {string} posterPath - Poster path from TMDB
   * @param {string} size - Image size (w92, w154, w185, w342, w500, w780, original)
   * @returns {string} Full poster URL
   */
  getPosterUrl(posterPath, size = 'w500') {
    if (!posterPath) {
      return 'https://via.placeholder.com/500x750?text=No+Poster';
    }
    return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
  }

  /**
   * Get backdrop URL for an item
   * @param {string} backdropPath - Backdrop path from TMDB
   * @param {string} size - Image size (w300, w780, w1280, original)
   * @returns {string} Full backdrop URL
   */
  getBackdropUrl(backdropPath, size = 'w1280') {
    if (!backdropPath) {
      return 'https://via.placeholder.com/1280x720?text=No+Backdrop';
    }
    return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
  }

  /**
   * Format movie/show data for display
   * @param {Object} item - Raw TMDB item
   * @returns {Object} Formatted item
   */
  formatItem(item) {
    const isMovie = item.media_type === 'movie' || item.title;
    return {
      id: item.id,
      title: isMovie ? item.title : item.name,
      originalTitle: isMovie ? item.original_title : item.original_name,
      overview: item.overview,
      releaseDate: isMovie ? item.release_date : item.first_air_date,
      posterUrl: this.getPosterUrl(item.poster_path),
      backdropUrl: this.getBackdropUrl(item.backdrop_path),
      voteAverage: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
      voteCount: item.vote_count,
      popularity: item.popularity,
      mediaType: isMovie ? 'movie' : 'tv',
      genre_ids: item.genre_ids || []
    };
  }
}

export default TMDBService;
