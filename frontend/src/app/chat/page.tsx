'use client'

import ChatInterface from '@/components/ChatInterface'

export default function ChatPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Chat with Your Database</h2>
      <p className="text-gray-600">
        Ask questions in natural language and get answers from your database.
      </p>
      <ChatInterface />
    </div>
  )
}
