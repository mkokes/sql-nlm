'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [showSetupInfo, setShowSetupInfo] = useState(false);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8 shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">SQL-LLM</h1>
          <p className="text-xl mb-6">
            Query your database with natural language instead of SQL
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/chat"
              className="inline-block bg-white text-blue-700 hover:bg-gray-100 font-medium py-2 px-6 rounded-full shadow-md transition-all"
            >
              Try It Now
            </Link>
            <button
              onClick={() => setShowSetupInfo(!showSetupInfo)}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full shadow-md transition-all"
            >
              {showSetupInfo ? 'Hide Setup Info' : 'Show Setup Info'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Natural Language Queries</h3>
          </div>
          <p className="text-gray-600">
            Ask questions about your data in plain English. No need to remember SQL syntax or table structures.
          </p>
          <Link
            href="/chat"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Try the chat interface →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 0L4 12m5-5l5 5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Schema Management</h3>
          </div>
          <p className="text-gray-600">
            Upload and manage your database schemas to help the AI understand your data structure and relationships.
          </p>
          <Link
            href="/schemas"
            className="inline-block mt-4 text-green-600 hover:text-green-800 font-medium"
          >
            Manage schemas →
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-2xl font-semibold mb-6">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">1</span>
            </div>
            <h4 className="font-medium mb-2">Upload Schema</h4>
            <p className="text-sm text-gray-600">Provide your database structure</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">2</span>
            </div>
            <h4 className="font-medium mb-2">Ask Questions</h4>
            <p className="text-sm text-gray-600">Use natural language to query data</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">3</span>
            </div>
            <h4 className="font-medium mb-2">AI Generates SQL</h4>
            <p className="text-sm text-gray-600">Your question is converted to SQL</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">4</span>
            </div>
            <h4 className="font-medium mb-2">View Results</h4>
            <p className="text-sm text-gray-600">Get answers in a user-friendly format</p>
          </div>
        </div>
      </div>

      {/* Setup Information (Conditional) */}
      {showSetupInfo && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold mb-4">Setup Information</h3>

          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Prerequisites</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Go 1.18+ (for backend)</li>
              <li>Node.js 16+ and npm (for frontend)</li>
              <li>PostgreSQL 12+ (for database)</li>
              <li>OpenAI API key (for LLM integration)</li>
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Installation Steps</h4>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li className="mb-4">
                <span className="font-medium">Install Go</span>
                <div className="ml-6 mt-1 bg-gray-50 p-3 rounded text-sm">
                  <p>Download from <a href="https://golang.org/dl/" target="_blank" className="text-blue-600 hover:underline">golang.org/dl</a></p>
                </div>
              </li>

              <li className="mb-4">
                <span className="font-medium">Install PostgreSQL</span>
                <div className="ml-6 mt-1 bg-gray-50 p-3 rounded text-sm">
                  <p>Download from <a href="https://www.postgresql.org/download/" target="_blank" className="text-blue-600 hover:underline">postgresql.org/download</a></p>
                </div>
              </li>

              <li className="mb-4">
                <span className="font-medium">Set up the database</span>
                <div className="ml-6 mt-1 bg-gray-50 p-3 rounded text-sm">
                  <code className="block text-xs bg-gray-800 text-white p-2 rounded">
                    cd backend/scripts<br />
                    psql -U postgres -f setup_db.sql
                  </code>
                </div>
              </li>

              <li className="mb-4">
                <span className="font-medium">Configure environment variables</span>
                <div className="ml-6 mt-1 bg-gray-50 p-3 rounded text-sm">
                  <p>Edit <code className="bg-gray-200 px-1 rounded">backend/.env</code> with your database credentials and OpenAI API key</p>
                </div>
              </li>

              <li>
                <span className="font-medium">Start the servers</span>
                <div className="ml-6 mt-1 bg-gray-50 p-3 rounded text-sm">
                  <p>Run the start script from the project root:</p>
                  <code className="block text-xs bg-gray-800 text-white p-2 rounded mt-1">
                    # On Windows<br />
                    start.bat<br /><br />
                    # On Linux/macOS<br />
                    ./start.sh
                  </code>
                </div>
              </li>
            </ol>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Need Help?</h4>
            <p className="text-gray-700">
              Check the <a href="https://github.com/yourusername/sql-llm" target="_blank" className="text-blue-600 hover:underline">GitHub repository</a> for more detailed instructions and troubleshooting.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
