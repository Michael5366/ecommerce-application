export type Address = {
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
  defaultShippingAddress?: boolean;
  defaultBillingAddress?: boolean;
};

export type FormData = {
  username: string;
  email: string;
  password: string;
  surname: string;
  birthday: string;
  shippingAddress: Address;
  billingAddress: Address;
};

export type AddressErrors = Partial<Record<keyof Address, string>>;

export type FormErrors = Partial<
  Record<keyof Omit<FormData, 'shippingAddress' | 'billingAddress'>, string>
> & {
  shippingAddress?: AddressErrors;
  billingAddress?: AddressErrors;
};
