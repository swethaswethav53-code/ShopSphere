import { useState, useEffect } from 'react';

// Shared input style (text-base on mobile stops iOS zoom on focus)
const inputClass =
  'bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-base sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors';

const ReviewForm = ({ onSubmit, editingReview, onCancelEdit, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ProductDetails "onCancel" nu pass pannudhu, matha idathula "onCancelEdit"
  const handleCancel = onCancelEdit || onCancel;

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
    <form
      onSubmit={handleSubmit}
      className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 sm:p-5 mb-6"
    >
      <h3 className="font-semibold text-white mb-3 sm:mb-4">
        {editingReview ? 'Edit your review' : 'Write a review'}
      </h3>

      <div className="mb-3 sm:mb-4">
        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className={`${inputClass} w-full sm:w-auto`}
        >
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>
              {num} {'⭐'.repeat(num)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={3}
          placeholder="Share your experience with this product"
          className={`${inputClass} w-full`}
        />
      </div>

      {/* Mobile: stacked (Submit on top). Desktop: side by side */}
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
        {editingReview && (
          <button
            type="button"
            onClick={handleCancel}
            className="btn-touch w-full sm:w-auto px-5 rounded-lg text-sm font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn-touch w-full sm:w-auto px-5 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving...' : editingReview ? 'Update Review' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;