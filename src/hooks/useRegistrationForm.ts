import { useState } from 'react';
import { FormData } from '../types/form';

export default function useRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    surname: '',
    birthday: '',
    shippingAddress: {
      streetName: '',
      city: '',
      postalCode: '',
      country: '',
      defaultShippingAddress: false,
    },
    billingAddress: {
      streetName: '',
      city: '',
      postalCode: '',
      country: '',
      defaultBillingAddress: false,
    },
  });

  const [useSameAddress, setUseSameAddress] = useState(true);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: 'shippingAddress' | 'billingAddress'
  ) => {
    const { name, value } = e.target;

    if (useSameAddress && type === 'shippingAddress') {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: { ...prev.shippingAddress, [name]: value },
        billingAddress: { ...prev.billingAddress, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [type]: { ...prev[type], [name]: value },
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setUseSameAddress(isChecked);

    if (isChecked) {
  setFormData((prev) => ({
    ...prev,
    billingAddress: {
      ...prev.shippingAddress,
      defaultBillingAddress: prev.billingAddress.defaultBillingAddress ?? prev.shippingAddress.defaultShippingAddress,
    },
  }));
} else {
  setFormData((prev) => ({
    ...prev,
    billingAddress: { streetName: '', city: '', postalCode: '', country: '', defaultBillingAddress: false },
  }));
}
  };

  const handleDefaultShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        defaultShippingAddress: e.target.checked,
      },
    }));
  };

  const handleDefaultBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        defaultBillingAddress: e.target.checked,
      },
    }));
  };

  return {
    formData,
    setFormData,
    useSameAddress,
    setUseSameAddress,
    handleAddressChange,
    handleCheckboxChange,
    handleDefaultShippingChange,
    handleDefaultBillingChange,
  };
}
