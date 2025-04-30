# SQL-NLM API Documentation

This document provides detailed information about the SQL-NLM backend API endpoints, request/response formats, and examples.

## Base URL

```
http://localhost:8080
```

## Authentication

Currently, the API does not require authentication.

## Endpoints

### Schemas

#### Get All Schemas

Retrieves all database schemas.

- **URL**: `/api/schemas`
- **Method**: `GET`
- **Response**: 
  - **Code**: 200 OK
  - **Content**: Array of schema objects

Example Response:
```json
[
  {
    "ID": 1,
    "name": "E-commerce Database",
    "description": "A sample e-commerce database with products, customers, and orders",
    "tables": "[{\"name\":\"products\",\"description\":\"Products available for sale\",\"columns\":[...]}]",
    "created_at": "2023-05-01T00:00:00Z",
    "updated_at": "2023-05-01T00:00:00Z"
  }
]
```

#### Get Schema by ID

Retrieves a specific schema by its ID.

- **URL**: `/api/schemas/:id`
- **Method**: `GET`
- **URL Parameters**: 
  - `id`: The ID of the schema to retrieve
- **Response**: 
  - **Code**: 200 OK
  - **Content**: Schema object

Example Response:
```json
{
  "ID": 1,
  "name": "E-commerce Database",
  "description": "A sample e-commerce database with products, customers, and orders",
  "tables": "[{\"name\":\"products\",\"description\":\"Products available for sale\",\"columns\":[...]}]",
  "created_at": "2023-05-01T00:00:00Z",
  "updated_at": "2023-05-01T00:00:00Z"
}
```

#### Create Schema

Creates a new database schema.

- **URL**: `/api/schemas`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Request Body**: Schema object
- **Response**: 
  - **Code**: 201 Created
  - **Content**: Created schema object

Example Request:
```json
{
  "name": "E-commerce Database",
  "description": "A sample e-commerce database with products, customers, and orders",
  "tables": [
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
        }
      ]
    }
  ]
}
```

#### Import Schema from JSON

Imports a schema from a JSON file.

- **URL**: `/api/schemas/import`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Form Parameters**:
  - `schemaFile`: JSON file containing the schema definition
- **Response**: 
  - **Code**: 201 Created
  - **Content**: Created schema object

The JSON file should follow the format shown in the [sample schema file](../docs/sample_schema.json).

#### Import Schema from SQL

Imports a schema from SQL DDL statements.

- **URL**: `/api/schemas/import-sql`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Form Parameters**:
  - `schemaFile`: SQL file containing CREATE TABLE statements
  - `name`: Name for the schema
  - `description`: Description for the schema (optional)
  - `dialect`: SQL dialect used in the file (postgresql, mysql, or sqlite)
- **Response**: 
  - **Code**: 201 Created
  - **Content**: Created schema object

The SQL file should contain valid CREATE TABLE statements for the specified dialect. See the [sample SQL files](../docs/samples/) for examples.

### Queries

#### Submit Query

Submits a natural language query and returns the generated SQL and results.

- **URL**: `/api/query`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Request Body**:
  - `query`: Natural language query
  - `schemaId`: ID of the schema to query against
- **Response**: 
  - **Code**: 200 OK
  - **Content**: Query result object

Example Request:
```json
{
  "query": "Show me all products with a price greater than $100",
  "schemaId": 1
}
```

Example Response:
```json
{
  "natural_language_query": "Show me all products with a price greater than $100",
  "generated_sql": "SELECT * FROM products WHERE price > 100",
  "execution_time": 15,
  "result_count": 5,
  "results": [
    {
      "id": 1,
      "name": "Premium Widget",
      "price": 149.99
    },
    {
      "id": 3,
      "name": "Deluxe Gadget",
      "price": 199.99
    }
  ]
}
```

### History

#### Get Query History

Retrieves the history of executed queries.

- **URL**: `/api/history`
- **Method**: `GET`
- **Response**: 
  - **Code**: 200 OK
  - **Content**: Array of query history objects

Example Response:
```json
[
  {
    "id": 1,
    "schema_id": 1,
    "natural_language_query": "Show me all products with a price greater than $100",
    "generated_sql": "SELECT * FROM products WHERE price > 100",
    "execution_time": 15,
    "result_count": 5,
    "error": null,
    "created_at": "2023-05-01T12:34:56Z"
  }
]
```

## Data Models

### Schema

| Field | Type | Description |
|-------|------|-------------|
| ID | integer | Unique identifier for the schema |
| name | string | Name of the schema |
| description | string | Description of the schema |
| tables | string (JSON) | JSON string containing table definitions |
| created_at | timestamp | When the schema was created |
| updated_at | timestamp | When the schema was last updated |

### Table

| Field | Type | Description |
|-------|------|-------------|
| name | string | Name of the table |
| description | string | Description of the table |
| columns | array | Array of column objects |

### Column

| Field | Type | Description |
|-------|------|-------------|
| name | string | Name of the column |
| type | string | Data type of the column |
| description | string | Description of the column |
| isPrimary | boolean | Whether this column is a primary key |
| isForeign | boolean | Whether this column is a foreign key |
| references | string | Reference to another table.column (only if isForeign is true) |

### Query History

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique identifier for the query history entry |
| schema_id | integer | ID of the schema used for the query |
| natural_language_query | string | The original natural language query |
| generated_sql | string | The SQL query generated from the natural language |
| execution_time | integer | Time taken to execute the query (in milliseconds) |
| result_count | integer | Number of results returned |
| error | string | Error message (if any) |
| created_at | timestamp | When the query was executed |

## Error Handling

The API returns appropriate HTTP status codes and error messages in the following format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common error codes:
- `400 Bad Request`: Invalid input or parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Examples

### Creating a Schema

```bash
curl -X POST http://localhost:8080/api/schemas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-commerce Database",
    "description": "A sample e-commerce database",
    "tables": [
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
          }
        ]
      }
    ]
  }'
```

### Submitting a Query

```bash
curl -X POST http://localhost:8080/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Show me all products with a price greater than $100",
    "schemaId": 1
  }'
```
