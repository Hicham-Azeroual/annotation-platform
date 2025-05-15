import axios from './axiosConfig';
const API_URL = '/admin/annotators';

export const getAllAnnotators = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
export const createAnnotator = async (annotator) => {
  const response = await axios.post(API_URL, annotator);
  return response.data;
};

export const getAnnotatorById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

  // update the methode je veut ajouter le role to be ANNOTATOR if not exist in the annotateur parametre
export const updateAnnotator = async (id, annotator) => {
  annotator.role = annotator.role || 'ANNOTATOR';
  const response = await axios.put(`${API_URL}/${id}`, annotator);
  return response.data;
};

export const deleteAnnotator = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};