import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './textarea';

describe('Textarea component', () => {
  it('renders correctly with default props', () => {
    render(<Textarea />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('flex min-h-[60px] w-full rounded-md border border-input');
  });

  it('applies additional className', () => {
    render(<Textarea className="custom-class" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('custom-class');
    expect(textarea).toHaveClass('flex min-h-[60px] w-full rounded-md border border-input'); // Still has the default classes
  });

  it('handles user input correctly', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Textarea onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Hello, world!');

    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('Hello, world!');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Textarea disabled />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('disabled:cursor-not-allowed disabled:opacity-50');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('passes other props to the textarea element', () => {
    render(
      <Textarea
        placeholder="Enter text here"
        maxLength={100}
        required
        aria-label="Test textarea"
        rows={5}
      />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('placeholder', 'Enter text here');
    expect(textarea).toHaveAttribute('maxLength', '100');
    expect(textarea).toHaveAttribute('required');
    expect(textarea).toHaveAttribute('aria-label', 'Test textarea');
    expect(textarea).toHaveAttribute('rows', '5');
  });
});
