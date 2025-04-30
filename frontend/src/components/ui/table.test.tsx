import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

describe('Table component', () => {
  it('renders a basic table with headers and data', () => {
    render(
      <Table>
        <TableCaption>A list of users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>jane@example.com</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total: 2 users</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    // Check if the caption is rendered
    const caption = screen.getByText('A list of users');
    expect(caption).toBeInTheDocument();

    // Check if the headers are rendered
    const nameHeader = screen.getByText('Name');
    const emailHeader = screen.getByText('Email');
    const roleHeader = screen.getByText('Role');
    expect(nameHeader).toBeInTheDocument();
    expect(emailHeader).toBeInTheDocument();
    expect(roleHeader).toBeInTheDocument();

    // Check if the data cells are rendered
    const johnName = screen.getByText('John Doe');
    const johnEmail = screen.getByText('john@example.com');
    const johnRole = screen.getByText('Admin');
    expect(johnName).toBeInTheDocument();
    expect(johnEmail).toBeInTheDocument();
    expect(johnRole).toBeInTheDocument();

    const janeName = screen.getByText('Jane Smith');
    const janeEmail = screen.getByText('jane@example.com');
    const janeRole = screen.getByText('User');
    expect(janeName).toBeInTheDocument();
    expect(janeEmail).toBeInTheDocument();
    expect(janeRole).toBeInTheDocument();

    // Check if the footer is rendered
    const footer = screen.getByText('Total: 2 users');
    expect(footer).toBeInTheDocument();
  });

  it('renders a table without caption and footer', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    // Check if the headers are rendered
    const nameHeader = screen.getByText('Name');
    const emailHeader = screen.getByText('Email');
    expect(nameHeader).toBeInTheDocument();
    expect(emailHeader).toBeInTheDocument();

    // Check if the data cells are rendered
    const johnName = screen.getByText('John Doe');
    const johnEmail = screen.getByText('john@example.com');
    expect(johnName).toBeInTheDocument();
    expect(johnEmail).toBeInTheDocument();

    // Check that there is no caption or footer
    expect(screen.queryByRole('caption')).not.toBeInTheDocument();
    expect(screen.queryByRole('tfoot')).not.toBeInTheDocument();
  });

  it('applies custom className to table elements', () => {
    render(
      <Table className="custom-table">
        <TableHeader>
          <TableRow className="custom-header-row">
            <TableHead className="custom-head">Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="custom-body-row">
            <TableCell className="custom-cell">Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    // Check if custom classes are applied
    const table = screen.getByRole('table');
    expect(table).toHaveClass('custom-table');

    const headerRow = table.querySelector('thead tr');
    expect(headerRow).toHaveClass('custom-header-row');

    const head = screen.getByText('Header');
    expect(head).toHaveClass('custom-head');

    const bodyRow = table.querySelector('tbody tr');
    expect(bodyRow).toHaveClass('custom-body-row');

    const cell = screen.getByText('Cell');
    expect(cell).toHaveClass('custom-cell');
  });
});
