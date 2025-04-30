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

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
  jest.clearAllMocks();
});

afterAll(() => {
  process.env = originalEnv;
});

describe('API module', () => {
  describe('API functions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('fetchSchemas should call the correct endpoint', async () => {
      // Setup
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      // Execute
      await fetchSchemas();

      // Verify
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/schemas');
    });

    it('createSchema should reject with an error when using mock API', async () => {
      // Execute & Verify
      await expect(createSchema({ name: 'Test' })).rejects.toThrow('Not implemented in mock API');
    });

    it('fetchSchema should reject with an error when using mock API', async () => {
      // Setup
      const schemaId = 1;

      // Execute & Verify
      await expect(fetchSchema(schemaId)).rejects.toThrow('Not implemented in mock API');
    });

    it('submitQuery should call the correct endpoint with query and schema ID', async () => {
      // Setup
      const query = 'Show me all products';
      const schemaId = 1;
      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      // Execute
      await submitQuery(query, schemaId);

      // Verify
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/query', { query, schemaId });
    });

    it('fetchQueryHistory should reject with an error when using mock API', async () => {
      // Setup
      mockedAxios.get.mockRejectedValueOnce(new Error('Not implemented in mock API'));

      // Execute & Verify
      await expect(fetchQueryHistory()).rejects.toThrow('Not implemented in mock API');
    });
  });
});
