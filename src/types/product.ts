export type Product = {
  id?: string;
  name: { en: string; ru?: string };
  description?: { en?: string; ru?: string };
  masterVariant: {
    images?: { url: string }[];
    prices?: { value: { centAmount: number; currencyCode: string } }[];
  };
};
