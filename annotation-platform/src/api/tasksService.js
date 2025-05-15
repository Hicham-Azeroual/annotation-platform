import axios from './axiosConfig';

const API_URL = '/tasks';

export const getTaskSummaryByAnnotator = async (annotatorId) => {
  try {
    const response = await axios.get(`${API_URL}/annotator/${annotatorId}/summary`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch task summary');
  }
};

export const getTaskByAnnotator = async (annotatorId, datasetId, page = null) => {
  try {
    const params = { datasetId };
    if (page !== null) params.page = page;
    const response = await axios.get(`${API_URL}/annotator/${annotatorId}`, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch task');
  }
};

export const saveAnnotation = async (annotationData) => {
    try {
      const response = await axios.post(`${API_URL}/annotate`, null, {
        params: {
          annotatorId: annotationData.annotatorId,
          coupeTexteId: annotationData.coupeTexteId,
          classeChoisieId: annotationData.classeChoisieId, // Updated from className to classeChoisieId
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save annotation');
    }
  };