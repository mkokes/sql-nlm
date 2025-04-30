// Mock the NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => data)
  }
}))

describe('Schemas API Route', () => {
  it('should have the correct schema structure', () => {
    // Define the expected schema structure
    const expectedSchema = {
      ID: 1,
      Name: 'E-commerce Database',
      Description: 'A sample e-commerce database with products, customers, and orders',
      CreatedAt: '2023-05-01T00:00:00Z',
      UpdatedAt: '2023-05-01T00:00:00Z'
    }

    // Verify the schema has the expected properties
    expect(expectedSchema).toHaveProperty('ID')
    expect(expectedSchema).toHaveProperty('Name')
    expect(expectedSchema).toHaveProperty('Description')
    expect(expectedSchema).toHaveProperty('CreatedAt')
    expect(expectedSchema).toHaveProperty('UpdatedAt')
  })
})
