export type Price = {
  value: { centAmount: number; currencyCode: string };
  discounted?: {
    value: { centAmount: number; currencyCode: string };
  };
};

export type Product = {
  id?: string;
  name: { en: string; ru?: string };
  description?: { en?: string; ru?: string };
  masterVariant: {
    images?: { url: string }[];
    prices?: Price[];
  };
};
