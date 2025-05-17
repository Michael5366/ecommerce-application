import { useState } from 'react';
import DuplicateEmailModal from './DuplicateEmailModal';
import { getAnonymousToken, signUpUser, getCustomerToken } from '../services/auth';
import { SignUpPayload } from '../services/auth';
import { FormErrors } from '../types/form';
import useRegistrationForm from '../hooks/useRegistrationForm';
import { registrationSchema } from '../utils/validateRegistration';
import { ZodError } from 'zod';
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

  const [showDuplicateEmailModal, setShowDuplicateEmailModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleCloseModal = () => setShowDuplicateEmailModal(false);

  const handleLoginRedirect = () => {
    // navigate('/login');
    console.log('Редирект на /login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      registrationSchema.parse({ ...formData, useSameAddress });

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
        if (
          formData.shippingAddress.defaultShippingAddress &&
          formData.billingAddress.defaultBillingAddress
        ) {
          defaultShippingAddress = 0;
          defaultBillingAddress = 0;
        } else if (
          formData.shippingAddress.defaultShippingAddress
        ) {
          defaultShippingAddress = 0;
          defaultBillingAddress = undefined
        } else if (
          formData.billingAddress.defaultBillingAddress
        ) {
          defaultShippingAddress = undefined;
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

      const customerToken = await getCustomerToken(formData.email, formData.password);
      console.log('Успешно авторизован:', customerToken);
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: FormErrors = {};

        err.errors.forEach(({ path, message }) => {
          if (path.length === 1) {
            const key = path[0] as keyof FormErrors;
            fieldErrors[key] = message;
          } else if (path.length > 1) {
            const field = path[0] as 'shippingAddress' | 'billingAddress';
            const subfield = path[1] as keyof AddressErrors;

            if (!fieldErrors[field]) {
              fieldErrors[field] = {};
            }
            (fieldErrors[field] as AddressErrors)[subfield] = message;
          }
        });

        setErrors(fieldErrors);
      } else if (err instanceof Error && err.message === 'DuplicateEmail') {
        setShowDuplicateEmailModal(true);
      } else {
        console.error('Ошибка при регистрации:', err);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Регистрация</h2>
        <input
          name="username"
          placeholder="Имя"
          value={formData.username}
          onChange={handleChange}
        />
        {submitted && errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        <input
          name="surname"
          placeholder="Фамилия"
          value={formData.surname}
          onChange={handleChange}
        />
        {submitted && errors.surname && <p style={{ color: 'red' }}>{errors.surname}</p>}
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        {submitted && errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
        />
        {submitted && errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        <input name="birthday" type="date" value={formData.birthday} onChange={handleChange} />
        {submitted && errors.birthday && <p style={{ color: 'red' }}>{errors.birthday}</p>}
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
        (
        <>
          <AddressForm
            type="billingAddress"
            title="Адрес для выставления счетов"
            address={formData.billingAddress}
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
        </>
        )<button type="submit">Зарегистрироваться</button>
      </form>
      {console.log('showDuplicateEmailModal =', showDuplicateEmailModal)}
      {showDuplicateEmailModal && (
        <DuplicateEmailModal
          isOpen={showDuplicateEmailModal}
          onClose={handleCloseModal}
          onLoginRedirect={handleLoginRedirect}
        />
      )}
    </>
  );
}
