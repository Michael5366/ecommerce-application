import { useState } from 'react';
import { Address } from '../../services/ClientInfApi/GetClientInf';
import { registrationSchema } from '../../utils/validateRegistration';
import { addressSchema } from '../../utils/validateRegistration';
import { getCustomerData } from '../../services/ClientInfApi/GetClientInf';
import { updateCustomerAdd } from '../../services/ClientInfApi/UpdateCustomer';

export interface PropsAdress {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  version: number;
  email: string;
  addresses: Address[];
  billingAddressIds: string[];
  shippingAddressIds: string[];
}

export function EditAdressModal({
  isOpen,
  onClose,
  email,
  addresses,
  billingAddressIds,
  shippingAddressIds,
}: PropsAdress) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    email,
    addresses: addresses.map((address) => ({ ...address })),
  });
  const [addressErrors, setAddressErrors] = useState<
    Record<number, Partial<Record<keyof Address, string>>>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [billingSelected, setBillingSelected] = useState<string[]>(billingAddressIds);
  const [shippingSelected, setShippingSelected] = useState<string[]>(shippingAddressIds);
  const [submitted, setSubmitted] = useState(false);

  console.log(errors);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number,
    field?: keyof Address
  ) => {
    const { name, value } = e.target;

    if (typeof index === 'number' && field) {
      const updatedAddresses = [...formData.addresses];
      updatedAddresses[index][field] = value;
      setFormData({ ...formData, addresses: updatedAddresses });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('handle submit is acting', formData);
    const newErrors: Record<string, string> = {};

    const validationResult = registrationSchema
      .omit({ password: true, shippingAddress: true, billingAddress: true, birthday: true })
      .safeParse({
        email: formData.email,
      });

    if (!validationResult.success) {
      const issues = validationResult.error.flatten().fieldErrors;
      if (issues.email) newErrors.email = issues.email[0];
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

    if (Object.keys(newErrors).length > 0 || Object.keys(addrErrors).length > 0) {
      console.log('NEW FORM ERRORS:', newErrors);
      console.log('ADDRESS ERRORS:', addrErrors);

      return;
    }
    try {
      const current = await getCustomerData();

      const actions = [];

      if (current.email !== formData.email) {
        actions.push({ action: 'changeEmail' as const, email: formData.email });
      }

      current.addresses.forEach((addr) => {
        const stillExists = formData.addresses.find((a) => a.id === addr.id);
        if (!stillExists) {
          actions.push({ action: 'removeAddress', addressId: addr.id });
        }
      });

      formData.addresses.forEach((address) => {
        const existing = current.addresses.find((a) => a.id === address.id);

        if (!existing && address.id.startsWith('temp-')) {
          actions.push({
            action: 'addAddress',
            address: {
              streetName: address.streetName,
              city: address.city,
              postalCode: address.postalCode,
              country: address.country,
            },
          });
        } else if (
          existing &&
          (existing.streetName !== address.streetName ||
            existing.city !== address.city ||
            existing.postalCode !== address.postalCode ||
            existing.country !== address.country)
        ) {
          actions.push({
            action: 'changeAddress',
            addressId: address.id,
            address: {
              streetName: address.streetName,
              city: address.city,
              postalCode: address.postalCode,
              country: address.country,
            },
          });
        }
      });

      current.billingAddressIds.forEach((id) => {
        if (!billingSelected.includes(id)) {
          actions.push({ action: 'removeBillingAddressId', addressId: id });
        }
      });
      current.shippingAddressIds.forEach((id) => {
        if (!shippingSelected.includes(id)) {
          actions.push({ action: 'removeShippingAddressId', addressId: id });
        }
      });

      if (
        JSON.stringify(current.billingAddressIds) !== JSON.stringify(billingSelected) &&
        billingSelected.length > 0
      ) {
        actions.push({
          action: 'setDefaultBillingAddress' as const,
          addressId: billingSelected[0],
        });
      }
      if (
        JSON.stringify(current.shippingAddressIds) !== JSON.stringify(shippingSelected) &&
        shippingSelected.length > 0
      ) {
        actions.push({
          action: 'setDefaultShippingAddress' as const,
          addressId: shippingSelected[0],
        });
      }

      if (actions.length === 0) {
        alert('Нет изменений для сохранения.');
        return;
      }
      console.log('Actions:', actions);
      const payload = { version: current.version, actions };
      console.log('Payload для отправки:', JSON.stringify(payload, null, 2));

      const firstActions = actions.filter(
        (action) =>
          action.action !== 'setDefaultBillingAddress' &&
          action.action !== 'setDefaultShippingAddress'
      );

      await updateCustomerAdd({ version: current.version, actions: firstActions });

      const updatedCustomer = await getCustomerData();

      const defaultBillingId = updatedCustomer.addresses.find(
        (addr) =>
          addr.streetName ===
            formData.addresses.find((a) => a.id === billingSelected[0])?.streetName &&
          addr.city === formData.addresses.find((a) => a.id === billingSelected[0])?.city &&
          addr.postalCode ===
            formData.addresses.find((a) => a.id === billingSelected[0])?.postalCode &&
          addr.country === formData.addresses.find((a) => a.id === billingSelected[0])?.country
      )?.id;

      const defaultShippingId = updatedCustomer.addresses.find(
        (addr) =>
          addr.streetName ===
            formData.addresses.find((a) => a.id === shippingSelected[0])?.streetName &&
          addr.city === formData.addresses.find((a) => a.id === shippingSelected[0])?.city &&
          addr.postalCode ===
            formData.addresses.find((a) => a.id === shippingSelected[0])?.postalCode &&
          addr.country === formData.addresses.find((a) => a.id === shippingSelected[0])?.country
      )?.id;

      const secondActions = [];

      if (defaultBillingId) {
        secondActions.push({
          action: 'setDefaultBillingAddress' as const,
          addressId: defaultBillingId,
        });
      }

      if (defaultShippingId) {
        secondActions.push({
          action: 'setDefaultShippingAddress' as const,
          addressId: defaultShippingId,
        });
      }

      if (secondActions.length > 0) {
        await updateCustomerAdd({ version: updatedCustomer.version, actions: secondActions });
      }

      alert('Данные обновлены!');
      onClose();
    } catch (err) {
      console.error('Ошибка обновления:', err);
      alert('Ошибка при обновлении данных');
    }
  };
  const handleBillingChange = (id: string) => {
    setBillingSelected((prev) => {
      let newBillingSelected;
      if (prev.includes(id)) {
        newBillingSelected = prev.filter((item) => item !== id);
      } else {
        newBillingSelected = [id];
      }

      setFormData((prevFormData) => {
        const updatedAddresses = prevFormData.addresses.map((addr) => ({
          ...addr,
          isBilling: newBillingSelected.includes(addr.id),
        }));
        return { ...prevFormData, addresses: updatedAddresses };
      });

      return newBillingSelected;
    });
  };

  const handleShippingChange = (id: string) => {
    setShippingSelected((prev) => {
      let newShippingSelected;
      if (prev.includes(id)) {
        newShippingSelected = prev.filter((item) => item !== id);
      } else {
        newShippingSelected = [id];
      }

      setFormData((prevFormData) => {
        const updatedAddresses = prevFormData.addresses.map((addr) => ({
          ...addr,
          isShipping: newShippingSelected.includes(addr.id),
        }));
        return { ...prevFormData, addresses: updatedAddresses };
      });

      return newShippingSelected;
    });
  };
  const handleRemoveAddress = (index: number) => {
    const updated = [...formData.addresses];
    updated.splice(index, 1);
    setFormData({ ...formData, addresses: updated });
  };
  const handleAddAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        {
          id: `temp-${Date.now()}`,
          streetName: '',
          city: '',
          postalCode: '',
          country: '',
        },
      ],
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
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
              <button type="button" onClick={() => handleRemoveAddress(index)}>
                ❌
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={handleAddAddress}>
          ➕ Add adress
        </button>
        <div className="button-group">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
}
