import axios from 'axios';

const SUBJECT_URL = 'http://localhost:3001/subjects';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: SUBJECT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDataForCards = async ( params = {}) => {
  try {
    const response = await api.get('/getDataForCards', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error.response?.data || error.message;
  }
};

export const getSubjectById = async (id, fields = []) => {
  try {
    const params = fields.length > 0 ? { fields: fields.join(',') } : {};
    const response = await api.get(`/${id}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching subject with id ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

export const addSubject = async (data) => {
  try {
    const response = await api.post('/', data);
    return response.data;
  } catch (error) {
    console.error('Error adding subject:', error);
    throw error.response?.data || error.message;
  }
};




export default api;
