import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Button } from './button';

describe('Dialog component', () => {
  it('renders the trigger element', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <p>Dialog Content</p>
          <DialogFooter>
            <Button>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Check if the trigger button is rendered
    const triggerButton = screen.getByRole('button', { name: /open dialog/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it('renders dialog components with custom classes', () => {
    render(
      <Dialog>
        <DialogTrigger className="custom-trigger">Trigger</DialogTrigger>
        <DialogContent className="custom-content">
          <DialogHeader className="custom-header">
            <DialogTitle className="custom-title">Title</DialogTitle>
            <DialogDescription className="custom-description">Description</DialogDescription>
          </DialogHeader>
          <DialogFooter className="custom-footer">
            <Button>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Check if the trigger has the custom class
    const trigger = screen.getByText('Trigger');
    expect(trigger).toHaveClass('custom-trigger');
  });
});
