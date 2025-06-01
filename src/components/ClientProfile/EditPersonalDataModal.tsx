import React, { useState, useEffect } from 'react';
import { registrationSchema } from '../../utils/validateRegistration';
import { getCustomerData } from '../../services/ClientInfApi/GetClientInf';
import { updateCustomerPersonalData } from '../../services/ClientInfApi/UpdateCustomer';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import styles from './ModalPersonalData.module.css';

export interface PropsPersonalData {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
}

export function ModalPersonalData({
  isOpen,
  onClose,
  firstName,
  lastName,
  email,
  dateOfBirth,
}: PropsPersonalData) {

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
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (name === 'firstName' && updatedErrors.username) {
        delete updatedErrors.username;
      }
      if (name === 'lastName' && updatedErrors.surname) {
        delete updatedErrors.surname;
      }
      if (name === 'email' && updatedErrors.email) {
        delete updatedErrors.email;
      }
      if (name === 'dateOfBirth' && updatedErrors.birthday) {
        delete updatedErrors.birthday;
      }
      return updatedErrors;
    });
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

  return (
    <>
    {isOpen && (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <form onSubmit={handleSubmit} className={styles.formPosition}>
          <h2 className={styles.title}>Change client information</h2>
          <input
            className={styles.input}
            name="firstName"
            placeholder="Имя"
            value={formData.firstName}
            onChange={handleChange}
          />
          {submitted && errors.username && <p className="errors">{errors.username}</p>}
          <input
            className={styles.input}
            name="lastName"
            placeholder="Фамилия"
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

          <div className={styles.buttonGroup}>
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
    )}
    </>
  );
}
