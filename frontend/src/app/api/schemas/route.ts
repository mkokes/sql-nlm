import { NextResponse } from 'next/server';

// Mock schema data
const mockSchemas = [
  {
    ID: 1,
    name: 'E-commerce Database',
    description: 'A sample e-commerce database with products, customers, and orders',
    CreatedAt: '2023-05-01T00:00:00Z',
    UpdatedAt: '2023-05-01T00:00:00Z',
  },
];

export async function GET() {
  // Simulate a delay to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(mockSchemas);
}
