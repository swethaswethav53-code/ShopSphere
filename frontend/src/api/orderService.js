import axiosInstance from './axiosInstance';

export const placeOrder = async (shippingAddress) => {
  const response = await axiosInstance.post('/orders', { shippingAddress });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axiosInstance.get('/orders/myorders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axiosInstance.get(`/orders/${id}`);
  return response.data;
};