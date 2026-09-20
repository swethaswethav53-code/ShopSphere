import { useAuth } from '../context/AuthContext';

const ReviewList = ({ reviews, onEdit, onDelete }) => {
  const { user, isAdmin } = useAuth();

  if (reviews.length === 0) {
    return <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwner = user && review.user._id === user._id;

        return (
          <div key={review._id} className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{review.user.name}</p>
                <p className="text-yellow-500 text-sm">
                  {'⭐'.repeat(review.rating)}{' '}
                  <span className="text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </p>
              </div>

              {(isOwner || isAdmin) && (
                <div className="flex gap-3 text-sm">
                  {isOwner && (
                    <button onClick={() => onEdit(review)} className="text-blue-600 hover:underline">
                      Edit
                    </button>
                  )}
                  <button onClick={() => onDelete(review._id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-700 mt-2">{review.comment}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;