import { useState } from 'react'
import MediaTypeSelector from './MediaTypeSelector'
import MediaSearch from './MediaSearch'
import RatingInput from './RatingInput'
import ReviewLinkInput from './ReviewLinkInput'
import ReviewSummary from './ReviewSummary'
import ReviewService from '../services/review-service'

const reviewService = new ReviewService()

export default function ReviewWorkflow({ account }) {
  const [step, setStep] = useState(1)
  const [reviewData, setReviewData] = useState({
    mediaType: null,
    selectedMedia: null,
    ratingValue: null,
    ratingScale: 'stars_5',
    reviewUrl: '',
    reviewerName: account.meta?.name || '',
    notes: ''
  })
  const [createdReview, setCreatedReview] = useState(null)

  const updateReviewData = (updates) => {
    setReviewData(prev => ({ ...prev, ...updates }))
  }

  const goToStep = (newStep) => {
    setStep(newStep)
  }

  const resetWorkflow = () => {
    setStep(1)
    setReviewData({
      mediaType: null,
      selectedMedia: null,
      ratingValue: null,
      ratingScale: 'stars_5',
      reviewUrl: '',
      reviewerName: account.meta?.name || '',
      notes: ''
    })
    setCreatedReview(null)
  }

  const createReview = () => {
    try {
      const review = reviewService.createReview({
        mediaType: reviewData.mediaType,
        mediaId: reviewData.selectedMedia.id,
        mediaTitle: reviewData.selectedMedia.title,
        mediaYear: reviewData.selectedMedia.year,
        mediaMetadata: reviewData.selectedMedia.metadata,
        ratingValue: reviewData.ratingValue,
        ratingScale: reviewData.ratingScale,
        reviewUrl: reviewData.reviewUrl,
        reviewerName: reviewData.reviewerName || 'Anonymous',
        reviewerAddress: account.address,
        notes: reviewData.notes || null
      })

      setCreatedReview(review)
      setStep(6)
    } catch (error) {
      alert(`Error creating review: ${error.message}`)
    }
  }

  return (
    <div>
      <hgroup>
        <h2>Create a Review</h2>
        <p>Step {Math.min(step, 5)} of 5</p>
      </hgroup>

      <progress value={step} max="5" style={{ marginBottom: '2rem' }}></progress>

      {/* Step 1: Media Type */}
      {step === 1 && (
        <MediaTypeSelector
          selected={reviewData.mediaType}
          onSelect={(type) => {
            updateReviewData({ mediaType: type, selectedMedia: null })
            goToStep(2)
          }}
        />
      )}

      {/* Step 2: Search & Select Media */}
      {step === 2 && (
        <MediaSearch
          mediaType={reviewData.mediaType}
          selectedMedia={reviewData.selectedMedia}
          onSelect={(media) => {
            updateReviewData({ selectedMedia: media })
            goToStep(3)
          }}
          onBack={() => goToStep(1)}
        />
      )}

      {/* Step 3: Rating */}
      {step === 3 && (
        <RatingInput
          ratingValue={reviewData.ratingValue}
          ratingScale={reviewData.ratingScale}
          onRatingChange={(value) => updateReviewData({ ratingValue: value })}
          onScaleChange={(scale) => updateReviewData({ ratingScale: scale })}
          onNext={() => goToStep(4)}
          onBack={() => goToStep(2)}
        />
      )}

      {/* Step 4: Review Link & Details */}
      {step === 4 && (
        <ReviewLinkInput
          reviewUrl={reviewData.reviewUrl}
          reviewerName={reviewData.reviewerName}
          notes={reviewData.notes}
          onChange={(updates) => updateReviewData(updates)}
          onNext={() => goToStep(5)}
          onBack={() => goToStep(3)}
        />
      )}

      {/* Step 5: Summary & Submit */}
      {step === 5 && (
        <ReviewSummary
          reviewData={reviewData}
          reviewService={reviewService}
          onSubmit={createReview}
          onBack={() => goToStep(4)}
        />
      )}

      {/* Step 6: Success */}
      {step === 6 && createdReview && (
        <article>
          <header>
            <h3>✅ Review Created Successfully!</h3>
          </header>

          <p>Your review has been formatted and is ready for blockchain submission.</p>

          <details>
            <summary>Human-Readable Summary</summary>
            <pre style={{ fontSize: '0.85rem', overflow: 'auto' }}>
              {reviewService.generateSummary(createdReview)}
            </pre>
          </details>

          <details>
            <summary>Full Review Object (JSON)</summary>
            <pre style={{ fontSize: '0.75rem', overflow: 'auto', maxHeight: '400px' }}>
              {JSON.stringify(createdReview, null, 2)}
            </pre>
          </details>

          <details>
            <summary>Blockchain Format (Compact)</summary>
            <pre style={{ fontSize: '0.75rem', overflow: 'auto' }}>
              {JSON.stringify(reviewService.formatForBlockchain(createdReview), null, 2)}
            </pre>
          </details>

          <footer>
            <button onClick={resetWorkflow}>Create Another Review</button>
          </footer>
        </article>
      )}
    </div>
  )
}
