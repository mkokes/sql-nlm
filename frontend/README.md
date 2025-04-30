# SQL-LLM Frontend

This is the frontend for the SQL-LLM project, a natural language to SQL AI agent.

## Technology Stack

- Next.js 13
- React
- TypeScript
- shadcn UI (built on Tailwind CSS)
- Yarn 3 (package manager)
- Axios for API calls

## Getting Started

### Prerequisites

- Node.js (v18+) (recommended to use nvm for version management)
- Yarn 3

### Installation

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `yarn dev` - Start the development server
- `yarn build` - Build the application for production
- `yarn start` - Start the production server
- `yarn lint` - Run ESLint
- `yarn clean` - Remove build artifacts and node_modules
- `yarn format` - Format code with Prettier
- `yarn setup` - Run the setup script (install, build, and start dev server)

## Project Structure

- `src/app`: Next.js app directory
- `src/components`: React components
  - `src/components/ui`: shadcn UI components
  - `src/components/chat`: Chat-related components
  - `src/components/layout`: Layout components
- `src/lib`: Utility functions
- `public`: Static assets

## Key Features

- Chat interface for natural language queries
- Database schema management
- Query history
- Result display in tables
- Modern UI with shadcn UI components

## Styling

This project uses shadcn UI, which is built on top of Tailwind CSS. The global styles are defined in `src/app/globals.css`.
