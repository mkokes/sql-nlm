# SQL-LLM Frontend

This is the frontend for the SQL-LLM project, a natural language to SQL AI agent.

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios for API calls

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Next.js app directory
- `src/components`: React components
- `src/lib`: Utility functions
- `public`: Static assets

## Key Features

- Chat interface for natural language queries
- Database schema visualization
- Query history
- Result display in tables and charts
