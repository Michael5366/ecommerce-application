import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Category, ProductFilters } from '../../types/productTypes';
import { CategoryList } from './CategoryList';
import { PriceFilter } from './PriceFilter';
import { ColorFilter } from './ColorFilter';
import { OccasionFilter } from './OccasionFilter';
import { FlowerTypeFilter } from './FlowerTypeFilter';
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
  availableOccasions: string[];
  availableFlowerTypes: string[];
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
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
  availableOccasions,
  availableFlowerTypes,
  filters,
  setFilters,
  resetFilters,
}) => {
  const { t } = useTranslation();

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
        <h3 className={styles.sectionTitle}>{t('Filters')}</h3>

        <PriceFilter priceRange={priceRange} handlePriceChange={handlePriceChange} />

        {availableColors.length > 0 && (
          <ColorFilter
            availableColors={availableColors}
            selectedColor={filters.color}
            onSelectColor={(color) => setFilters({ ...filters, color })}
          />
        )}

        {availableOccasions.length > 0 && (
          <OccasionFilter
            availableOccasions={availableOccasions}
            selectedOccasion={filters.occasion}
            onSelectOccasion={(occasion) => setFilters({ ...filters, occasion })}
          />
        )}

        {availableFlowerTypes.length > 0 && (
          <FlowerTypeFilter
            availableFlowerTypes={availableFlowerTypes}
            selectedFlowerType={filters.flowerType}
            onSelectFlowerType={(flowerType) => setFilters({ ...filters, flowerType })}
          />
        )}

        <button onClick={resetFilters} className={styles.resetButton}>
          {t('Reset filters')}
        </button>
      </div>
    </aside>
  );
};
