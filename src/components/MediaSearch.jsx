import { useState } from 'react'
import TMDBService from '../services/tmdb-service'
import IGDBService from '../services/igdb-service'

// Load API credentials from environment or use defaults
const tmdb = new TMDBService(
  import.meta.env.VITE_TMDB_READ_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MDBjOWY0OGU3ZTY4ZWQyYmRjMGJiNGU5OTljN2Y0NyIsIm5iZiI6MTc2MjY0NzExMi42NjUsInN1YiI6IjY5MGZkYzQ4YzE0YTM3Mjk0ZTRjNzljMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QmPG1PFu-xpLUrcU_8gJ-ANMjfLOZNM7rLD8oF2q4C8',
  import.meta.env.VITE_TMDB_API_KEY || '800c9f48e7e68ed2bdc0bb4e999c7f47'
)
const igdb = new IGDBService('/api/igdb')

export default function MediaSearch({ mediaType, selectedMedia, onSelect, onBack }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const search = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      let searchResults
      if (mediaType === 'game') {
        console.log('Searching games for:', query)
        searchResults = await igdb.searchGames(query, 10)
      } else {
        const type = mediaType === 'movie' ? 'movie' : 'tv'
        console.log('Searching TMDB for:', query, 'type:', type)
        searchResults = await tmdb.search(query, type)
      }
      console.log('Search results:', searchResults)
      setResults(searchResults || [])
    } catch (err) {
      console.error('Search error:', err)
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const selectMedia = (item) => {
    let formatted
    if (mediaType === 'game') {
      const game = igdb.formatGame(item)
      formatted = {
        id: game.id,
        title: game.name,
        year: game.releaseYear,
        poster: game.coverUrl,
        metadata: { platforms: game.platforms, genres: game.genres }
      }
    } else {
      const media = tmdb.formatItem(item)
      formatted = {
        id: media.id,
        title: media.title,
        year: media.releaseDate ? new Date(media.releaseDate).getFullYear() : null,
        poster: media.posterUrl,
        metadata: { mediaType: media.mediaType }
      }
    }
    onSelect(formatted)
  }

  const mediaTypeLabel = mediaType === 'movie' ? 'Movie' : mediaType === 'show' ? 'TV Show' : 'Video Game'

  return (
    <article>
      <header>
        <h3>Search {mediaTypeLabel}</h3>
      </header>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder={`Search for a ${mediaTypeLabel.toLowerCase()}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && search()}
        />
        <button onClick={search} disabled={loading} aria-busy={loading}>
          Search
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: 'var(--pico-del-background)', color: 'var(--pico-del-color)', borderRadius: 'var(--pico-border-radius)' }}>
          Error: {error}
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          {results.map((item, idx) => {
            const isGame = mediaType === 'game'
            const formatted = isGame ? igdb.formatGame(item) : tmdb.formatItem(item)
            const title = isGame ? formatted.name : formatted.title
            const year = isGame ? formatted.releaseYear : (formatted.releaseDate ? new Date(formatted.releaseDate).getFullYear() : 'N/A')
            const poster = isGame ? formatted.coverUrl : formatted.posterUrl

            return (
              <div
                key={idx}
                onClick={() => selectMedia(item)}
                style={{
                  cursor: 'pointer',
                  borderRadius: 'var(--pico-border-radius)',
                  overflow: 'hidden',
                  border: '2px solid transparent',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--pico-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <img src={poster} alt={title} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }} />
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--pico-card-background-color)' }}>
                  <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>{title}</strong>
                  <small style={{ color: 'var(--pico-muted-color)' }}>{year}</small>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {hasSearched && results.length === 0 && !loading && !error && (
        <p style={{ textAlign: 'center', color: 'var(--pico-muted-color)' }}>
          No results found. Try a different search.
        </p>
      )}

      <footer>
        <button onClick={onBack} className="secondary">
          ← Back
        </button>
      </footer>
    </article>
  )
}
