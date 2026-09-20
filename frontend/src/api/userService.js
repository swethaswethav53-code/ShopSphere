import axiosInstance from './axiosInstance';

export const getProfile = async () => {
  const response = await axiosInstance.get('/users/profile');
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await axiosInstance.put('/users/profile', userData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

export const updateUserRole = async (userId, roleData) => {
  const response = await axiosInstance.put(`/users/${userId}`, roleData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(`/users/${userId}`);
  return response.data;
};