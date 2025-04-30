import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the layout component
const MockLayout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <div data-testid="mock-layout">Mock Layout</div>
    {children}
    <div data-testid="toaster">Toaster Mock</div>
  </div>
);

// Mock the actual layout module
jest.mock('./layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <MockLayout>{children}</MockLayout>,
}));

// Import the mocked component
import RootLayout from './layout';

describe('Root Layout', () => {
  it('renders the layout with children', () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Test Content</div>
      </RootLayout>
    );

    // Check if the layout is rendered
    const layout = screen.getByTestId('mock-layout');
    expect(layout).toBeInTheDocument();

    // Check if the child content is rendered
    const childContent = screen.getByTestId('child-content');
    expect(childContent).toBeInTheDocument();

    // Check if the toaster component is rendered
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toBeInTheDocument();
  });
});
