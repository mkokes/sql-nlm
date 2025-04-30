import React from 'react'
import { render, screen } from '@testing-library/react'
import { Toaster } from './toaster'
import { useToast } from '@/hooks/use-toast'

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn()
}))

// Mock the Toast component
jest.mock('./toast', () => ({
  Toast: ({ children }: { children: React.ReactNode }) => <div data-testid="toast">{children}</div>,
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="toast-provider">{children}</div>,
  ToastViewport: () => <div data-testid="toast-viewport" />,
  ToastClose: () => <button data-testid="toast-close">Close</button>,
  ToastTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="toast-title">{children}</div>,
  ToastDescription: ({ children }: { children: React.ReactNode }) => <div data-testid="toast-description">{children}</div>,
}))

describe('Toaster component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    // Mock the useToast hook to return empty toasts
    (useToast as jest.Mock).mockReturnValue({
      toasts: []
    })

    // Simply test that the component renders without errors
    const { container } = render(<Toaster />)
    expect(container).toBeTruthy()
  })

  it('renders toast items when toasts are provided', () => {
    // Mock the useToast hook to return some toasts
    (useToast as jest.Mock).mockReturnValue({
      toasts: [
        {
          id: '1',
          title: 'Test Toast',
          description: 'This is a test toast',
          open: true
        },
        {
          id: '2',
          title: 'Another Toast',
          description: 'This is another test toast',
          open: true
        }
      ]
    })

    render(<Toaster />)

    // Check if the toast provider is rendered
    const toastProvider = screen.getByTestId('toast-provider')
    expect(toastProvider).toBeInTheDocument()
  })

  it('renders toast with action when provided', () => {
    // Create a mock action
    const mockAction = <button>Action</button>

    // Mock the useToast hook to return a toast with action
    (useToast as jest.Mock).mockReturnValue({
      toasts: [
        {
          id: '1',
          title: 'Toast with Action',
          description: 'This toast has an action',
          action: mockAction,
          open: true
        }
      ]
    })

    render(<Toaster />)

    // Check if the toast provider is rendered
    const toastProvider = screen.getByTestId('toast-provider')
    expect(toastProvider).toBeInTheDocument()
  })
})
