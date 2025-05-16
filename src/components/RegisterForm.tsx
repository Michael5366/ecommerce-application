import { useState } from 'react';
import { getAnonymousToken, signUpUser, getCustomerToken } from '../services/auth';
import { SignUpPayload } from '../services/auth';
import { FormErrors } from '../types/form';
import useRegistrationForm from '../hooks/useRegistrationForm';
import { validateRegistration } from '../utils/validateRegistration';
import AddressForm from './AddressForm';

export default function RegisterForm() {
  const {
    formData,
    setFormData,
    useSameAddress,
    handleAddressChange,
    handleCheckboxChange,
    handleDefaultShippingChange,
    handleDefaultBillingChange,
  } = useRegistrationForm();

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('handleSubmit вызван');
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = validateRegistration(formData, useSameAddress);
    setErrors(validationErrors);
    console.log('Ошибки:', validationErrors);

    const hasErrors = Object.values(validationErrors).some(
      (val) => typeof val === 'string' || (typeof val === 'object' && Object.keys(val).length)
    );

    if (!hasErrors) {
      try {
        const anonToken = await getAnonymousToken();

        const addresses = useSameAddress
          ? [formData.shippingAddress]
          : [formData.shippingAddress, formData.billingAddress];

        const sanitizedAddresses = addresses.map((addr) => {
          const copy = { ...addr };
          delete copy.defaultShippingAddress;
          delete copy.defaultBillingAddress;
          return copy;
        });

let defaultShippingAddress: number | undefined;
let defaultBillingAddress: number | undefined;

if (useSameAddress) {
  if (formData.shippingAddress.defaultShippingAddress || formData.billingAddress.defaultBillingAddress) {
    defaultShippingAddress = 0;
    defaultBillingAddress = 0;
  }
} else {
  defaultShippingAddress = formData.shippingAddress.defaultShippingAddress ? 0 : undefined;
  defaultBillingAddress = formData.billingAddress.defaultBillingAddress ? 1 : undefined;
}

const payload: SignUpPayload = {
  email: formData.email,
  password: formData.password,
  firstName: formData.username,
  lastName: formData.surname,
  addresses: sanitizedAddresses,
  ...(defaultShippingAddress !== undefined ? { defaultShippingAddress } : {}),
  ...(defaultBillingAddress !== undefined ? { defaultBillingAddress } : {}),
};

        console.log('Данные для регистрации:', payload);
        console.log('Отправляем payload:', {
            addresses: sanitizedAddresses,
            defaultShippingAddress,
            defaultBillingAddress,
        });
        await signUpUser(anonToken, payload);
        console.log(formData.billingAddress.defaultBillingAddress);
        const customerToken = await getCustomerToken(formData.email, formData.password);
        console.log('Успешно авторизован:', customerToken);
      } catch (e) {
        console.error('Ошибка регистрации:', e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>

      <input name="username" placeholder="Имя" value={formData.username} onChange={handleChange} />
      {submitted && errors.username && <p>{errors.username}</p>}

      <input
        name="surname"
        placeholder="Фамилия"
        value={formData.surname}
        onChange={handleChange}
      />
      {submitted && errors.surname && <p>{errors.surname}</p>}

      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      {submitted && errors.email && <p>{errors.email}</p>}

      <input
        name="password"
        type="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={handleChange}
      />
      {submitted && errors.password && <p>{errors.password}</p>}

      <input name="birthday" type="date" value={formData.birthday} onChange={handleChange} />
      {submitted && errors.birthday && <p>{errors.birthday}</p>}

      <AddressForm
        type="shippingAddress"
        title="Адрес доставки"
        address={formData.shippingAddress}
        errors={errors.shippingAddress || {}}
        onChange={handleAddressChange}
      />

      <label>
        <input type="checkbox" checked={useSameAddress} onChange={handleCheckboxChange} />
        Использовать тот же адрес для выставления счетов
      </label>

      <label>
        <input
          type="checkbox"
          checked={formData.shippingAddress.defaultShippingAddress}
          onChange={handleDefaultShippingChange}
        />
        Сделать дефолтным адресом доставки
      </label>

      <AddressForm
        type="billingAddress"
        title="Адрес для выставления счетов"
        address={useSameAddress ? formData.shippingAddress : formData.billingAddress}
        errors={errors.billingAddress || {}}
        onChange={handleAddressChange}
      />

      <label>
        <input
          type="checkbox"
          checked={formData.billingAddress.defaultBillingAddress}
          onChange={handleDefaultBillingChange}
        />
        Сделать дефолтным адресом для платежей
      </label>

      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}