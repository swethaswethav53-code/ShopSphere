import axiosInstance from './axiosInstance';

// Reuses the same DELETE endpoint regular users use - your backend already
// allows admins to delete ANY review (Phase 4's isAdmin check in reviewController)
export const deleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(`/reviews/${reviewId}`);
  return response.data;
};