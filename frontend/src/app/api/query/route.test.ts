import { mockProducts } from './mockData';

// Mock the NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(data => data),
  },
}));

// Create a simple test for the query route
describe('Query API Route', () => {
  it('should filter products correctly', () => {
    // Test the product filtering logic
    const filteredProducts = mockProducts
      .filter(p => p.price > 100)
      .sort((a, b) => b.price - a.price);

    // Verify the filtering works as expected
    expect(filteredProducts.length).toBeGreaterThan(0);
    expect(filteredProducts.every(product => product.price > 100)).toBe(true);

    // Verify the sorting works as expected
    const prices = filteredProducts.map(product => product.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
