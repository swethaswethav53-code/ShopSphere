import { useState, useEffect } from 'react';

const ReviewForm = ({ onSubmit, editingReview, onCancelEdit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // When "editingReview" is passed in (user clicked Edit), pre-fill the form
  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setComment(editingReview.comment);
    } else {
      setRating(5);
      setComment('');
    }
  }, [editingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setComment('');
      setRating(5);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="font-medium mb-3">
        {editingReview ? 'Edit your review' : 'Write a review'}
      </h3>

      <div className="mb-3">
        <label className="block text-sm mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded px-3 py-2"
        >
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>
              {num} {'⭐'.repeat(num)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          {submitting ? 'Saving...' : editingReview ? 'Update Review' : 'Submit Review'}
        </button>
        {editingReview && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 rounded text-sm border"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;