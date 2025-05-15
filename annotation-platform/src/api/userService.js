import axios from './axiosConfig';

export const loginUser = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};