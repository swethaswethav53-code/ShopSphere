import axiosInstance from './axiosInstance';

export const getProductReviews = async (productId) => {
  const response = await axiosInstance.get(`/reviews/${productId}`);
  return response.data;
};

export const addReview = async (productId, rating, comment) => {
  const response = await axiosInstance.post(`/reviews/${productId}`, { rating, comment });
  return response.data;
};

export const updateReview = async (reviewId, rating, comment) => {
  const response = await axiosInstance.put(`/reviews/${reviewId}`, { rating, comment });
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(`/reviews/${reviewId}`);
  return response.data;
};