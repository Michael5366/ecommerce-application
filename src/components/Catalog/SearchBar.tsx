import { FC, useRef } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearch: () => void;
  handleResetSearch: () => void;
  isSearching: boolean;
  className?: string;
}

export const SearchBar: FC<SearchBarProps> = ({
  searchInput,
  setSearchInput,
  handleSearch,
  handleResetSearch,
  isSearching,
  className = '',
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <div className={styles.searchInputWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={styles.searchInput}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {searchInput && (
          <button
            className={styles.clearSearchButton}
            onClick={() => {
              setSearchInput('');
              handleResetSearch();
              searchInputRef.current?.focus();
            }}
          >
            ×
          </button>
        )}
      </div>
      <button onClick={handleSearch} disabled={isSearching} className={styles.searchButton}>
        {isSearching ? <span className={styles.spinner}></span> : 'Search'}
      </button>
    </div>
  );
};
