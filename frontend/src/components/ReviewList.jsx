import { useAuth } from '../context/AuthContext';

const ReviewList = ({ reviews, onEdit, onDelete }) => {
  const { user, isAdmin } = useAuth();

  if (reviews.length === 0) {
    return <p className="text-slate-400 text-sm">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwner = user && review.user?._id === user._id;

        return (
          <div key={review._id} className="border-b border-slate-800 pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <p className="font-medium text-white break-words">
                  {review.user?.name || 'Deleted user'}
                </p>
                <p className="text-amber-400 text-sm mt-0.5">
                  {'⭐'.repeat(review.rating)}{' '}
                  <span className="text-slate-500 text-xs sm:text-sm whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </p>
              </div>

              {(isOwner || isAdmin) && (
                <div className="flex items-center flex-shrink-0 text-sm">
                  {isOwner && (
                    <button
                      onClick={() => onEdit(review)}
                      className="min-h-[44px] px-3 text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(review._id)}
                    className="min-h-[44px] px-3 text-red-400 hover:text-red-300 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="text-slate-300 text-sm sm:text-base mt-1 break-words">{review.comment}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;