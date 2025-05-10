import { useState } from 'react';

type FormData = {
  username: string;
  email: string;
  password: string;
  surname: string;
  birthday: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    surname: '',
    birthday: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    
  });

  type FormErrors = Partial<Record<keyof FormData, string>>;

  const [errors, setErrors] = useState<FormErrors>({} as FormErrors);
  const [submitted, setSubmitted] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
        newErrors.username = 'Введите имя пользователя';
      } else if (!/^[А-Яа-яЁёA-Za-z]+$/.test(formData.username.trim())) {
        newErrors.username = 'Имя должно содержать только буквы, без цифр и спец. символов';
      }
    
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailValid.test(formData.email.trim())) {
      newErrors.email = 'Введите корректный email (например, example@mail.com)';
    }
    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordValid.test(formData.password.trim())) {
      newErrors.password = 'Пароль должен быть не менее 8 символов, содержать как минимум одну заглавную букву, одну строчную и одну цифру';
    }

    if (!/^[А-Яа-яЁёA-Za-z]+$/.test(formData.username.trim())) {
      newErrors.surname = 'Введите фамилию без спецфсимволов и цифр';
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

    if (!formData.street.trim()) {
      newErrors.street = 'Введите улицу';
    }
    if (!/^[А-Яа-яЁёA-Za-z]+$/.test(formData.username.trim())) {
        newErrors.city = 'Введите город';
    }
    if (!formData.postalCode.trim()) {
        newErrors.postalCode = 'Введите почтовый индекс';
    }

    if (!formData.country.trim()) {
        newErrors.country = 'Введите страну';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);


    const validationErrors = validate();
    setErrors(validationErrors);

    console.log('Ошибки:', validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log('Отправка данных на сервер:', formData);
      // API
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>

      <input
        name="username"
        placeholder="Имя пользователя"
        value={formData.username}
        onChange={handleChange}
      />
      {submitted && errors.username && <p>{errors.username}</p>}

      <input
        name="surname"
        placeholder="Фамилия"
        value={formData.surname}
        onChange={handleChange}
      />
      {submitted && errors.surname && <p>{errors.surname}</p>}

      <input 
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange} />
      {submitted && errors.email && <p>{errors.email}</p>}

      <input
        name="password"
        type="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={handleChange}
      />
      {submitted && errors.password && <p>{errors.password}</p>}

      <input name="birthday"
      type="date"
      value={formData.birthday}
      onChange={handleChange} />
      {submitted && errors.birthday && <p>{errors.birthday}</p>}

      <input name="street"
      placeholder="Улица"
      value={formData.street}
      onChange={handleChange} />
      {submitted && errors.street && <p>{errors.street}</p>}

      <input name="city"
      placeholder="Город"
      value={formData.city}
      onChange={handleChange} />
      {submitted && errors.city && <p>{errors.city}</p>}

      <input name="postalCode"
      placeholder="Почтовый индекс"
      value={formData.postalCode}
      onChange={handleChange} />
      {submitted && errors.postalCode && <p>{errors.postalCode}</p>}

      <input name="country"
      placeholder="Страна"
      value={formData.country}
      onChange={handleChange} />
      {submitted && errors.country && <p>{errors.country}</p>}

      <button type="submit">Зарегистрироваться</button>
      <button style={{backgroundColor: 'violet'}}>Войти без регистрации</button>
    </form>
  );
}

export default RegisterForm;
