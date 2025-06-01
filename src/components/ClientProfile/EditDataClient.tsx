import { useState } from 'react';
import { registrationSchema, addressSchema } from '../../utils/validateRegistration';
import { getCustomerData } from '../../services/ClientInfApi/GetClientInf';
import { updateCustomer } from '../../services/ClientInfApi/UpdateCustomer';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import styles from './ModalPersonalData.module.css';

//import { string } from "zod/v4";

import { Address } from '../../services/ClientInfApi/GetClientInf';
export interface Props {
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

export default function EditDataChangedModal({
  isOpen,
  onClose,
  firstName,
  lastName,
  email,
  dateOfBirth,
  addresses,
  billingAddressIds,
  shippingAddressIds,
}: Props) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    firstName,
    lastName,
    email,
    dateOfBirth: dateOfBirth || '',
    addresses: addresses.map((address) => ({ ...address })),
  });
  const [addressErrors, setAddressErrors] = useState<
    Record<number, Partial<Record<keyof Address, string>>>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [billingSelected, setBillingSelected] = useState<string[]>(billingAddressIds);
  const [shippingSelected, setShippingSelected] = useState<string[]>(shippingAddressIds);
  const [submitted, setSubmitted] = useState(false);

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
      setAddressErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        if (updatedErrors[index]) {
          const newErrorEntry = { ...updatedErrors[index] };
          delete newErrorEntry[field];
          if (Object.keys(newErrorEntry).length === 0) {
            delete updatedErrors[index];
          } else {
            updatedErrors[index] = newErrorEntry;
          }
        }
        return updatedErrors;
      });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors((prev) => {
        const updated = { ...prev };

        if (name === 'firstName' && updated.username) delete updated.username;
        if (name === 'lastName' && updated.surname) delete updated.surname;
        if (name === 'email' && updated.email) delete updated.email;
        if (name === 'dateOfBirth' && updated.birthday) delete updated.birthday;
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    if (Object.keys(newErrors).length > 0 || Object.keys(addrErrors).length > 0) {
      return;
    }
    try {
      const current = await getCustomerData();

      const actions = [];

      if (current.firstName !== formData.firstName) {
        actions.push({ action: 'setFirstName' as const, firstName: formData.firstName });
      }
      if (current.lastName !== formData.lastName) {
        actions.push({ action: 'setLastName' as const, lastName: formData.lastName });
      }
      if (current.email !== formData.email) {
        actions.push({ action: 'changeEmail' as const, email: formData.email });
      }
      if (current.dateOfBirth !== formData.dateOfBirth) {
        actions.push({ action: 'setDateOfBirth' as const, dateOfBirth: formData.dateOfBirth });
      }

      formData.addresses.forEach((address) => {
        const existing = current.addresses.find((a) => a.id === address.id);
        if (
          !existing ||
          existing.streetName !== address.streetName ||
          existing.city !== address.city ||
          existing.postalCode !== address.postalCode ||
          existing.country !== address.country
        ) {
          actions.push({
            action: 'changeAddress' as const,
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

      const removedBillingIds = current.billingAddressIds.filter(
        (id) => !billingSelected.includes(id)
      );
      const addedBillingIds = billingSelected.filter(
        (id) => !current.billingAddressIds.includes(id)
      );

      removedBillingIds.forEach((id) => {
        actions.push({ action: 'removeBillingAddressId' as const, addressId: id });
      });

      if (addedBillingIds.length > 0) {
        actions.push({
          action: 'setDefaultBillingAddress' as const,
          addressId: addedBillingIds[0],
        });
      }

      // Shipping
      const removedShippingIds = current.shippingAddressIds.filter(
        (id) => !shippingSelected.includes(id)
      );
      const addedShippingIds = shippingSelected.filter(
        (id) => !current.shippingAddressIds.includes(id)
      );

      removedShippingIds.forEach((id) => {
        actions.push({ action: 'removeShippingAddressId' as const, addressId: id });
      });

      if (addedShippingIds.length > 0) {
        actions.push({
          action: 'setDefaultShippingAddress' as const,
          addressId: addedShippingIds[0],
        });
      }

      if (actions.length === 0) {
        Toastify({
          text: 'There is no information to update',
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'right',
          style: {
            background: '#00a550',
            color: '#fff',
          },
        }).showToast();
        return;
      }

      await updateCustomer({ version: current.version, actions });

      Toastify({
        text: 'The information has been updated',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        style: {
          background: '#42ff9e',
          color: '#fff',
        },
      }).showToast();
      onClose();
    } catch {
      Toastify({
        text: 'The information has not been updated',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        style: {
          background: '#FF6B6B',
          color: '#fff',
        },
      }).showToast();
    }
  };

  const handleBillingChange = (id: string) => {
    setBillingSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [id];
      }
    });
  };

  const handleShippingChange = (id: string) => {
    setShippingSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [id];
      }
    });
  };

  return (
    <div className={styles.modalOverlayDataClientModal}>
      <div className={styles.modalContentDataClientModal}>
        <form onSubmit={handleSubmit} className={styles.formPosition}>
          <h2 className={styles.title}>Change client information</h2>
          <input
            name="firstName"
            className={styles.input}
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
          />
          {submitted && errors.username && <p className="errors">{errors.username}</p>}
          <input
            name="lastName"
            className={styles.input}
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          {submitted && errors.surname && <p className="errors">{errors.surname}</p>}
          <input
            name="email"
            className={styles.input}
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          {submitted && errors.email && <p className="errors">{errors.email}</p>}

          <input
            className={styles.input}
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />

          {submitted && errors.birthday && <p className="errors">{errors.birthday}</p>}

          <div className="adress-block">
            {formData.addresses.map((address, index) => (
              <div
                key={address.id || index}
                style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}
              >
                <div>
                  <label>
                    <input
                      type="checkbox"
                      className={styles.inputCheckBox}
                      checked={billingSelected.includes(address.id)}
                      onChange={() => handleBillingChange(address.id)}
                    />
                    Set as the default billing address
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      className={styles.inputCheckBox}
                      checked={shippingSelected.includes(address.id)}
                      onChange={() => handleShippingChange(address.id)}
                    />
                    Set as the default shipping address
                  </label>
                </div>
                <input
                  placeholder="Street"
                  className={styles.input}
                  value={address.streetName}
                  onChange={(e) => handleChange(e, index, 'streetName')}
                />
                {submitted && addressErrors[index]?.streetName && (
                  <p className="errors">{addressErrors[index].streetName}</p>
                )}

                <input
                  placeholder="City"
                  className={styles.input}
                  value={address.city}
                  onChange={(e) => handleChange(e, index, 'city')}
                />
                {submitted && addressErrors[index]?.city && (
                  <p className="errors">{addressErrors[index].city}</p>
                )}

                <input
                  placeholder="Postal Code"
                  className={styles.input}
                  value={address.postalCode}
                  onChange={(e) => handleChange(e, index, 'postalCode')}
                />
                {submitted && addressErrors[index]?.postalCode && (
                  <p className="errors">{addressErrors[index].postalCode}</p>
                )}

                <input
                  placeholder="Country (US, FR, ES)"
                  className={styles.input}
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
            <button type="button" className={styles.button} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.button}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
