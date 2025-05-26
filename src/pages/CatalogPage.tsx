import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from './../services/Catalog/catalogAPI';
import { Product, Category } from './../types/productTypes';
import { ProductGrid } from './../components/Catalog/ProductGrid';
import { Sidebar } from './../components/Catalog/Sidebar';
import { MobileHeader } from './../components/Catalog/MobileHeader';
import { FiltersModal } from './../components/Catalog/FiltersModal';
import { CategoriesModal } from './../components/Catalog/CategoriesModal';
import styles from './CatalogPage.module.css';
import { Pagination } from '../components/Catalog/Pagination';
import { Breadcrumbs } from '../components/Catalog/Breadcrumbs';

const CatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('name asc');
  const [filters, setFilters] = useState<{
    color: string;
    size: string;
  }>({
    color: '',
    size: '',
  });
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState<boolean>(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const navigate = useNavigate();
  const { makeApiRequest } = useApi();

  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      const data = await makeApiRequest<{ results: Category[] }>('categories', {
        limit: '100',
        expand: 'parent',
      });

      if (!Array.isArray(data.results)) {
        throw new Error('Incorrect category data format');
      }

      setCategories(data.results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading categories';
      setError(errorMessage);
    }
  }, [makeApiRequest]);

  const fetchProducts = useCallback(async (): Promise<void> => {
    setLoading(true);
    setIsSearching(true);
    try {
      const params: Record<string, string> = {
        limit: '100',
        expand: 'categories',
      };

      if (selectedCategory) {
        params['where'] = `masterData(current(categories(id="${selectedCategory}")))`;
      }

      const data = await makeApiRequest<{ results: Product[] }>('products', params);

      if (!Array.isArray(data.results)) {
        throw new Error('Incorrect product data format');
      }

      let results = data.results || [];

      if (appliedSearch) {
        const query = appliedSearch.toLowerCase();
        results = results.filter((product) => {
          const name = product.masterData?.current?.name?.en?.toLowerCase() || '';
          const description = product.masterData?.current?.description?.en?.toLowerCase() || '';
          return name.includes(query) || description.includes(query);
        });
      }

      results = results.filter((product) => {
        const price =
          product.masterData?.current?.masterVariant?.prices?.[0]?.value?.centAmount || 0;
        return price >= priceRange[0] * 100 && price <= priceRange[1] * 100;
      });

      if (filters.color) {
        results = results.filter((product) =>
          product.masterData.current.masterVariant?.attributes?.some(
            (attr) => attr.name === 'color' && attr.value === filters.color
          )
        );
      }

      if (filters.size) {
        results = results.filter((product) =>
          product.masterData.current.masterVariant?.attributes?.some(
            (attr) => attr.name === 'size' && attr.value === filters.size
          )
        );
      }

      const getProductName = (product: Product): string => {
        return product.masterData?.current?.name?.en || product.id;
      };

      const getProductPrice = (product: Product): number => {
        const priceObj = product.masterData?.current?.masterVariant?.prices?.[0];
        if (!priceObj?.value?.centAmount) return 0;

        return priceObj.discounted?.value?.centAmount || priceObj.value.centAmount;
      };

      results = results.sort((a, b) => {
        const aName = String(getProductName(a)).toLowerCase();
        const bName = String(getProductName(b)).toLowerCase();
        const aPrice = getProductPrice(a);
        const bPrice = getProductPrice(b);

        switch (sortOption) {
          case 'price asc':
            return aPrice - bPrice;
          case 'price desc':
            return bPrice - aPrice;
          case 'name desc':
            return bName.localeCompare(aName);
          default:
            return aName.localeCompare(bName);
        }
      });

      setProducts(results);
      extractAvailableFilters(results);
    } catch (err) {
      setIsSearching(false);
      const errorMessage = err instanceof Error ? err.message : 'Error loading products';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [makeApiRequest, appliedSearch, selectedCategory, sortOption, priceRange, filters]);

  const extractAvailableFilters = (products: Product[]): void => {
    const colors = new Set<string>();
    const sizes = new Set<string>();

    products.forEach((product) => {
      product.masterData.current.masterVariant?.attributes?.forEach((attr) => {
        if (attr.name === 'color' && typeof attr.value === 'string') {
          colors.add(attr.value);
        }
        if (attr.name === 'size' && typeof attr.value === 'string') {
          sizes.add(attr.value);
        }
      });
    });

    setAvailableColors(Array.from(colors));
    setAvailableSizes(Array.from(sizes));
  };

  const resetFilters = useCallback((): void => {
    setFilters({
      color: '',
      size: '',
    });
    setPriceRange([0, 200]);
    setAppliedSearch('');
    setSearchInput('');
    setSelectedCategory('');
    setSortOption('name asc');
  }, []);

  const handleSearch = useCallback((): void => {
    setAppliedSearch(searchInput);
  }, [searchInput]);

  const handleResetSearch = useCallback(() => {
    setSearchInput('');
    setAppliedSearch('');
  }, []);

  const handlePriceChange = useCallback(
    (index: number) =>
      (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue = Number(e.target.value);
        setPriceRange((prev) => {
          const newRange = [...prev] as [number, number];
          newRange[index] = newValue;
          return newRange;
        });
      },
    []
  );

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        await Promise.all([fetchCategories(), fetchProducts()]);
      } catch (err) {
        if (err instanceof Error && err.message === 'Authorization required') {
          navigate('/login');
        } else {
          console.error('Error loading data:', err);
          setError('Failed to load data. Please try again later.');
        }
      }
    };
    loadData();
  }, [fetchCategories, fetchProducts, navigate]);

  useEffect(() => {
    if (
      appliedSearch !== '' ||
      selectedCategory ||
      sortOption !== 'name asc' ||
      filters.color ||
      filters.size ||
      priceRange[0] !== 0 ||
      priceRange[1] !== 200
    ) {
      setIsSearching(true);
      fetchProducts().finally(() => setIsSearching(false));
      setCurrentPage(1);
      fetchProducts();
    }
  }, [appliedSearch, selectedCategory, sortOption, filters, priceRange, fetchProducts]);

  if (loading && products.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading goods...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error loading products</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.catalogContainer}>
      <MobileHeader
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        handleResetSearch={handleResetSearch}
        isSearching={isSearching}
        sortOption={sortOption}
        setSortOption={setSortOption}
        setIsCategoriesModalOpen={setIsCategoriesModalOpen}
        setIsFiltersModalOpen={setIsFiltersModalOpen}
      />

      <div className={styles.mainLayout}>
        <Sidebar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
          handleResetSearch={handleResetSearch}
          isSearching={isSearching}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          handlePriceChange={handlePriceChange}
          availableColors={availableColors}
          availableSizes={availableSizes}
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
        />

        <main className={styles.mainContent}>
          <div className={styles.desktopToolbar}>
            <Breadcrumbs
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="name asc">Sorting: A-Z</option>
              <option value="name desc">Sorting: Z-A</option>
              <option value="price asc">Sorting: Price ascending</option>
              <option value="price desc">Sorting: Price descending</option>
            </select>
          </div>
          <ProductGrid products={getCurrentProducts()} searchQuery={appliedSearch} />
          <Pagination
            totalItems={products.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        priceRange={priceRange}
        handlePriceChange={handlePriceChange}
        availableColors={availableColors}
        availableSizes={availableSizes}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />

      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
};

export default CatalogPage;
