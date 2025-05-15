import axios from './axiosConfig';

export const getStatistics = async () => {
  const response = await axios.get('/admin/statistics');
  return response.data;
};