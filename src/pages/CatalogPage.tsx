import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../services/Catalog/catalogAPI';
import {
  Product,
  Category,
  ProductFilters,
  AttributeValue,
  isEnumValue,
  isLocalizedString,
} from '../types/productTypes';
import { ProductGrid } from '../components/Catalog/ProductGrid';
import { Sidebar } from '../components/Catalog/Sidebar';
import { MobileHeader } from '../components/Catalog/MobileHeader';
import { FiltersModal } from '../components/Catalog/FiltersModal';
import { CategoriesModal } from '../components/Catalog/CategoriesModal';
import styles from './CatalogPage.module.css';
import { Pagination } from '../components/Catalog/Pagination';
import { Breadcrumbs } from '../components/Catalog/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { useCart } from '../hooks/useCart';

const CatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('name asc');
  const [filters, setFilters] = useState<ProductFilters>({
    color: '',
    occasion: '',
    flowerType: '',
  });
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableOccasions, setAvailableOccasions] = useState<string[]>([]);
  const [availableFlowerTypes, setAvailableFlowerTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState<boolean>(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const isFirstRender = useRef(true);
  const { cartItems, addToCart, refreshCart } = useCart();

  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { makeApiRequest } = useApi();

  const { t } = useTranslation();

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading categories';
      setError(errorMessage);
    }
  }, [makeApiRequest]);

  const extractStringValues = useCallback((value: AttributeValue): string[] => {
    if (value === null || value === undefined) return [];
    if (typeof value === 'string') return [value];
    if (typeof value === 'number') return [String(value)];
    if (typeof value === 'boolean') return [];

    if (Array.isArray(value)) {
      return value.flatMap(extractStringValues);
    }

    if (isEnumValue(value)) {
      const label = value.label;
      if (!label) return [value.key];

      if (typeof label === 'string') {
        return [label];
      } else {
        return [label.en || Object.values(label)[0] || value.key];
      }
    }

    if (isLocalizedString(value)) {
      return [value.en || Object.values(value)[0]];
    }

    return [];
  }, []);

  const fetchProducts = useCallback(async (): Promise<void> => {
    setLoading(true);
    setIsSearching(true);

    try {
      const params: Record<string, string> = {
        limit: '100',
        expand: 'masterVariant.attributes',
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
          product.masterData.current.masterVariant?.attributes?.some((attr) => {
            if (attr.name.toLowerCase() !== 'color') return false;
            const values = extractStringValues(attr.value);
            return values.includes(filters.color);
          })
        );
      }

      if (filters.occasion) {
        results = results.filter((product) =>
          product.masterData.current.masterVariant?.attributes?.some((attr) => {
            if (!attr.name.toLowerCase().includes('occasion')) return false;
            const values = extractStringValues(attr.value);
            return values.includes(filters.occasion);
          })
        );
      }

      if (filters.flowerType) {
        results = results.filter((product) =>
          product.masterData.current.masterVariant?.attributes?.some((attr) => {
            if (!attr.name.toLowerCase().includes('flower')) return false;
            const values = extractStringValues(attr.value);
            return values.includes(filters.flowerType);
          })
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

      const colors = new Set<string>();
      const occasions = new Set<string>();
      const flowerTypes = new Set<string>();

      data.results.forEach((product) => {
        const attributes = product.masterData.current.masterVariant?.attributes || [];

        attributes.forEach((attr) => {
          const values = extractStringValues(attr.value);
          if (values.length === 0) return;

          const attrName = attr.name.toLowerCase();

          if (attrName.includes('color')) {
            values.forEach((v) => colors.add(v));
          } else if (attrName.includes('occasion')) {
            values.forEach((v) => occasions.add(v));
          } else if (attrName.includes('flower')) {
            values.forEach((v) => flowerTypes.add(v));
          }
        });
      });

      setAvailableColors(Array.from(colors).filter(Boolean));
      setAvailableOccasions(Array.from(occasions).filter(Boolean));
      setAvailableFlowerTypes(Array.from(flowerTypes).filter(Boolean));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading products';
      setError(errorMessage);
      console.debug('API Error:', error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [
    makeApiRequest,
    appliedSearch,
    selectedCategory,
    sortOption,
    priceRange,
    filters,
    extractStringValues,
  ]);

  const resetFilters = useCallback((): void => {
    setFilters({
      color: '',
      occasion: '',
      flowerType: '',
    });
    setPriceRange([0, 200]);
    setAppliedSearch('');
    setSearchInput('');
    setSelectedCategory('');
    setSortOption('name asc');
  }, []);

  const handleSearch = useCallback((): void => {
    setAppliedSearch(searchInput);
    setCurrentPage(1);
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

  useEffect(() => {
    if (categoryName) {
      const category = categories.find(
        (c) => c.name?.en?.toLowerCase().replace(/\s+/g, '-') === categoryName
      );
      if (category) {
        setSelectedCategory(category.id);
      }
    }
  }, [categoryName, categories]);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === '') {
      setSelectedCategory('');
      navigate('/catalog');
      return;
    }

    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      const categorySlug = category.name?.en?.toLowerCase().replace(/\s+/g, '-') || '';
      setSelectedCategory(categoryId);
      navigate(`/catalog/${categorySlug}`);
    }
  };

  const getCurrentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage, itemsPerPage]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        await fetchCategories();
      } catch (error) {
        console.debug('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetchProducts();
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [appliedSearch, selectedCategory, sortOption, filters, priceRange, fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [appliedSearch, selectedCategory, sortOption, filters, priceRange, fetchProducts]);

  if (loading && products.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>{t('loading_goods')}</p> {/* Переведено */}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>{t('error_loading_products')}</h2> {/* Переведено */}
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          {t('try_again')} {/* Переведено */}
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
          availableOccasions={availableOccasions}
          availableFlowerTypes={availableFlowerTypes}
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
              <option value="name asc">{t('sorting_a_z')}</option>
              <option value="name desc">{t('sorting_z_a')}</option>
              <option value="price asc">{t('sorting_price_asc')}</option>
              <option value="price desc">{t('sorting_price_desc')}</option>
            </select>
          </div>
          <ProductGrid
            products={getCurrentProducts}
            searchQuery={appliedSearch}
            categories={categories}
            cartItems={cartItems}
            onAddToCart={async (productId) => {
              await addToCart(productId);
            }}
          />
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
        availableOccasions={availableOccasions}
        availableFlowerTypes={availableFlowerTypes}
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
