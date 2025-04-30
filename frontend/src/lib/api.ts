import axios from 'axios';

// Check if we're using the mock API (when backend is not available)
const useMockApi =
  !process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Create an axios instance with default config
const api = axios.create({
  baseURL: useMockApi ? '' : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  config => {
    // You can add auth tokens here if needed
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle common errors here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received');
      console.log('Falling back to mock API...');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

// API functions with fallback to mock API
export const fetchSchemas = () => {
  if (useMockApi) {
    console.log('Using mock API for schemas');
    return axios.get('/api/schemas');
  }
  return api.get('/api/schemas');
};

export const createSchema = (schema: any) => {
  if (useMockApi) {
    console.log('Using mock API for schema creation');
    // Mock implementation would go here
    return Promise.reject(new Error('Schema creation not implemented in mock API'));
  }
  return api.post('/api/schemas', schema);
};

export const fetchSchema = (id: number) => {
  if (useMockApi) {
    console.log('Using mock API for schema details');
    // Mock implementation would go here
    return Promise.reject(new Error('Schema details not implemented in mock API'));
  }
  return api.get(`/api/schemas/${id}`);
};

export const submitQuery = (query: string, schemaId: number) => {
  if (useMockApi) {
    console.log('Using mock API for query submission');
    return axios.post('/api/query', { query, schemaId });
  }
  return api.post('/api/query', { query, schemaId });
};

export const fetchQueryHistory = () => {
  if (useMockApi) {
    console.log('Using mock API for query history');
    // Mock implementation would go here
    return Promise.reject(new Error('Query history not implemented in mock API'));
  }
  return api.get('/api/history');
};

export const importSchema = (file: File) => {
  if (useMockApi) {
    console.log('Using mock API for schema import');
    // Mock implementation would go here
    return Promise.reject(new Error('Schema import not implemented in mock API'));
  }

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('schemaFile', file);

  // Use a custom config to send form data
  return api.post('/api/schemas/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const importSQLSchema = (file: File, name: string, description: string, dialect: string) => {
  if (useMockApi) {
    console.log('Using mock API for SQL schema import');
    // Mock implementation would go here
    return Promise.reject(new Error('SQL schema import not implemented in mock API'));
  }

  // Create a FormData object to send the file and metadata
  const formData = new FormData();
  formData.append('schemaFile', file);
  formData.append('name', name);
  formData.append('description', description);
  formData.append('dialect', dialect);

  // Use a custom config to send form data
  return api.post('/api/schemas/import-sql', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
