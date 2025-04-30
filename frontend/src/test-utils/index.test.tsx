import React from 'react';
import { render as customRender } from './index';

describe('Custom render function', () => {
  it('renders a component correctly', () => {
    const TestComponent = () => <div data-testid="test-component">Test Component</div>;

    const { getByTestId } = customRender(<TestComponent />);

    const component = getByTestId('test-component');
    expect(component).toBeInTheDocument();
    expect(component.textContent).toBe('Test Component');
  });

  it('passes additional options to the render function', () => {
    const TestComponent = () => <div data-testid="test-component">Test Component</div>;

    // Create a container element
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render with the container option
    const { getByTestId } = customRender(<TestComponent />, { container });

    // Check if the component was rendered in the container
    const component = getByTestId('test-component');
    expect(component).toBeInTheDocument();
    expect(container.contains(component)).toBe(true);

    // Clean up
    document.body.removeChild(container);
  });
});
