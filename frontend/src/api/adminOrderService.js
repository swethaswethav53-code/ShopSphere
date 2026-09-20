import axiosInstance from './axiosInstance';

export const getAllOrders = async () => {
  const response = await axiosInstance.get('/orders');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.put(`/orders/${id}/status`, { status });
  return response.data;
};