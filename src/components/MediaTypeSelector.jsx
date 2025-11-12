export default function MediaTypeSelector({ selected, onSelect }) {
  const mediaTypes = [
    { id: 'movie', label: 'Movie', icon: '🎬', description: 'Search movies via TMDB' },
    { id: 'show', label: 'TV Show', icon: '📺', description: 'Search TV shows via TMDB' },
    { id: 'game', label: 'Video Game', icon: '🎮', description: 'Search games via IGDB' }
  ]

  return (
    <article>
      <header>
        <h3>Select Media Type</h3>
        <p>What would you like to review?</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {mediaTypes.map(type => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            style={{
              padding: '2rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: selected === type.id ? 'var(--pico-primary-background)' : undefined
            }}
          >
            <span style={{ fontSize: '3rem' }}>{type.icon}</span>
            <strong>{type.label}</strong>
            <small style={{ color: 'var(--pico-muted-color)' }}>{type.description}</small>
          </button>
        ))}
      </div>
    </article>
  )
}
