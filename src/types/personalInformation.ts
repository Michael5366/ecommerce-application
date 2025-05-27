type CustomerUpdateAction =
  | { action: 'setFirstName'; firstName: string }
  | { action: 'setLastName'; lastName: string }
  | { action: 'changeEmail'; email: string }
  | { action: 'setDateOfBirth'; dateOfBirth: string }
  | {
      action: 'changeAddress';
      addressId: string;
      address: {
        streetName: string;
        city: string;
        postalCode: string;
        country: string;
      };
    }
  | { action: 'setDefaultBillingAddress'; addressIds: string[] }
  | { action: 'setDefaultShippingAddress'; addressIds: string[] };

export type UpdateCustomerBody = {
  version: number;
  actions: CustomerUpdateAction[];
};