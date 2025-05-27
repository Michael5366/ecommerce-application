import { useState } from 'react';
import { registrationSchema, addressSchema } from '../../utils/validateRegistration';

//import { string } from "zod/v4";

import { Address } from "../../services/ClientInfApi/GetClientInf";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  version: number;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  addresses: Address[];
  billingAddressIds: string[];
  shippingAddressIds: string[];
}


export default function EditDataChangedModal({ isOpen, onClose, id, version, firstName, lastName, email, dateOfBirth, addresses, billingAddressIds, shippingAddressIds}: Props) {
console.log(isOpen, id, version);

if (!isOpen) return null;

const [formData, setFormData] = useState({
    firstName,
    lastName,
    email,
    dateOfBirth: dateOfBirth || '',
    addresses: addresses.map((address) => ({ ...address })),
  });
  const [addressErrors, setAddressErrors] = useState<Record<number, Partial<Record<keyof Address, string>>>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [billingSelected, setBillingSelected] = useState<string[]>(billingAddressIds);
  const [shippingSelected, setShippingSelected] = useState<string[]>(shippingAddressIds);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number, field?: keyof Address) => {
    const { name, value } = e.target;

    if (typeof index === 'number' && field) {
      // Update address
      const updatedAddresses = [...formData.addresses];
      updatedAddresses[index][field] = value;
      setFormData({ ...formData, addresses: updatedAddresses });
    } else {
      // Update regular input
      setFormData({ ...formData, [name]: value });
    }
  };

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setSubmitted(true);

  const newErrors: Record<string, string> = {};

  const validationResult = registrationSchema
    .omit({ password: true, shippingAddress: true, billingAddress: true })
    .safeParse({
      username: formData.firstName,
      surname: formData.lastName,
      email: formData.email,
      birthday: formData.dateOfBirth,
    });

  if (!validationResult.success) {
    const issues = validationResult.error.flatten().fieldErrors;
    if (issues.username) newErrors.username = issues.username[0];
    if (issues.surname) newErrors.surname = issues.surname[0];
    if (issues.email) newErrors.email = issues.email[0];
    if (issues.birthday) newErrors.birthday = issues.birthday[0];
  }

  const addrErrors: Record<number, Partial<Record<keyof Address, string>>> = {};
  formData.addresses.forEach((addr, index) => {
    const result = addressSchema.safeParse(addr);
    if (!result.success) {
      const issues = result.error.flatten().fieldErrors;
      addrErrors[index] = {
        streetName: issues.streetName?.[0],
        city: issues.city?.[0],
        postalCode: issues.postalCode?.[0],
        country: issues.country?.[0],
      };
    }
  });

  setErrors(newErrors);
  setAddressErrors(addrErrors);

  if (Object.keys(newErrors).length === 0 && Object.keys(addrErrors).length === 0) {
    console.log('Submitting form data:', formData);
    onClose();
  }
};
const handleBillingChange = (id: string) => {
  setBillingSelected((prev) => {
    if (prev.includes(id)) {
      // Убираем галочку
      return prev.filter(item => item !== id);
    } else {
      // Заменяем текущий дефолт на новый (только один дефолт)
      return [id];
    }
  });
};

const handleShippingChange = (id: string) => {
  setShippingSelected((prev) => {
    if (prev.includes(id)) {
      return prev.filter(item => item !== id);
    } else {
      return [id];
    }
  });
};

return(
    <>
      <form onSubmit={handleSubmit} className="form-position">
          <h2>Change client information</h2>
                <input
                  name="firstName"
                  placeholder="Имя"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {submitted && errors.username && <p className="errors">{errors.username}</p>}
                <input
                  name="lastName"
                  placeholder="Фамилия"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {submitted && errors.surname && <p className="errors">{errors.surname}</p>}
                <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />

                {submitted && errors.email && <p className="errors">{errors.email}</p>}

                <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />

                {submitted && errors.birthday && <p className="errors">{errors.birthday}</p>}

      <div className="adress-block">
         {formData.addresses.map((address, index) => (
  <div
    key={address.id || index}
    style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}
  >
    <label>
      <input
        type="checkbox"
        checked={billingSelected.includes(address.id)}
        onChange={() => handleBillingChange(address.id)}
      />
      Установить как дефолтный биллинг адрес
    </label>

    <label>
      <input
        type="checkbox"
        checked={shippingSelected.includes(address.id)}
        onChange={() => handleShippingChange(address.id)}
      />
      Установить как дефолтный шиппинг адрес
    </label>
    <input
      placeholder="Street"
      value={address.streetName}
      onChange={(e) => handleChange(e, index, 'streetName')}
    />
    {submitted && addressErrors[index]?.streetName && (
      <p className="errors">{addressErrors[index].streetName}</p>
    )}

    <input
      placeholder="City"
      value={address.city}
      onChange={(e) => handleChange(e, index, 'city')}
    />
    {submitted && addressErrors[index]?.city && (
      <p className="errors">{addressErrors[index].city}</p>
    )}

    <input
      placeholder="Postal Code"
      value={address.postalCode}
      onChange={(e) => handleChange(e, index, 'postalCode')}
    />
    {submitted && addressErrors[index]?.postalCode && (
      <p className="errors">{addressErrors[index].postalCode}</p>
    )}

    <input
      placeholder="Country (US, FR, ES)"
      value={address.country}
      onChange={(e) => handleChange(e, index, 'country')}
    />
    {submitted && addressErrors[index]?.country && (
      <p className="errors">{addressErrors[index].country}</p>
    )}
  </div>
))}
        </div>

        <div className="button-group">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
}