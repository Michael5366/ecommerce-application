import { useState } from 'react';
import { getAnonymousToken, signUpUser, getCustomerToken } from '../services/auth';
import { SignUpPayload } from '../services/auth';

export type Address = {
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
  defaultShippingAddress?: boolean;
  defaultBillingAddress?: boolean;
};

type FormData = {
  username: string;
  email: string;
  password: string;
  surname: string;
  birthday: string;
  shippingAddress: Address;
  billingAddress: Address;
};

type AddressErrors = Partial<Record<keyof Address, string>>;
type FormErrors = Partial<
  Record<keyof Omit<FormData, 'shippingAddress' | 'billingAddress'>, string>
> & {
  shippingAddress?: AddressErrors;
  billingAddress?: AddressErrors;
};

function RegisterForm() {
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

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);


  const [useSameAddress, setUseSameAddress] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      billingAddress: { ...prev.shippingAddress }, // копируем адрес
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      billingAddress: { streetName: '', city: '', postalCode: '', country: '' },
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
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Введите имя пользователя';
    } else if (!/^[А-Яа-яЁёA-Za-z]+$/.test(formData.username.trim())) {
      newErrors.username = 'Имя должно содержать только буквы';
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailValid.test(formData.email.trim())) {
      newErrors.email = 'Введите корректный email';
    }

    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordValid.test(formData.password.trim())) {
      newErrors.password =
        'Пароль должен быть не менее 8 символов и содержать заглавную букву, строчную и цифру';
    }

    if (!/^[А-Яа-яЁёA-Za-z]+$/.test(formData.surname.trim())) {
      newErrors.surname = 'Фамилия должна содержать только буквы';
    }

    if (!formData.birthday) {
      newErrors.birthday = 'Введите дату рождения';
    } else {
      const birthday = new Date(formData.birthday);
      const age = new Date().getFullYear() - birthday.getFullYear();
      const month = new Date().getMonth() - birthday.getMonth();

      if (age < 14 || (age === 14 && month < 0)) {
        newErrors.birthday = 'Пользователю должно быть больше 14 лет';
      }
    }

    const validateAddress = (address: Address): AddressErrors => {
      const errors: AddressErrors = {};
      if (!address.streetName.trim()) errors.streetName = 'Введите улицу';
      if (!address.city.trim()) errors.city = 'Введите город';
      if (!address.postalCode.trim()) errors.postalCode = 'Введите индекс';
      if (!address.country.trim()) errors.country = 'Выберите страну';
      return errors;
    };

    newErrors.shippingAddress = validateAddress(formData.shippingAddress);
    if (!useSameAddress) {
      newErrors.billingAddress = validateAddress(formData.billingAddress);
    }

    return newErrors;
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setSubmitted(true);

  const validationErrors = validate();
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

      const defaultShippingIndex = formData.shippingAddress.defaultShippingAddress ? 0 : undefined;
      const defaultBillingIndex = formData.billingAddress.defaultBillingAddress
        ? (useSameAddress ? 0 : 1)
        : undefined;

      const sanitizedAddresses = addresses.map(({ defaultShippingAddress, defaultBillingAddress, ...rest }) => rest);

      const payload: SignUpPayload = {
        email: formData.email,
        password: formData.password,
        firstName: formData.username,
        lastName: formData.surname,
        addresses: sanitizedAddresses,
      };

      if (defaultShippingIndex !== undefined) {
        payload.defaultShippingAddress = defaultShippingIndex;
      }

      if (defaultBillingIndex !== undefined) {
        payload.defaultBillingAddress = defaultBillingIndex;
      }

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

      <input name="surname" placeholder="Фамилия" value={formData.surname} onChange={handleChange} />
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
        <input
          type="checkbox"
          checked={useSameAddress}
          onChange={handleCheckboxChange}
        />
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
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, type: 'shippingAddress' | 'billingAddress') => void;
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

      <select 
      name="country"
      value={address.country}
      onChange={(e) => onChange(e, type)}>
        <option value="">-- Выберите --</option>
        <option value="US">США</option>
        <option value="ES">Испания</option>
        <option value="FR">Франция</option>
      </select>
      {errors.country && <p>{errors.country}</p>}
    </div>
  );
}
