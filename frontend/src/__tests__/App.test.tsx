import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { StatusBadge } from '../components/common/StatusBadge';
import { StatCard } from '../components/common/StatCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LandingPage } from '../pages/auth/LandingPage';
import { Users } from 'lucide-react';

describe('CampusConnect Core Frontend Components', () => {
  it('renders ThemeToggle and switches between light and dark themes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle showLabel={true} />
      </ThemeProvider>
    );

    // Initial state button
    const toggleBtn = screen.getByRole('button', { name: /Switch to (dark|light) mode/i });
    expect(toggleBtn).toBeInTheDocument();

    // Click to toggle
    fireEvent.click(toggleBtn);
    expect(document.documentElement.classList.contains('dark') || document.documentElement.classList.contains('light')).toBe(true);
  });

  it('renders StatusBadge with appropriate text and styling', () => {
    const { rerender } = render(<StatusBadge status="ACTIVE" />);
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();

    rerender(<StatusBadge status="SUSPENDED" />);
    expect(screen.getByText('SUSPENDED')).toBeInTheDocument();

    rerender(<StatusBadge status="PENDING_VERIFICATION" />);
    expect(screen.getByText('PENDING VERIFICATION')).toBeInTheDocument();

    rerender(<StatusBadge status="RESOLVED" />);
    expect(screen.getByText('RESOLVED')).toBeInTheDocument();
  });

  it('renders StatCard correctly with labels and metrics', () => {
    render(
      <StatCard
        title="Active Students"
        value={1250}
        subtitle="+12% from last semester"
        icon={Users}
        color="indigo"
      />
    );
    expect(screen.getByText('Active Students')).toBeInTheDocument();
    expect(screen.getByText('1250')).toBeInTheDocument();
    expect(screen.getByText('+12% from last semester')).toBeInTheDocument();
  });

  it('renders EmptyState with call to action', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No Records Found"
        description="Try tweaking your filter parameters."
        actionText="Create Item"
        onAction={handleAction}
      />
    );

    expect(screen.getByText('No Records Found')).toBeInTheDocument();
    expect(screen.getByText('Try tweaking your filter parameters.')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /Create Item/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders LoadingSpinner with custom size and animated spinner', () => {
    const { container } = render(<LoadingSpinner size="lg" className="custom-loader" />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(container.querySelector('.custom-loader')).toBeInTheDocument();
  });

  it('renders ConfirmDialog and responds to user interaction', () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    const { rerender } = render(
      <ConfirmDialog
        isOpen={true}
        title="Revoke Permission"
        message="Are you sure you want to revoke access?"
        confirmText="Yes, Revoke"
        cancelText="Dismiss"
        variant="danger"
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );

    expect(screen.getByText('Revoke Permission')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to revoke access?')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /Yes, Revoke/i });
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    const cancelBtn = screen.getByRole('button', { name: /Dismiss/i });
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // When closed
    rerender(
      <ConfirmDialog
        isOpen={false}
        title="Revoke Permission"
        message="Are you sure you want to revoke access?"
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );
    expect(screen.queryByText('Revoke Permission')).not.toBeInTheDocument();
  });

  it('renders the official LandingPage with institutional branding and tagline', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <LandingPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText(/CampusConnect/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Silicon University/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/One Campus\. One Community\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Register/i }).length).toBeGreaterThan(0);
  });
});
