import { useState } from 'react';
import { getAnonymousToken, signUpUser, getCustomerToken } from '../services/auth';
import { SignUpPayload } from '../services/auth';
import { Address, AddressErrors, FormErrors } from '../types/form';
import useRegistrationForm from '../hooks/useRegistrationForm';
import { validateRegistration } from '../utils/validateRegistration';



function RegisterForm() {
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

        const payload: SignUpPayload = {
          email: formData.email,
          password: formData.password,
          firstName: formData.username,
          lastName: formData.surname,
          addresses: sanitizedAddresses,
          ...(formData.shippingAddress.defaultShippingAddress ? { defaultShippingAddress: 0 } : {}),
          ...(formData.billingAddress.defaultBillingAddress
            ? { defaultBillingAddress: useSameAddress ? 0 : 1 }
            : {}),
        };

        console.log('Данные для регистрации:', payload);

        await signUpUser(anonToken, payload);

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
      <button style={{ backgroundColor: 'violet' }}>Войти без регистрации</button>
    </form>
  );
}

export default RegisterForm;

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

function AddressForm({ type, title, address, errors, onChange }: AddressFormProps) {
  return (
    <div className="adress-block">
      <h3>{title}</h3>
      <input
        name="streetName"
        placeholder="Улица"
        value={address.streetName}
        onChange={(e) => onChange(e, type)}
      />
      {errors.streetName && <p>{errors.streetName}</p>}

      <input
        name="city"
        placeholder="Город"
        value={address.city}
        onChange={(e) => onChange(e, type)}
      />
      {errors.city && <p>{errors.city}</p>}

      <input
        name="postalCode"
        placeholder="Почтовый индекс"
        value={address.postalCode}
        onChange={(e) => onChange(e, type)}
      />
      {errors.postalCode && <p>{errors.postalCode}</p>}

      <select name="country" value={address.country} onChange={(e) => onChange(e, type)}>
        <option value="">-- Выберите --</option>
        <option value="US">США</option>
        <option value="ES">Испания</option>
        <option value="FR">Франция</option>
      </select>
      {errors.country && <p>{errors.country}</p>}
    </div>
  );
}
