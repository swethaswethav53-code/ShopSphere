import axiosInstance from './axiosInstance';

// Fetch products with optional filters: { search, category, minPrice, maxPrice, sort }
export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.sort) params.append('sort', filters.sort);

  const response = await axiosInstance.get(`/products?${params.toString()}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};