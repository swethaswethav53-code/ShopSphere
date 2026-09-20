import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { deleteReview } from '../../api/adminReviewService';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/reviews');
      setReviews(response.data.data);
    } catch (err) {
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    setDeletingId(id);
    try {
      await deleteReview(id);
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading reviews...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>

      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</p>}

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <p className="font-medium">{review.product?.name || 'Deleted product'}</p>
                <p className="text-sm text-gray-500">
                  by {review.user?.name} ({review.user?.email})
                </p>
              </div>
              <button
                onClick={() => handleDelete(review._id)}
                disabled={deletingId === review._id}
                className="text-red-500 text-sm hover:underline disabled:opacity-40"
              >
                Delete
              </button>
            </div>
            <p className="text-yellow-500 text-sm mb-1">{'⭐'.repeat(review.rating)}</p>
            <p className="text-gray-700 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <p className="text-gray-500 text-center py-10">No reviews yet.</p>
      )}
    </div>
  );
};

export default AdminReviews;