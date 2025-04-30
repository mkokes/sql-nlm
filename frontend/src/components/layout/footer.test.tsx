import React from 'react'
import { render, screen } from '@testing-library/react'
import { Footer } from './footer'

describe('Footer component', () => {
  it('renders the copyright text with the current year', () => {
    // Get the current year
    const currentYear = new Date().getFullYear().toString()

    render(<Footer />)

    // Check if the copyright text is rendered with the current year
    const copyrightText = screen.getByText(new RegExp(`© ${currentYear} SQL-LLM\\. All rights reserved\\.`, 'i'))
    expect(copyrightText).toBeInTheDocument()
  })

  it('has the correct styling classes', () => {
    render(<Footer />)

    // Check if the footer has the correct styling classes
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('border-t')
    expect(footer).toHaveClass('bg-muted/40')

    // Check if the container has the correct styling classes
    const container = footer.firstChild
    expect(container).toHaveClass('container')
    expect(container).toHaveClass('flex')
  })
})
