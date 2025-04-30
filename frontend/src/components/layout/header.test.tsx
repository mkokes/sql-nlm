import React from 'react'
import { render, screen } from '@testing-library/react'
import { Header } from './header'

// Mock the usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/'),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(),
  }),
}))

describe('Header component', () => {
  it('renders the logo and navigation links', () => {
    render(<Header />)
    
    // Check if the logo is rendered
    const logo = screen.getByText('SQL-LLM')
    expect(logo).toBeInTheDocument()
    
    // Check if the navigation links are rendered
    const chatLink = screen.getByRole('link', { name: /chat/i })
    const schemasLink = screen.getByRole('link', { name: /schemas/i })
    
    expect(chatLink).toBeInTheDocument()
    expect(chatLink).toHaveAttribute('href', '/chat')
    
    expect(schemasLink).toBeInTheDocument()
    expect(schemasLink).toHaveAttribute('href', '/schemas')
  })

  it('highlights the active link based on the current path', () => {
    // Mock the usePathname hook to return different paths
    const usePathname = require('next/navigation').usePathname
    
    // Test with /chat path
    usePathname.mockReturnValue('/chat')
    const { rerender } = render(<Header />)
    
    let chatLink = screen.getByRole('link', { name: /chat/i })
    let schemasLink = screen.getByRole('link', { name: /schemas/i })
    
    expect(chatLink).toHaveClass('text-foreground')
    expect(schemasLink).toHaveClass('text-muted-foreground')
    
    // Test with /schemas path
    usePathname.mockReturnValue('/schemas')
    rerender(<Header />)
    
    chatLink = screen.getByRole('link', { name: /chat/i })
    schemasLink = screen.getByRole('link', { name: /schemas/i })
    
    expect(chatLink).toHaveClass('text-muted-foreground')
    expect(schemasLink).toHaveClass('text-foreground')
  })
})
