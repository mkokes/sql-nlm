import React from 'react';
import { render, screen } from '@testing-library/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

describe('Tabs component', () => {
  it('renders tabs with content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    );

    // Check if both tab triggers are rendered
    const tab1Trigger = screen.getByRole('tab', { name: /tab 1/i });
    const tab2Trigger = screen.getByRole('tab', { name: /tab 2/i });
    expect(tab1Trigger).toBeInTheDocument();
    expect(tab2Trigger).toBeInTheDocument();

    // Check if the default tab content is rendered
    const tab1Content = screen.getByText('Tab 1 Content');
    expect(tab1Content).toBeInTheDocument();

    // Check if the default tab is selected
    expect(tab1Trigger).toHaveAttribute('data-state', 'active');
    expect(tab2Trigger).toHaveAttribute('data-state', 'inactive');
  });

  it('applies custom className to tabs elements', () => {
    render(
      <Tabs defaultValue="tab1" className="custom-tabs">
        <TabsList className="custom-tabs-list">
          <TabsTrigger value="tab1" className="custom-trigger">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-tabs">
          Tab 1 Content
        </TabsContent>
      </Tabs>
    );

    // Check if custom classes are applied
    const tabs = screen.getByRole('tablist').parentElement;
    expect(tabs).toHaveClass('custom-tabs');

    const tabsList = screen.getByRole('tablist');
    expect(tabsList).toHaveClass('custom-tabs-list');

    const trigger = screen.getByRole('tab', { name: /tab 1/i });
    expect(trigger).toHaveClass('custom-trigger');
  });

  it('renders disabled tabs correctly', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>
            Tab 2
          </TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
        <TabsContent value="tab3">Tab 3 Content</TabsContent>
      </Tabs>
    );

    // Get the tab triggers
    const tab1Trigger = screen.getByRole('tab', { name: /tab 1/i });
    const tab2Trigger = screen.getByRole('tab', { name: /tab 2/i });
    const tab3Trigger = screen.getByRole('tab', { name: /tab 3/i });

    // Check if tab 2 is disabled
    expect(tab2Trigger).toBeDisabled();

    // Tab 1 should be active
    expect(tab1Trigger).toHaveAttribute('data-state', 'active');
    expect(tab2Trigger).toHaveAttribute('data-state', 'inactive');
    expect(tab3Trigger).toHaveAttribute('data-state', 'inactive');
  });
});
