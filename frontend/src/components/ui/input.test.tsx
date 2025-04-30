import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input component', () => {
  it('renders correctly with default props', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex h-9 w-full rounded-md border border-input');
  });

  it('applies additional className', () => {
    render(<Input className="custom-class" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
    expect(input).toHaveClass('flex h-9 w-full rounded-md border border-input'); // Still has the default classes
  });

  it('accepts different types', () => {
    const { rerender } = render(<Input type="text" />);

    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');

    rerender(<Input type="password" />);
    input = screen.getByDisplayValue(''); // Get by empty display value instead of label
    expect(input).toHaveAttribute('type', 'password');

    rerender(<Input type="email" />);
    input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type="number" />);
    input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('handles user input correctly', async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Hello, world!');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('Hello, world!');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed disabled:opacity-50');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes other props to the input element', () => {
    render(<Input placeholder="Enter text here" maxLength={10} required aria-label="Test input" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter text here');
    expect(input).toHaveAttribute('maxLength', '10');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-label', 'Test input');
  });
});
