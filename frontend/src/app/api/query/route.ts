import { NextResponse } from 'next/server';

// Mock product data
const mockProducts = [
  { id: 1, name: 'Laptop', price: 1200, category: 'Electronics', inventory_count: 45 },
  { id: 2, name: 'Smartphone', price: 800, category: 'Electronics', inventory_count: 120 },
  { id: 3, name: 'Headphones', price: 150, category: 'Electronics', inventory_count: 78 },
  { id: 4, name: 'T-shirt', price: 25, category: 'Clothing', inventory_count: 200 },
  { id: 5, name: 'Jeans', price: 60, category: 'Clothing', inventory_count: 85 },
  { id: 6, name: 'Sneakers', price: 120, category: 'Footwear', inventory_count: 32 },
  { id: 7, name: 'Coffee Maker', price: 90, category: 'Kitchen', inventory_count: 15 },
  { id: 8, name: 'Blender', price: 70, category: 'Kitchen', inventory_count: 25 },
  { id: 9, name: 'Gaming Console', price: 450, category: 'Electronics', inventory_count: 12 },
  { id: 10, name: 'Desk Chair', price: 180, category: 'Furniture', inventory_count: 8 }
];

// Mock customers data
const mockCustomers = [
  { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
  { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com' },
  { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob.johnson@example.com' },
  { id: 4, first_name: 'Alice', last_name: 'Williams', email: 'alice.williams@example.com' },
  { id: 5, first_name: 'Charlie', last_name: 'Brown', email: 'charlie.brown@example.com' }
];

// Mock orders data
const mockOrders = [
  { id: 1, customer_id: 1, total_amount: 1200, status: 'delivered', order_date: '2023-04-15T10:30:00Z' },
  { id: 2, customer_id: 2, total_amount: 85, status: 'shipped', order_date: '2023-04-18T14:20:00Z' },
  { id: 3, customer_id: 3, total_amount: 150, status: 'processing', order_date: '2023-04-20T09:15:00Z' },
  { id: 4, customer_id: 1, total_amount: 270, status: 'delivered', order_date: '2023-04-22T16:45:00Z' },
  { id: 5, customer_id: 4, total_amount: 450, status: 'shipped', order_date: '2023-04-25T11:30:00Z' },
  { id: 6, customer_id: 5, total_amount: 60, status: 'processing', order_date: '2023-04-28T13:20:00Z' },
  { id: 7, customer_id: 2, total_amount: 180, status: 'delivered', order_date: '2023-05-01T10:10:00Z' }
];

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { query, schemaId } = body;
  
  // Simulate a delay to mimic LLM processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a mock SQL query based on the natural language query
  let generatedSql = '';
  let results: any[] = [];
  
  // Simple pattern matching to generate mock responses
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('product') && lowerQuery.includes('price') && lowerQuery.includes('greater')) {
    generatedSql = 'SELECT * FROM products WHERE price > 100 ORDER BY price DESC';
    results = mockProducts.filter(p => p.price > 100).sort((a, b) => b.price - a.price);
  } 
  else if (lowerQuery.includes('top') && lowerQuery.includes('expensive')) {
    const match = lowerQuery.match(/top\s+(\d+)/);
    const limit = match ? parseInt(match[1]) : 5;
    generatedSql = `SELECT * FROM products ORDER BY price DESC LIMIT ${limit}`;
    results = [...mockProducts].sort((a, b) => b.price - a.price).slice(0, limit);
  }
  else if (lowerQuery.includes('order') && lowerQuery.includes('last month')) {
    generatedSql = "SELECT * FROM orders WHERE order_date >= date_trunc('month', current_date - interval '1 month') AND order_date < date_trunc('month', current_date)";
    results = mockOrders.filter(o => new Date(o.order_date) > new Date('2023-04-01') && new Date(o.order_date) < new Date('2023-05-01'));
  }
  else if (lowerQuery.includes('customer') && lowerQuery.includes('spent')) {
    generatedSql = `
      SELECT c.id, c.first_name, c.last_name, SUM(o.total_amount) as total_spent
      FROM customers c
      JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id, c.first_name, c.last_name
      ORDER BY total_spent DESC
      LIMIT 1
    `;
    
    // Calculate total spent per customer
    const customerSpending = mockCustomers.map(customer => {
      const orders = mockOrders.filter(order => order.customer_id === customer.id);
      const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
      return { ...customer, total_spent: totalSpent };
    }).sort((a, b) => b.total_spent - a.total_spent);
    
    results = customerSpending.length > 0 ? [customerSpending[0]] : [];
  }
  else if (lowerQuery.includes('product') && lowerQuery.includes('electronics')) {
    generatedSql = "SELECT * FROM products WHERE category = 'Electronics'";
    results = mockProducts.filter(p => p.category === 'Electronics');
  }
  else {
    // Default response for other queries
    generatedSql = 'SELECT * FROM products LIMIT 5';
    results = mockProducts.slice(0, 5);
  }
  
  return NextResponse.json({
    naturalLanguageQuery: query,
    generatedSql: generatedSql,
    results: results
  });
}
