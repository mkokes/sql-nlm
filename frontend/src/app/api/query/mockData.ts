// Mock product data
export const mockProducts = [
  { id: 1, name: 'Laptop', price: 1200, category: 'Electronics', inventory_count: 45 },
  { id: 2, name: 'Smartphone', price: 800, category: 'Electronics', inventory_count: 120 },
  { id: 3, name: 'Headphones', price: 150, category: 'Electronics', inventory_count: 78 },
  { id: 4, name: 'T-shirt', price: 25, category: 'Clothing', inventory_count: 200 },
  { id: 5, name: 'Jeans', price: 60, category: 'Clothing', inventory_count: 85 },
  { id: 6, name: 'Sneakers', price: 120, category: 'Footwear', inventory_count: 32 },
  { id: 7, name: 'Coffee Maker', price: 90, category: 'Kitchen', inventory_count: 15 },
  { id: 8, name: 'Blender', price: 70, category: 'Kitchen', inventory_count: 25 },
  { id: 9, name: 'Gaming Console', price: 450, category: 'Electronics', inventory_count: 12 },
  { id: 10, name: 'Desk Chair', price: 180, category: 'Furniture', inventory_count: 8 },
];

// Mock customers data
export const mockCustomers = [
  { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
  { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com' },
  { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob.johnson@example.com' },
  { id: 4, first_name: 'Alice', last_name: 'Williams', email: 'alice.williams@example.com' },
  { id: 5, first_name: 'Charlie', last_name: 'Brown', email: 'charlie.brown@example.com' },
];

// Mock orders data
export const mockOrders = [
  {
    id: 1,
    customer_id: 1,
    total_amount: 1200,
    status: 'delivered',
    order_date: '2023-04-15T10:30:00Z',
  },
  {
    id: 2,
    customer_id: 2,
    total_amount: 85,
    status: 'shipped',
    order_date: '2023-04-18T14:20:00Z',
  },
  {
    id: 3,
    customer_id: 3,
    total_amount: 150,
    status: 'processing',
    order_date: '2023-04-20T09:15:00Z',
  },
  {
    id: 4,
    customer_id: 1,
    total_amount: 270,
    status: 'delivered',
    order_date: '2023-04-22T16:45:00Z',
  },
  {
    id: 5,
    customer_id: 4,
    total_amount: 450,
    status: 'shipped',
    order_date: '2023-04-25T11:30:00Z',
  },
  {
    id: 6,
    customer_id: 5,
    total_amount: 60,
    status: 'processing',
    order_date: '2023-04-28T13:20:00Z',
  },
  {
    id: 7,
    customer_id: 2,
    total_amount: 180,
    status: 'delivered',
    order_date: '2023-05-01T10:10:00Z',
  },
];
