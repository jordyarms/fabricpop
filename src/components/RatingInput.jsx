import { useState, useEffect } from 'react'
import ReviewService from '../services/review-service'

const reviewService = new ReviewService()

export default function RatingInput({ ratingValue, ratingScale, onRatingChange, onScaleChange, onNext, onBack }) {
  const [normalized, setNormalized] = useState(null)

  useEffect(() => {
    if (ratingValue !== null && ratingValue !== undefined && ratingValue !== '') {
      try {
        const norm = reviewService.normalizeRating(ratingValue, ratingScale)
        setNormalized(norm)
      } catch (err) {
        setNormalized(null)
      }
    } else {
      setNormalized(null)
    }
  }, [ratingValue, ratingScale])

  const scaleInfo = reviewService.getRatingScaleInfo(ratingScale)
  const canProceed = ratingValue !== null && ratingValue !== undefined && ratingValue !== '' && normalized !== null

  return (
    <article>
      <header>
        <h3>Rate the Media</h3>
      </header>

      <label>
        Rating Scale
        <select value={ratingScale} onChange={(e) => onScaleChange(e.target.value)}>
          <option value="stars_5">5 Stars (0-5)</option>
          <option value="numeric_10">Score (0-10)</option>
          <option value="numeric_100">Score (0-100)</option>
          <option value="letter_grade">Letter Grade (A+ to F)</option>
          <option value="float">Float (0.0-1.0)</option>
        </select>
      </label>

      {ratingScale === 'letter_grade' ? (
        <label>
          {scaleInfo.label}
          <select value={ratingValue || 'A'} onChange={(e) => onRatingChange(e.target.value)}>
            {reviewService.getLetterGrades().map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </label>
      ) : (
        <label>
          {scaleInfo.label}
          <input
            type="number"
            min={scaleInfo.min}
            max={scaleInfo.max}
            step={scaleInfo.step}
            value={ratingValue || ''}
            onChange={(e) => onRatingChange(parseFloat(e.target.value))}
            placeholder={`Enter rating (${scaleInfo.min}-${scaleInfo.max})`}
          />
        </label>
      )}

      {normalized !== null && (
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'var(--pico-primary-background)',
          borderRadius: 'var(--pico-border-radius)',
          textAlign: 'center',
          marginTop: '1rem'
        }}>
          <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Your Rating</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {scaleInfo.format(ratingValue)}
          </div>
          <div style={{ marginTop: '0.5rem', color: 'var(--pico-muted-color)' }}>
            Normalized: {normalized.toFixed(2)} ({Math.round(normalized * 100)}%)
          </div>
          <div style={{ marginTop: '0.25rem', color: 'var(--pico-muted-color)', fontSize: '0.85rem' }}>
            ≈ {(normalized * 5).toFixed(1)}/5 stars
          </div>
        </div>
      )}

      <footer style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <button onClick={onBack} className="secondary">
          ← Back
        </button>
        <button onClick={onNext} disabled={!canProceed}>
          Next →
        </button>
      </footer>
    </article>
  )
}
