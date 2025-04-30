import axios from 'axios';

// Mock API functions
export const fetchSchemas = () => {
  return axios.get('/api/schemas');
};

export const createSchema = (schema: any) => {
  return Promise.reject(new Error('Not implemented in mock API'));
};

export const fetchSchema = (id: number) => {
  return Promise.reject(new Error('Not implemented in mock API'));
};

export const submitQuery = (query: string, schemaId: number) => {
  return axios.post('/api/query', { query, schemaId });
};

export const fetchQueryHistory = () => {
  return Promise.reject(new Error('Not implemented in mock API'));
};
