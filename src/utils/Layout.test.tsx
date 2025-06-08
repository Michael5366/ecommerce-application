import React, { ReactElement } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from '../components/Layout/Layout';
import { AuthProvider } from '../context/context';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;

  return {
    ...actual,
    useNavigation: vi.fn(),
    Outlet: (): ReactElement => <div data-testid="outlet" />,
    Link: (props: React.ComponentProps<'a'>): ReactElement => <a {...props} />,
  };
});

import { useNavigation } from 'react-router-dom';

describe('Layout component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Header, Footer and Outlet', () => {
    (useNavigation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ state: 'idle' });

    render(
      <AuthProvider>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText(/Flower Shop/i)).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();

    // Ищем часть текста из футера
    expect(screen.getByText(/educational project/i)).toBeInTheDocument();
  });

  it('shows LoadingIndicator when navigation.state is loading', () => {
    (useNavigation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ state: 'loading' });

    render(
      <AuthProvider>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});
