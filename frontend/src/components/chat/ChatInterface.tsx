'use client'

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, Send, Database, Code } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sql?: string
  results?: any[]
}

type Schema = {
  ID: number
  Name: string
  Description: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [schemas, setSchemas] = useState<Schema[]>([])
  const [selectedSchema, setSelectedSchema] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Fetch schemas on component mount
  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const response = await axios.get('/api/schemas')
        setSchemas(response.data)
        if (response.data.length > 0) {
          setSelectedSchema(response.data[0].ID)
        }
      } catch (error) {
        console.error('Error fetching schemas:', error)
        toast({
          title: "Error fetching schemas",
          description: "Could not load database schemas. Please try again later.",
          variant: "destructive",
        })
      }
    }

    fetchSchemas()
  }, [toast])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || !selectedSchema) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('/api/query', {
        query: input,
        schemaId: selectedSchema
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Here are the results for your query:',
        sql: response.data.generatedSql,
        results: response.data.results
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending query:', error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your query. Please try again.'
      }

      setMessages(prev => [...prev, errorMessage])
      
      toast({
        title: "Error processing query",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Example queries for the selected schema
  const getExampleQueries = () => {
    if (!selectedSchema) return [];

    // E-commerce schema examples
    return [
      "Show me all products with price greater than $100",
      "What are the top 5 most expensive products?",
      "How many orders were placed in the last month?",
      "Which customer has spent the most money?",
      "List all products in the Electronics category"
    ];
  };

  // Function to use an example query
  const useExampleQuery = (query: string) => {
    setInput(query);
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-200px)]">
      {/* Schema selector */}
      <div className="p-4 border-b">
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium">
            Select Database Schema
          </label>
          <Select
            value={selectedSchema?.toString() || ''}
            onValueChange={(value) => setSelectedSchema(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a schema" />
            </SelectTrigger>
            <SelectContent>
              {schemas.map((schema) => (
                <SelectItem key={schema.ID} value={schema.ID.toString()}>
                  {schema.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages or Welcome Screen */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-muted/50 p-6 rounded-lg max-w-2xl">
              <div className="flex justify-center mb-4">
                <MessageSquare className="h-12 w-12 text-primary/60" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Welcome to SQL-LLM Chat</h3>
              <p className="mb-4 text-muted-foreground">
                Ask questions about your data in natural language, and I'll convert them to SQL and return the results.
              </p>

              {selectedSchema ? (
                <>
                  <p className="font-medium text-foreground mt-6 mb-2">Try asking one of these example questions:</p>
                  <div className="space-y-2">
                    {getExampleQueries().map((query, index) => (
                      <Button
                        key={index}
                        onClick={() => useExampleQuery(query)}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-2 px-3"
                      >
                        {query}
                      </Button>
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
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3/4 rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p>{message.content}</p>

                {message.sql && (
                  <div className="mt-3">
                    <div className="flex items-center gap-1 text-sm font-semibold mb-1">
                      <Code className="h-4 w-4" />
                      <span>Generated SQL:</span>
                    </div>
                    <pre className="bg-card text-card-foreground p-3 rounded text-sm mt-1 overflow-x-auto">
                      {message.sql}
                    </pre>
                  </div>
                )}

                {message.results && message.results.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-border border rounded-md">
                      <thead className="bg-muted/50">
                        <tr>
                          {Object.keys(message.results[0]).map((key) => (
                            <th
                              key={key}
                              className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {message.results.map((row, i) => (
                          <tr key={i}>
                            {Object.values(row).map((value: any, j) => (
                              <td
                                key={j}
                                className="px-3 py-2 text-sm whitespace-nowrap"
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
                  <div className="mt-2 text-muted-foreground italic">
                    No results found for this query.
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your data..."
            disabled={loading || !selectedSchema}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={loading || !selectedSchema}
            className="gap-1"
          >
            {loading ? 'Thinking...' : 'Send'}
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!selectedSchema && (
          <p className="mt-2 text-sm text-destructive">
            Please select a database schema to start chatting.
          </p>
        )}
      </form>
    </Card>
  )
}
