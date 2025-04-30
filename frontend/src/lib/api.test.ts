import axios from 'axios';
import {
  fetchSchemas,
  createSchema,
  fetchSchema,
  submitQuery,
  fetchQueryHistory,
} from './api.mock';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchSchemas', () => {
    it('should call the correct endpoint', async () => {
      // Setup
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      // Execute
      await fetchSchemas();

      // Verify
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/schemas');
    });
  });

  describe('createSchema', () => {
    it('should call the correct endpoint with the schema data', async () => {
      // Setup
      const mockSchema = { name: 'Test Schema', description: 'Test Description' };

      // Execute & Verify
      await expect(createSchema(mockSchema)).rejects.toThrow('Not implemented in mock API');
    });
  });

  describe('fetchSchema', () => {
    it('should call the correct endpoint with the schema ID', async () => {
      // Setup
      const schemaId = 1;
      mockedAxios.get.mockRejectedValueOnce(new Error('Not implemented in mock API'));

      // Execute & Verify
      await expect(fetchSchema(schemaId)).rejects.toThrow('Not implemented in mock API');
    });
  });

  describe('submitQuery', () => {
    it('should call the correct endpoint with the query and schema ID', async () => {
      // Setup
      const query = 'Show me all products';
      const schemaId = 1;
      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      // Execute
      await submitQuery(query, schemaId);

      // Verify
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/query', { query, schemaId });
    });
  });

  describe('fetchQueryHistory', () => {
    it('should call the correct endpoint', async () => {
      // Setup
      mockedAxios.get.mockRejectedValueOnce(new Error('Not implemented in mock API'));

      // Execute & Verify
      await expect(fetchQueryHistory()).rejects.toThrow('Not implemented in mock API');
    });
  });
});
