import { FC } from 'react';
import { Category } from '../../types/productTypes';
import { CategoryList } from './CategoryList';
import { PriceFilter } from './PriceFilter';
import { ColorFilter } from './ColorFilter';
import { SizeFilter } from './SizeFilter';
import { SearchBar } from './SearchBar';
import styles from './Sidebar.module.css';

interface SidebarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearch: () => void;
  handleResetSearch: () => void;
  isSearching: boolean;
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  priceRange: [number, number];
  handlePriceChange: (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  availableColors: string[];
  availableSizes: string[];
  filters: {
    color: string;
    size: string;
  };
  setFilters: (filters: { color: string; size: string }) => void;
  resetFilters: () => void;
}

export const Sidebar: FC<SidebarProps> = ({
  searchInput,
  setSearchInput,
  handleSearch,
  handleResetSearch,
  isSearching,
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  handlePriceChange,
  availableColors,
  availableSizes,
  filters,
  setFilters,
  resetFilters,
}) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.desktopSearch}>
        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
          handleResetSearch={handleResetSearch}
          isSearching={isSearching}
        />
      </div>

      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>Filters</h3>

        <PriceFilter priceRange={priceRange} handlePriceChange={handlePriceChange} />

        {availableColors.length > 0 && (
          <ColorFilter
            availableColors={availableColors}
            selectedColor={filters.color}
            onSelectColor={(color) => setFilters({ ...filters, color })}
          />
        )}

        {availableSizes.length > 0 && (
          <SizeFilter
            availableSizes={availableSizes}
            selectedSize={filters.size}
            onSelectSize={(size) => setFilters({ ...filters, size })}
          />
        )}

        <button onClick={resetFilters} className={styles.resetButton}>
          Reset filters
        </button>
      </div>
    </aside>
  );
};
