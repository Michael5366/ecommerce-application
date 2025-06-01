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

export interface LocalizedString {
  [locale: string]: string;
}

export interface EnumValue {
  key: string;
  label?: string | LocalizedString;
}

export interface LocalizedEnumValue {
  key: string;
  label: LocalizedString;
}

export type PrimitiveAttributeValue = string | number | boolean | null;
export type ComplexAttributeValue = LocalizedString | EnumValue | LocalizedEnumValue;
export type SingleAttributeValue = PrimitiveAttributeValue | ComplexAttributeValue;
export type AttributeValue = SingleAttributeValue | AttributeValue[];

export interface Attribute {
  name: string;
  value: AttributeValue;
}

export function isEnumValue(value: unknown): value is EnumValue {
  return typeof value === 'object' && value !== null && 'key' in value;
}

export function isLocalizedEnumValue(value: unknown): value is LocalizedEnumValue {
  return isEnumValue(value) && 'label' in value && typeof value.label === 'object';
}

export function isLocalizedString(value: unknown): value is LocalizedString {
  return typeof value === 'object' && value !== null && !isEnumValue(value);
}

export interface CategoryReference {
  typeId: 'category';
  id: string;
}

export interface ProductVariant {
  id: number;
  sku?: string;
  prices?: Price[];
  images?: Image[];
  attributes?: Attribute[];
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
  name: {
    en: string;
    [key: string]: string;
  };
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

export interface ProductFilters {
  color: string;
  occasion: string;
  flowerType: string;
}

export interface AvailableFilters {
  colors: string[];
  occasions: string[];
  flowerTypes: string[];
}
