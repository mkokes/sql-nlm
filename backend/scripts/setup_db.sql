-- SQL-LLM Database Setup Script

-- Create database
CREATE DATABASE sqlllm;

-- Connect to the database
\c sqlllm;

-- Create schemas table
CREATE TABLE schemas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tables JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create query_history table
CREATE TABLE query_history (
    id SERIAL PRIMARY KEY,
    schema_id INTEGER REFERENCES schemas(id),
    natural_language_query TEXT NOT NULL,
    generated_sql TEXT NOT NULL,
    execution_time INTEGER, -- in milliseconds
    result_count INTEGER,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create example schema
INSERT INTO schemas (name, description, tables) VALUES (
    'E-commerce Database',
    'A sample e-commerce database with products, customers, and orders',
    '[
        {
            "name": "products",
            "description": "Products available for sale",
            "columns": [
                {
                    "name": "id",
                    "type": "INTEGER",
                    "description": "Unique product identifier",
                    "isPrimary": true,
                    "isForeign": false
                },
                {
                    "name": "name",
                    "type": "VARCHAR(255)",
                    "description": "Product name",
                    "isPrimary": false,
                    "isForeign": false
                },
                {
                    "name": "description",
                    "type": "TEXT",
                    "description": "Product description",
                    "isPrimary": false,
                    "isForeign": false
                },
                {
                    "name": "price",
                    "type": "DECIMAL(10,2)",
                    "description": "Product price",
                    "isPrimary": false,
                    "isForeign": false
                },
                {
                    "name": "category_id",
                    "type": "INTEGER",
                    "description": "Category of the product",
                    "isPrimary": false,
                    "isForeign": true,
                    "references": "categories.id"
                },
                {
                    "name": "inventory_count",
                    "type": "INTEGER",
                    "description": "Number of items in stock",
                    "isPrimary": false,
                    "isForeign": false
                },
                {
                    "name": "created_at",
                    "type": "TIMESTAMP",
                    "description": "When the product was added",
                    "isPrimary": false,
                    "isForeign": false
                }
            ]
        },
        {
            "name": "categories",
            "description": "Product categories",
            "columns": [
                {
                    "name": "id",
                    "type": "INTEGER",
                    "description": "Unique category identifier",
                    "isPrimary": true,
                    "isForeign": false
                },
                {
                    "name": "name",
                    "type": "VARCHAR(255)",
                    "description": "Category name",
                    "isPrimary": false,
                    "isForeign": false
                },
                {
                    "name": "description",
                    "type": "TEXT",
                    "description": "Category description",
                    "isPrimary": false,
                    "isForeign": false
                }
            ]
        },
        {
            "name": "customers",
            "description": "Registered customers",
            "columns": [
                {
                    "name": "id",
                    "type": "INTEGER",
                    "description": "Unique customer identifier",
                    "isPrimary": true,
                    "isForeign": false
                },
                {
                    "name": "first_name",
                    "type": "VARCHAR(255)",
                    "description": "Customer first name",
                    "isPrimary": false,
                    "isForeign": false
                },
                {
                    "name": "last_name",
                    "type": "VARCHAR(255)",
                    "description": "Customer last name",
                    "isPrimary": false,
                    "isForeign": false
                },
                {
                    "name": "email",
                    "type": "VARCHAR(255)",
                    "description": "Customer email address",
                    "isPrimary": false,
                    "isForeign": false
                },
                {
                    "name": "created_at",
                    "type": "TIMESTAMP",
                    "description": "When the customer registered",
                    "isPrimary": false,
                    "isForeign": false
                }
            ]
        },
        {
            "name": "orders",
            "description": "Customer orders",
            "columns": [
                {
                    "name": "id",
                    "type": "INTEGER",
                    "description": "Unique order identifier",
                    "isPrimary": true,
                    "isForeign": false
                },
                {
                    "name": "customer_id",
                    "type": "INTEGER",
                    "description": "Customer who placed the order",
                    "isPrimary": false,
                    "isForeign": true,
                    "references": "customers.id"
                },
                {
                    "name": "order_date",
                    "type": "TIMESTAMP",
                    "description": "When the order was placed",
                    "isPrimary": false,
                    "isForeign": false
                },
                {
                    "name": "status",
                    "type": "VARCHAR(50)",
                    "description": "Order status (pending, shipped, delivered, etc.)",
                    "isPrimary": false,
                    "isForeign": false
                },
                {
                    "name": "total_amount",
                    "type": "DECIMAL(10,2)",
                    "description": "Total order amount",
                    "isPrimary": false,
                    "isForeign": false
                }
            ]
        },
        {
            "name": "order_items",
            "description": "Items within an order",
            "columns": [
                {
                    "name": "id",
                    "type": "INTEGER",
                    "description": "Unique order item identifier",
                    "isPrimary": true,
                    "isForeign": false
                },
                {
                    "name": "order_id",
                    "type": "INTEGER",
                    "description": "Order this item belongs to",
                    "isPrimary": false,
                    "isForeign": true,
                    "references": "orders.id"
                },
                {
                    "name": "product_id",
                    "type": "INTEGER",
                    "description": "Product ordered",
                    "isPrimary": false,
                    "isForeign": true,
                    "references": "products.id"
                },
                {
                    "name": "quantity",
                    "type": "INTEGER",
                    "description": "Number of items ordered",
                    "isPrimary": false,
                    "isForeign": false
                },
                {
                    "name": "price",
                    "type": "DECIMAL(10,2)",
                    "description": "Price at time of order",
                    "isPrimary": false,
                    "isForeign": false
                }
            ]
        }
    ]'
);

-- Create indexes
CREATE INDEX idx_schemas_name ON schemas(name);
CREATE INDEX idx_query_history_schema_id ON query_history(schema_id);
CREATE INDEX idx_query_history_created_at ON query_history(created_at);

-- Grant permissions
-- GRANT ALL PRIVILEGES ON DATABASE sqlllm TO your_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_user;
