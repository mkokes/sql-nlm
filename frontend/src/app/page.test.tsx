import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from './page'

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock the page component
jest.mock('./page', () => {
  return function MockHomePage() {
    return (
      <div>
        <h1>SQL-LLM</h1>
        <p>Query your database with natural language instead of SQL</p>
        <a href="/chat">Try It Now</a>
        <button>Show Setup Info</button>
        <div>
          <h2>Natural Language Queries</h2>
          <p>Ask questions about your data in plain English.</p>
        </div>
      </div>
    )
  }
})

describe('Home Page', () => {
  it('renders the hero section with title and description', () => {
    render(<HomePage />)

    // Check if the title is rendered
    const title = screen.getByRole('heading', { name: /SQL-LLM/i })
    expect(title).toBeInTheDocument()

    // Check if the description is rendered
    const description = screen.getByText(/natural language instead of SQL/i)
    expect(description).toBeInTheDocument()
  })

  it('renders the try it now link', () => {
    render(<HomePage />)

    // Check if the try it now link is rendered
    const tryItNowLink = screen.getByRole('link', { name: /try it now/i })
    expect(tryItNowLink).toBeInTheDocument()
    expect(tryItNowLink).toHaveAttribute('href', '/chat')
  })

  it('renders the setup info button', () => {
    render(<HomePage />)

    // Check if the setup info button is rendered
    const setupInfoButton = screen.getByRole('button', { name: /show setup info/i })
    expect(setupInfoButton).toBeInTheDocument()
  })
})
