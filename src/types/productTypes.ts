export interface PriceValue {
  centAmount: number;
  currencyCode: string;
}

export interface DiscountedPrice {
  value: PriceValue;
}

export interface Price {
  value: PriceValue;
  discounted?: DiscountedPrice;
}

export interface Image {
  url: string;
  dimensions: {
    w: number;
    h: number;
  };
  label?: string;
}

export interface Attribute {
  name: string;
  value: string | number | boolean | null;
}

export interface ProductVariant {
  id: number;
  sku?: string;
  prices?: Price[];
  images?: Image[];
  attributes?: Attribute[];
}

export interface CategoryReference {
  typeId: 'category';
  id: string;
}

export interface ProductData {
  name: {
    en: string;
    [key: string]: string;
  };
  description?: {
    en?: string;
    [key: string]: string | undefined;
  };
  categories: CategoryReference[];
  masterVariant: ProductVariant;
  variants: ProductVariant[];
}

export interface Product {
  id: string;
  version: number;
  productType: {
    typeId: 'product-type';
    id: string;
  };
  masterData: {
    current: ProductData;
    staged?: ProductData;
    published: boolean;
    hasStagedChanges: boolean;
  };
  createdAt: string;
  lastModifiedAt: string;
}

export interface Category {
  id: string;
  version: number;
  name: Record<string, string>;
  slug: Record<string, string>;
  parent?: CategoryReference;
  ancestors: CategoryReference[];
  orderHint: string;
  createdAt: string;
  lastModifiedAt: string;
}

export interface ProductPriceInfo {
  current: PriceValue;
  original: PriceValue | null;
  hasDiscount: boolean;
}
