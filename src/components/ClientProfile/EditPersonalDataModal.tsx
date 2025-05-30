import React, { useState, useEffect } from 'react';
import { registrationSchema } from '../../utils/validateRegistration';
import { getCustomerData } from '../../services/ClientInfApi/GetClientInf';
import { updateCustomerPersonalData } from '../../services/ClientInfApi/UpdateCustomer';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export interface PropsPersonalData {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  version: number;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
}

export function ModalPersonalData({
  isOpen,
  onClose,
  id,
  version,
  firstName,
  lastName,
  email,
  dateOfBirth,
}: PropsPersonalData) {
  console.log(isOpen, id, version);
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    firstName,
    lastName,
    email,
    dateOfBirth: dateOfBirth,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName,
        lastName,
        email,
        dateOfBirth: dateOfBirth || '',
      });
      setErrors({});
      setSubmitted(false);
    }
  }, [isOpen, firstName, lastName, email, dateOfBirth]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('Изменение поля:', name, value);
    setFormData({ ...formData, [name]: value });
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

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

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
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
      if (formData.dateOfBirth && current.dateOfBirth !== formData.dateOfBirth) {
        actions.push({ action: 'setDateOfBirth' as const, dateOfBirth: formData.dateOfBirth });
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
      const payload = { version: current.version, actions };
      console.log('Payload для отправки:', JSON.stringify(payload, null, 2));
      await updateCustomerPersonalData({ version: current.version, actions });

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
    } catch (err) {
      console.error('Ошибка обновления:', err);
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

  return (
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

        <input
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        {submitted && errors.birthday && <p className="errors">{errors.birthday}</p>}

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
