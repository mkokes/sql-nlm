'use client';

import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chat with Your Database</h1>
        <p className="text-muted-foreground mt-2">
          Ask questions in natural language and get answers from your database.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
