import { render, screen, fireEvent } from '@testing-library/react';
import ShowMenu from '../components/Header/ShowMenu';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useMediaQuery } from '@mui/material';
import { useAuth } from '../context/context';
import { useNavigate } from 'react-router-dom';

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual<typeof import('@mui/material')>('@mui/material');
  return {
    ...actual,
    useMediaQuery: vi.fn(),
  };
});

vi.mock('../context/context', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('ShowMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders desktop menu when isMobile is false', () => {
    (useMediaQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      token: null,
      logout: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ShowMenu />
      </BrowserRouter>
    );

    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Registration')).toBeInTheDocument();
  });

  it('renders mobile menu when isMobile is true', () => {
    (useMediaQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      token: null,
      logout: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ShowMenu />
      </BrowserRouter>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Registration')).toBeInTheDocument();
  });

  it('shows profile and logout when authorized', () => {
    const logoutMock = vi.fn();
    const navigateMock = vi.fn();

    (useMediaQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      token: 'fake-token',
      logout: logoutMock,
    });
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(navigateMock);

    render(
      <BrowserRouter>
        <ShowMenu />
      </BrowserRouter>
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Logout'));
    expect(logoutMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalled();
  });
});
