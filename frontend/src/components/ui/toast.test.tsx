import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';

describe('Toast component', () => {
  it('renders toast with title, description, and action', () => {
    const onActionClick = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <ToastProvider>
        <Toast open={true} onOpenChange={onOpenChange}>
          <ToastTitle>Toast Title</ToastTitle>
          <ToastDescription>Toast Description</ToastDescription>
          <ToastAction altText="Action" onClick={onActionClick}>
            Action
          </ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    // Check if the toast elements are rendered
    const title = screen.getByText('Toast Title');
    const description = screen.getByText('Toast Description');
    const action = screen.getByText('Action');

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(action).toBeInTheDocument();
  });

  it('renders toast with different variants', () => {
    render(
      <ToastProvider>
        <Toast variant="destructive" open={true}>
          <ToastTitle>Destructive Toast</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    // Check if the toast is rendered with the destructive class
    const toast = screen.getByText('Destructive Toast').closest('li');
    expect(toast).toHaveClass('destructive');
  });

  it('applies custom className to toast elements', () => {
    render(
      <ToastProvider>
        <Toast className="custom-toast" open={true}>
          <ToastTitle className="custom-title">Title</ToastTitle>
          <ToastDescription className="custom-description">Description</ToastDescription>
          <ToastAction className="custom-action" altText="Action">
            Action
          </ToastAction>
        </Toast>
        <ToastViewport className="custom-viewport" />
      </ToastProvider>
    );

    // Check if custom classes are applied
    const title = screen.getByText('Title');
    expect(title).toHaveClass('custom-title');

    const description = screen.getByText('Description');
    expect(description).toHaveClass('custom-description');

    const action = screen.getByText('Action');
    expect(action).toHaveClass('custom-action');
  });
});
