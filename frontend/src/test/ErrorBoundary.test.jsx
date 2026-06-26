import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { describe, it, expect, vi } from 'vitest';

function ProblemComponent() {
  throw new Error('Crashed');
}

describe('ErrorBoundary', () => {
  it('renders child components when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Happy Component</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Happy Component');
  });

  it('renders fallback UI when a child component crashes', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
