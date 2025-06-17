import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header/Header';
import { AuthProvider } from '../context/context';
import { describe, expect, it } from 'vitest';
import { Path } from '../types/paths';

describe('Header component', () => {
  it('renders the logo with correct text and link', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </AuthProvider>
    );
    const logo = screen.getByText(/🌸 Flower Shop/i);
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', Path.MAIN);
  });
});
