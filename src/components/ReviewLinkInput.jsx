import { useState, useEffect } from 'react'
import ReviewService from '../services/review-service'

const reviewService = new ReviewService()

export default function ReviewLinkInput({ reviewUrl, reviewerName, notes, onChange, onNext, onBack }) {
  const [urlValidation, setUrlValidation] = useState(null)

  useEffect(() => {
    if (reviewUrl) {
      const validation = reviewService.validateReviewUrl(reviewUrl)
      setUrlValidation(validation)
    } else {
      setUrlValidation(null)
    }
  }, [reviewUrl])

  const canProceed = urlValidation && urlValidation.valid

  return (
    <article>
      <header>
        <h3>Link to Your Review</h3>
        <p>Provide the URL where your review is published</p>
      </header>

      <label>
        Review URL *
        <input
          type="url"
          placeholder="https://medium.com/your-review or https://youtube.com/watch?v=..."
          value={reviewUrl}
          onChange={(e) => onChange({ reviewUrl: e.target.value })}
          aria-invalid={urlValidation && !urlValidation.valid ? 'true' : undefined}
        />
        {urlValidation && (
          <small style={{ color: urlValidation.valid ? 'var(--pico-ins-color)' : 'var(--pico-del-color)' }}>
            {urlValidation.valid
              ? `✓ Valid ${urlValidation.type} URL`
              : `✗ ${urlValidation.error}`
            }
          </small>
        )}
      </label>

      <label>
        Your Name (Optional)
        <input
          type="text"
          placeholder="Your name or pseudonym"
          value={reviewerName}
          onChange={(e) => onChange({ reviewerName: e.target.value })}
        />
        <small>This will be stored on the blockchain with your review</small>
      </label>

      <label>
        Notes (Optional)
        <textarea
          placeholder="Additional notes about your review..."
          value={notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          rows={4}
        />
      </label>

      <footer style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <button onClick={onBack} className="secondary">
          ← Back
        </button>
        <button onClick={onNext} disabled={!canProceed}>
          Review & Submit →
        </button>
      </footer>
    </article>
  )
}
