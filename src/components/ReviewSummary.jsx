export default function ReviewSummary({ reviewData, reviewService, onSubmit, onBack }) {
  const mediaTypeLabel = {
    'movie': 'Movie',
    'show': 'TV Show',
    'game': 'Video Game'
  }[reviewData.mediaType]

  const normalized = reviewService.normalizeRating(reviewData.ratingValue, reviewData.ratingScale)
  const stars = (normalized * 5).toFixed(1)
  const percentage = Math.round(normalized * 100)

  return (
    <article>
      <header>
        <h3>Review Summary</h3>
        <p>Please review your submission before creating</p>
      </header>

      <table>
        <tbody>
          <tr>
            <td><strong>Media Type</strong></td>
            <td>{mediaTypeLabel}</td>
          </tr>
          <tr>
            <td><strong>Title</strong></td>
            <td>{reviewData.selectedMedia.title}</td>
          </tr>
          <tr>
            <td><strong>Year</strong></td>
            <td>{reviewData.selectedMedia.year}</td>
          </tr>
          <tr>
            <td><strong>Rating</strong></td>
            <td>
              <strong style={{ color: 'var(--pico-primary)' }}>
                {stars}/5.0 stars ({percentage}%)
              </strong>
              <br />
              <small style={{ color: 'var(--pico-muted-color)' }}>
                Original: {reviewService.getRatingScaleInfo(reviewData.ratingScale).format(reviewData.ratingValue)}
              </small>
            </td>
          </tr>
          <tr>
            <td><strong>Review URL</strong></td>
            <td>
              <a href={reviewData.reviewUrl} target="_blank" rel="noopener noreferrer">
                {reviewData.reviewUrl}
              </a>
            </td>
          </tr>
          {reviewData.reviewerName && (
            <tr>
              <td><strong>Reviewer</strong></td>
              <td>{reviewData.reviewerName}</td>
            </tr>
          )}
          {reviewData.notes && (
            <tr>
              <td><strong>Notes</strong></td>
              <td>{reviewData.notes}</td>
            </tr>
          )}
        </tbody>
      </table>

      <footer style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <button onClick={onBack} className="secondary">
          ← Back
        </button>
        <button onClick={onSubmit}>
          Create Review ✓
        </button>
      </footer>
    </article>
  )
}
