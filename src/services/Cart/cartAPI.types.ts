export interface Cart {
  id: string;
  version: number;
  lineItems: LineItem[];
}

export interface LineItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: {
    value: {
      centAmount: number;
      currencyCode: string;
    };
  };
}
