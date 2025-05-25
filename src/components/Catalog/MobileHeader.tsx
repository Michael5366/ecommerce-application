import { FC } from 'react';
import { SearchBar } from './SearchBar';
import styles from './MobileHeader.module.css';

interface MobileHeaderProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
  sortOption: string;
  setSortOption: (value: string) => void;
  setIsCategoriesModalOpen: (value: boolean) => void;
  setIsFiltersModalOpen: (value: boolean) => void;
}

export const MobileHeader: FC<MobileHeaderProps> = ({
  searchInput,
  setSearchInput,
  handleSearch,
  isSearching,
  sortOption,
  setSortOption,
  setIsCategoriesModalOpen,
  setIsFiltersModalOpen,
}) => {
  return (
    <div className={styles.mobileHeader}>
      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        isSearching={isSearching}
      />

      <div className={styles.mobileToolbar}>
        <button onClick={() => setIsCategoriesModalOpen(true)} className={styles.filterButton}>
          <span className={styles.filterIcon}>📁</span> Categories
        </button>
        <button onClick={() => setIsFiltersModalOpen(true)} className={styles.filterButton}>
          <span className={styles.filterIcon}>☰</span> Filters
        </button>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={styles.sortSelectMobile}
        >
          <option value="name asc">A-Z</option>
          <option value="name desc">Z-А</option>
          <option value="price asc">Price ↑</option>
          <option value="price desc">Price ↓</option>
        </select>
      </div>
    </div>
  );
};
