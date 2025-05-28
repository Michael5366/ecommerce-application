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
  | { action: 'setDefaultBillingAddress'; addressId: string[]}
  | { action: 'setDefaultShippingAddress'; addressId: string[]};

export type UpdateCustomerBody = {
  version: number;
  actions: CustomerUpdateAction[];
};

type CustomerAdressAddAcion =
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
  | { action: 'setDefaultBillingAddress'; addressId: string}
  | { action: 'setDefaultShippingAddress'; addressId: string};

  export type UpdateCustomerAdressAddAcionFin = {
  version: number;
  actions: CustomerAdressAddAcion[];
};