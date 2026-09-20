import axios from './axiosInstance';

export const getRecommendations = async (limit = 4, excludeId = null) => {
  let url = `/recommendations?limit=${limit}`;
  if (excludeId) {
    url += `&exclude=${excludeId}`;
  }
  const response = await axios.get(url);
  return response.data;
};