'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Database, ArrowRight, FileText, Code, Table } from 'lucide-react'

export default function Home() {
  const [showSetupInfo, setShowSetupInfo] = useState(false);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-12 text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">SQL-LLM</h1>
            <p className="text-xl mb-8 opacity-90">
              Query your database with natural language instead of SQL
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/chat">
                  Try It Now
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-primary/20 hover:bg-primary/30 border-primary-foreground/20"
                onClick={() => setShowSetupInfo(!showSetupInfo)}
              >
                {showSetupInfo ? 'Hide Setup Info' : 'Show Setup Info'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Natural Language Queries</CardTitle>
            </div>
            <CardDescription>
              Ask questions about your data in plain English. No need to remember SQL syntax or table structures.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-2">
            <Button asChild variant="link" className="px-0">
              <Link href="/chat" className="flex items-center gap-1">
                Try the chat interface <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Schema Management</CardTitle>
            </div>
            <CardDescription>
              Upload and manage your database schemas to help the AI understand your data structure and relationships.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-2">
            <Button asChild variant="link" className="px-0">
              <Link href="/schemas" className="flex items-center gap-1">
                Manage schemas <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h4 className="font-medium mb-2">Upload Schema</h4>
              <p className="text-sm text-muted-foreground">Provide your database structure</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h4 className="font-medium mb-2">Ask Questions</h4>
              <p className="text-sm text-muted-foreground">Use natural language to query data</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h4 className="font-medium mb-2">AI Generates SQL</h4>
              <p className="text-sm text-muted-foreground">Your question is converted to SQL</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">4</span>
              </div>
              <h4 className="font-medium mb-2">View Results</h4>
              <p className="text-sm text-muted-foreground">Get answers in a user-friendly format</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Information (Conditional) */}
      {showSetupInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Setup Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-3">Prerequisites</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Go 1.18+ (for backend)</li>
                <li>Node.js 16+ and npm (for frontend)</li>
                <li>PostgreSQL 12+ (for database)</li>
                <li>OpenAI API key (for LLM integration)</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-3">Installation Steps</h4>
              <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Install Go</span>
                  <div className="ml-6 mt-1 bg-muted p-3 rounded-md text-sm">
                    <p>Download from <a href="https://golang.org/dl/" target="_blank" className="text-primary hover:underline">golang.org/dl</a></p>
                  </div>
                </li>

                <li>
                  <span className="font-medium text-foreground">Install PostgreSQL</span>
                  <div className="ml-6 mt-1 bg-muted p-3 rounded-md text-sm">
                    <p>Download from <a href="https://www.postgresql.org/download/" target="_blank" className="text-primary hover:underline">postgresql.org/download</a></p>
                  </div>
                </li>

                <li>
                  <span className="font-medium text-foreground">Set up the database</span>
                  <div className="ml-6 mt-1 bg-muted p-3 rounded-md text-sm">
                    <pre className="bg-card text-card-foreground p-2 rounded-md text-xs overflow-x-auto">
                      cd backend/scripts<br />
                      psql -U postgres -f setup_db.sql
                    </pre>
                  </div>
                </li>

                <li>
                  <span className="font-medium text-foreground">Configure environment variables</span>
                  <div className="ml-6 mt-1 bg-muted p-3 rounded-md text-sm">
                    <p>Edit <code className="bg-card px-1 rounded-sm">backend/.env</code> with your database credentials and OpenAI API key</p>
                  </div>
                </li>

                <li>
                  <span className="font-medium text-foreground">Start the servers</span>
                  <div className="ml-6 mt-1 bg-muted p-3 rounded-md text-sm">
                    <p>Run the start script from the project root:</p>
                    <pre className="bg-card text-card-foreground p-2 rounded-md text-xs overflow-x-auto mt-1">
                      # On Windows<br />
                      start.bat<br /><br />
                      # On Linux/macOS<br />
                      ./start.sh
                    </pre>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">Need Help?</h4>
              <p className="text-muted-foreground">
                Check the <a href="https://github.com/mkokes/sql-nlm" target="_blank" className="text-primary hover:underline">GitHub repository</a> for more detailed instructions and troubleshooting.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
