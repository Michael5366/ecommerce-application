import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar, SidebarProps } from '../components/Catalog/Sidebar';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Sidebar', () => {
  const setSearchInput = vi.fn<(value: string) => void>();
  const handleSearch = vi.fn<() => void>();
  const handleResetSearch = vi.fn<() => void>();
  const setSelectedCategory = vi.fn<(value: string) => void>();
  const setFilters = vi.fn<(filters: SidebarProps['filters']) => void>();
  const resetFilters = vi.fn<() => void>();

  const defaultProps: SidebarProps = {
    searchInput: '',
    setSearchInput,
    handleSearch,
    handleResetSearch,
    isSearching: false,
    categories: [
      {
        id: '1',
        name: { en: 'Roses' },
        slug: { en: 'roses' },
        version: 1,
        parent: undefined,
        ancestors: [],
        orderHint: '',
        createdAt: '',
        lastModifiedAt: '',
      },
    ],
    selectedCategory: '1',
    setSelectedCategory,
    priceRange: [0, 100],
    handlePriceChange: () => () => {},
    availableColors: ['Red', 'White'],
    availableOccasions: ['Birthday'],
    availableFlowerTypes: ['Roses'],
    filters: {
      color: 'Red',
      occasion: 'Birthday',
      flowerType: 'Roses',
    },
    setFilters,
    resetFilters,
  };

  it('renders Sidebar with all filters', () => {
    render(
      <MemoryRouter>
        <Sidebar {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Reset filters')).toBeInTheDocument();

    expect(screen.getAllByText('Roses').length).toBeGreaterThan(0);
  });

  it('calls resetFilters on button click', () => {
    render(
      <MemoryRouter>
        <Sidebar {...defaultProps} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Reset filters'));
    expect(resetFilters).toHaveBeenCalled();
  });

  it('does not render ColorFilter when availableColors is empty', () => {
    render(
      <MemoryRouter>
        <Sidebar {...defaultProps} availableColors={[]} />
      </MemoryRouter>
    );
    expect(screen.queryByText('Color:')).not.toBeInTheDocument();
  });
});
