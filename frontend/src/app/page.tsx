'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome to SQL-LLM</h2>
      <p className="mb-4">
        SQL-LLM is an AI agent that allows you to query your database using natural language instead of SQL.
        Simply provide your database schema and start asking questions in plain English.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Query Your Database</h3>
          <p className="mb-4">
            Start a conversation with the AI and retrieve data using natural language.
          </p>
          <Link 
            href="/chat" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Open Chat Interface
          </Link>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Manage Database Schemas</h3>
          <p className="mb-4">
            Upload and manage your database schemas to help the AI understand your data.
          </p>
          <Link 
            href="/schemas" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          >
            Manage Schemas
          </Link>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">How It Works</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Upload your database schema</li>
          <li>Ask questions in natural language</li>
          <li>The AI converts your question to SQL</li>
          <li>View the results in a user-friendly format</li>
        </ol>
      </div>
    </div>
  )
}
