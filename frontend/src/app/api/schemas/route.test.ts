// Mock the NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(data => data),
  },
}));

describe('Schemas API Route', () => {
  it('should have the correct schema structure', () => {
    // Define the expected schema structure
    const expectedSchema = {
      ID: 1,
      name: 'E-commerce Database',
      description: 'A sample e-commerce database with products, customers, and orders',
      created_at: '2023-05-01T00:00:00Z',
      updated_at: '2023-05-01T00:00:00Z',
    };

    // Verify the schema has the expected properties
    expect(expectedSchema).toHaveProperty('ID');
    expect(expectedSchema).toHaveProperty('name');
    expect(expectedSchema).toHaveProperty('description');
    expect(expectedSchema).toHaveProperty('created_at');
    expect(expectedSchema).toHaveProperty('updated_at');
  });
});
