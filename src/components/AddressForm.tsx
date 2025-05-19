import { Address, AddressErrors } from '../types/form';
import '../styles/cssRegistration.css'

type AddressFormProps = {
  type: 'shippingAddress' | 'billingAddress';
  title: string;
  address: Address;
  errors: AddressErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: 'shippingAddress' | 'billingAddress'
  ) => void;
};

export default function AddressForm({ type, title, address, errors, onChange }: AddressFormProps) {
  return (
    <div className="adress-general">
      <h3>{title}</h3>
      <div className="adress-block">
        <input
          name="streetName"
          placeholder="Улица"
          value={address.streetName}
          onChange={(e) => onChange(e, type)}
        />
        {errors.streetName && <p className='errors'>{errors.streetName}</p>}

        <input
          name="city"
          placeholder="Город"
          value={address.city}
          onChange={(e) => onChange(e, type)}
        />
        {errors.city && <p className='errors'>{errors.city}</p>}

        <input
          name="postalCode"
          placeholder="Почтовый индекс"
          value={address.postalCode}
          onChange={(e) => onChange(e, type)}
        />
        {errors.postalCode && <p className='errors'>{errors.postalCode}</p>}

        <select name="country" value={address.country} onChange={(e) => onChange(e, type)}>
          <option value="">-- Выберите --</option>
          <option value="US">США</option>
          <option value="ES">Испания</option>
          <option value="FR">Франция</option>
        </select>
        {errors.country && <p className='errors'>{errors.country}</p>}
      </div>
    </div>
  );
}
