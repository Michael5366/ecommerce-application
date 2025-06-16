import { Address, AddressErrors } from '../../types/form';
import './cssRegistration.css';

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
          placeholder="Street"
          value={address.streetName}
          onChange={(e) => onChange(e, type)}
        />
        {errors.streetName && <p className="errors">{errors.streetName}</p>}

        <input
          name="city"
          placeholder="City"
          value={address.city}
          onChange={(e) => onChange(e, type)}
        />
        {errors.city && <p className="errors">{errors.city}</p>}

        <input
          name="postalCode"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={(e) => onChange(e, type)}
        />
        {errors.postalCode && <p className="errors">{errors.postalCode}</p>}

        <select name="country" value={address.country} onChange={(e) => onChange(e, type)}>
          <option value="">-- Select --</option>
          <option value="US">USA</option>
          <option value="ES">Spain</option>
          <option value="FR">France</option>
        </select>
        {errors.country && <p className="errors">{errors.country}</p>}
      </div>
    </div>
  );
}
