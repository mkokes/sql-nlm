import React from 'react'
import { render, screen } from '@testing-library/react'
import ChatPage from './page'

// Mock the ChatInterface component
jest.mock('@/components/chat/ChatInterface', () => {
  return function MockChatInterface() {
    return <div data-testid="chat-interface">Chat Interface Mock</div>
  }
})

describe('Chat Page', () => {
  it('renders the page title and description', () => {
    render(<ChatPage />)
    
    // Check if the title is rendered
    const title = screen.getByRole('heading', { name: /Chat with Your Database/i })
    expect(title).toBeInTheDocument()
    
    // Check if the description is rendered
    const description = screen.getByText(/Ask questions in natural language and get answers from your database/i)
    expect(description).toBeInTheDocument()
  })
  
  it('renders the ChatInterface component', () => {
    render(<ChatPage />)
    
    // Check if the ChatInterface component is rendered
    const chatInterface = screen.getByTestId('chat-interface')
    expect(chatInterface).toBeInTheDocument()
  })
})
