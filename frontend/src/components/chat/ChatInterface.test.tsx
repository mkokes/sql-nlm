import React from 'react'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import ChatInterface from './ChatInterface'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock the useToast hook
const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock the Select component
jest.mock('@/components/ui/select', () => {
  const onValueChangeMock = jest.fn();

  return {
    Select: ({ children, onValueChange }: any) => {
      onValueChangeMock.mockImplementation(onValueChange);
      return (
        <>
          {children}
          <div data-testid="select-item-1" onClick={() => onValueChangeMock(1)}>E-commerce Database</div>
          <div data-testid="select-item-2" onClick={() => onValueChangeMock(2)}>Blog System</div>
        </>
      );
    },
    SelectTrigger: ({ children }: any) => <button data-testid="select-trigger">{children}</button>,
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
    SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
    SelectItem: ({ value, children }: any) => (
      <div
        data-testid={`select-item-${value}`}
        onClick={() => onValueChangeMock(value)}
      >
        {children}
      </div>
    ),
  }
})

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn()

describe('ChatInterface component', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock the axios.get call for schemas
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          ID: 1,
          Name: 'E-commerce Database',
          Description: 'Database schema for an e-commerce application',
        },
        {
          ID: 2,
          Name: 'Blog System',
          Description: 'Database schema for a blog system',
        },
      ],
    })
  })

  it('renders the welcome screen when no messages are present', async () => {
    render(<ChatInterface />)

    // Check if the welcome message is displayed
    const welcomeMessage = screen.getByText(/Welcome to SQL-LLM Chat/i)
    expect(welcomeMessage).toBeInTheDocument()

    // Check if the schema selector is rendered
    const schemaSelector = screen.getByTestId('select-trigger')
    expect(schemaSelector).toBeInTheDocument()

    // Wait for the schemas to be loaded
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/schemas')
    })
  })

  it('disables the input when no schema is selected', () => {
    render(<ChatInterface />)

    // Check if the input is disabled
    const inputField = screen.getByPlaceholderText(/Ask a question about your data/i)
    expect(inputField).toBeDisabled()

    // Check if the send button is disabled
    const sendButton = screen.getByRole('button', { name: /send/i })
    expect(sendButton).toBeDisabled()

    // Check if the warning message is displayed
    const warningMessage = screen.getByText(/Please select a database schema to start chatting/i)
    expect(warningMessage).toBeInTheDocument()
  })

  it('handles API errors when fetching schemas', async () => {
    // Mock the axios.get call to throw an error
    mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch schemas'))

    render(<ChatInterface />)

    // Wait for the error toast to be called
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalled()
    })
  })

  it('enables input when a schema is selected', async () => {
    render(<ChatInterface />)

    // Find the schema item and click it
    const schemaItem = screen.getByTestId('select-item-1')
    fireEvent.click(schemaItem)

    // Check if the input is enabled
    const inputField = screen.getByPlaceholderText(/Ask a question about your data/i)
    expect(inputField).not.toBeDisabled()

    // Check if the send button is enabled
    const sendButton = screen.getByRole('button', { name: /send/i })
    expect(sendButton).not.toBeDisabled()

    // Check that the warning message is no longer displayed
    const warningMessage = screen.queryByText(/Please select a database schema to start chatting/i)
    expect(warningMessage).not.toBeInTheDocument()
  })

  it('displays example queries when a schema is selected', async () => {
    render(<ChatInterface />)

    // Find the schema item and click it
    const schemaItem = screen.getByTestId('select-item-1')
    fireEvent.click(schemaItem)

    // Check if example queries are displayed
    const exampleQuery = screen.getByText(/Show me all products with price greater than \$100/i)
    expect(exampleQuery).toBeInTheDocument()
  })

  it('uses an example query when clicked', async () => {
    render(<ChatInterface />)

    // Find the schema item and click it
    const schemaItem = screen.getByTestId('select-item-1')
    fireEvent.click(schemaItem)

    // Click an example query
    const exampleQuery = screen.getByText(/Show me all products with price greater than \$100/i)
    fireEvent.click(exampleQuery)

    // Check if the input field has the example query text
    const inputField = screen.getByPlaceholderText(/Ask a question about your data/i) as HTMLInputElement
    expect(inputField.value).toBe('Show me all products with price greater than $100')
  })

  it('sends a query and displays the response', async () => {
    // Mock the axios.post call for query submission
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        naturalLanguageQuery: 'Show me all products with price greater than $100',
        generatedSql: 'SELECT * FROM products WHERE price > 100 ORDER BY price DESC',
        results: [
          { id: 1, name: 'Laptop', price: 1200, category: 'Electronics' },
          { id: 9, name: 'Gaming Console', price: 450, category: 'Electronics' }
        ]
      }
    })

    render(<ChatInterface />)

    // Find the schema item and click it
    const schemaItem = screen.getByTestId('select-item-1')
    fireEvent.click(schemaItem)

    // Type a query
    const inputField = screen.getByPlaceholderText(/Ask a question about your data/i)
    fireEvent.change(inputField, { target: { value: 'Show me all products with price greater than $100' } })

    // Submit the query
    const sendButton = screen.getByRole('button', { name: /send/i })
    fireEvent.click(sendButton)

    // Check if the user message is displayed
    await waitFor(() => {
      expect(screen.getByText('Show me all products with price greater than $100')).toBeInTheDocument()
    })

    // Check if the API was called correctly
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/query', {
      query: 'Show me all products with price greater than $100',
      schemaId: 1
    })

    // Check if the assistant response is displayed
    await waitFor(() => {
      expect(screen.getByText('Here are the results for your query:')).toBeInTheDocument()
    })

    // Check if the SQL query is displayed
    await waitFor(() => {
      expect(screen.getByText('SELECT * FROM products WHERE price > 100 ORDER BY price DESC')).toBeInTheDocument()
    })
  })

  it('handles API errors when submitting a query', async () => {
    // Mock the axios.post call to throw an error
    mockedAxios.post.mockRejectedValueOnce(new Error('Failed to process query'))

    render(<ChatInterface />)

    // Find the schema item and click it
    const schemaItem = screen.getByTestId('select-item-1')
    fireEvent.click(schemaItem)

    // Type a query
    const inputField = screen.getByPlaceholderText(/Ask a question about your data/i)
    fireEvent.change(inputField, { target: { value: 'Show me all products' } })

    // Submit the query
    const sendButton = screen.getByRole('button', { name: /send/i })
    fireEvent.click(sendButton)

    // Check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Sorry, there was an error processing your query/i)).toBeInTheDocument()
    })

    // Check if the toast was called
    expect(mockToast).toHaveBeenCalled()
  })
})
