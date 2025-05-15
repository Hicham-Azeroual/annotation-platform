import axios from './axiosConfig';

const API_URL = '/admin/datasets';
const COUPE_TEXTES_URL = 'admin/coupe-textes';

/**
 * Fetch all datasets from the API.
 * @param {number} page - The page number
 * @param {number} size - The number of items per page
 * @returns {Promise<Object>} API response data
 */
export const getAllDatasets = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch datasets');
  }
};

/**
 * Fetch a dataset by its ID.
 * @param {number|string} id - The dataset ID
 * @returns {Promise<Object>} API response data
 */
export const getDatasetById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to fetch dataset with ID ${id}`);
  }
};

/**
 * Fetch dataset details by its ID.
 * @param {number|string} id - The dataset ID
 * @returns {Promise<Object>} API response data
 */
export const getDatasetDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/details`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to fetch dataset details with ID ${id}`);
  }
};

/**
 * Fetch coupe textes by dataset ID.
 * @param {number|string} datasetId - The dataset ID
 * @param {number} page - The page number
 * @param {number} size - The number of items per page
 * @returns {Promise<Object>} API response data
 */
export const getCoupeTextesByDatasetId = async (datasetId, page = 0, size = 10) => {
  try {
    const response = await axios.get(`${COUPE_TEXTES_URL}/dataset/${datasetId}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to fetch coupe textes for dataset ID ${datasetId}`);
  }
};

/**
 * Export a dataset by its ID.
 * @param {number|string} id - The dataset ID
 * @returns {Promise<Object>} API response data
 */
export const exportDataset = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to export dataset with ID ${id}`);
  }
};

/**
 * Create a new dataset.
 * @param {FormData} formData - The dataset data including name, description, classes, and file
 * @returns {Promise<Object>} API response data
 */
export const createDataset = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create dataset');
  }
};

/**
 * Fetch available annotators for a dataset by its ID.
 * @param {number|string} datasetId - The dataset ID
 * @returns {Promise<Object>} API response data
 */
export const getAvailableAnnotatorsForDataset = async (datasetId) => {
  try {
    const response = await axios.get(`${API_URL}/${datasetId}/available-annotators`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to fetch available annotators for dataset ID ${datasetId}`);
  }
};

/**
 * Assign annotators to a dataset, creating tasks with a deadline.
 * @param {number|string} datasetId - The dataset ID
 * @param {Array<number>} annotatorIds - Array of annotator IDs to assign
 * @param {string|Date} deadline - Optional deadline for the assignment (ISO format, e.g., "2025-05-20T14:22:00+01:00")
 * @returns {Promise<Object>} API response data
 */
export const assignAnnotatorsToDataset = async (datasetId, annotatorIds, deadline = null) => {
  try {
    const payload = {
      datasetId: Number(datasetId),
      annotatorIds,
      deadline: deadline ? new Date(deadline).toISOString() : null,
    };
    const response = await axios.post(`${API_URL}/${datasetId}/assign`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to assign annotators to dataset ID ${datasetId}`);
  }
};
/**
 * Unassign an annotator from a dataset, preserving completed work.
 * @param {number|string} datasetId - The dataset ID
 * @param {number} annotatorId - The annotator ID
 * @returns {Promise<Object>} API response data
 */
export const unassignAnnotatorFromDataset = async (datasetId, annotatorId) => {
  try {
    const response = await axios.post(`${COUPE_TEXTES_URL}/dataset/${datasetId}/unassign/${annotatorId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to unassign annotator ${annotatorId} from dataset ${datasetId}`);
  }
};