'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  results?: any[];
};

type Schema = {
  ID: number;
  Name: string;
  Description: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch schemas on component mount
  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const response = await axios.get('/api/schemas');
        setSchemas(response.data);
        if (response.data.length > 0) {
          setSelectedSchema(response.data[0].ID);
        }
      } catch (error) {
        console.error('Error fetching schemas:', error);
      }
    };

    fetchSchemas();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !selectedSchema) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/query', {
        query: input,
        schemaId: selectedSchema,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Here are the results for your query:',
        sql: response.data.generatedSql,
        results: response.data.results,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending query:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your query. Please try again.',
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Example queries for the selected schema
  const getExampleQueries = () => {
    if (!selectedSchema) return [];

    // E-commerce schema examples
    return [
      'Show me all products with price greater than $100',
      'What are the top 5 most expensive products?',
      'How many orders were placed in the last month?',
      'Which customer has spent the most money?',
      'List all products in the Electronics category',
    ];
  };

  // Function to use an example query
  const useExampleQuery = (query: string) => {
    setInput(query);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white shadow rounded-lg">
      {/* Schema selector */}
      <div className="p-4 border-b">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Database Schema
        </label>
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={selectedSchema || ''}
          onChange={e => setSelectedSchema(Number(e.target.value))}
        >
          <option value="">Select a schema</option>
          {schemas.map(schema => (
            <option key={schema.ID} value={schema.ID}>
              {schema.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Messages or Welcome Screen */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm max-w-2xl">
              <h3 className="text-xl font-semibold mb-4">Welcome to SQL-LLM Chat</h3>
              <p className="mb-4 text-gray-600">
                Ask questions about your data in natural language, and I'll convert them to SQL and
                return the results.
              </p>

              {selectedSchema ? (
                <>
                  <p className="font-medium text-gray-700 mt-6 mb-2">
                    Try asking one of these example questions:
                  </p>
                  <div className="space-y-2">
                    {getExampleQueries().map((query, index) => (
                      <button
                        key={index}
                        onClick={() => useExampleQuery(query)}
                        className="block w-full text-left p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded text-sm text-gray-700"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-amber-600 font-medium mt-4">
                  Please select a database schema to get started.
                </p>
              )}
            </div>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3/4 rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p>{message.content}</p>

                {message.sql && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Generated SQL:</p>
                    <pre className="bg-gray-800 text-white p-2 rounded text-sm mt-1 overflow-x-auto">
                      {message.sql}
                    </pre>
                  </div>
                )}

                {message.results && message.results.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300 border">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(message.results[0]).map(key => (
                            <th
                              key={key}
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-300">
                        {message.results.map((row, i) => (
                          <tr key={i}>
                            {Object.values(row).map((value: any, j) => (
                              <td
                                key={j}
                                className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap"
                              >
                                {value === null ? 'NULL' : String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {message.results && message.results.length === 0 && (
                  <div className="mt-2 text-gray-500 italic">No results found for this query.</div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question about your data..."
            className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading || !selectedSchema}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-r-md"
            disabled={loading || !selectedSchema}
          >
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </div>
        {!selectedSchema && (
          <p className="mt-2 text-sm text-red-500">
            Please select a database schema to start chatting.
          </p>
        )}
      </form>
    </div>
  );
}
