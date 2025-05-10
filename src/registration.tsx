import { useState } from "react";

type FormData = {
    username: string;
    email: string;
    password: string;
    surname: string;
    birthday: string;
    address: string;
  };

function RegisterForm() {
    const [formData, setFormData] = useState<FormData>({
      username: "",
      email: "",
      password: "",
      surname: "",
      birthday: "",
      address: "",
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
          newErrors.username = "Введите имя пользователя";
        }
    
        if (!formData.email.includes("@")) {
          newErrors.email = "Введите корректный email";
        }
    
        if (formData.password.length < 8) {
          newErrors.password = "Пароль должен быть не менее 8 символов";
        }
    
        if (!formData.surname.trim()) {
          newErrors.surname = "Введите фамилию";
        }
    
        if (!formData.birthday) {
          newErrors.birthday = "Введите дату рождения";
        }
    
        if (!formData.address.trim()) {
          newErrors.address = "Введите адрес";
        }
    
        return newErrors;
      };
    
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
    
        const validationErrors = validate();
        setErrors(validationErrors);
    
        if (Object.keys(validationErrors).length === 0) {
          console.log("Отправка данных на сервер:", formData);
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
            onChange={handleChange}
          />
          {submitted && errors.email && <p>{errors .email}</p>}
    
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
          />
          {submitted && errors.password && <p>{errors.password}</p>}
    
          <input
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
          />
          {submitted && errors.birthday && <p>{errors.birthday}</p>}
    
          <input
            name="address"
            placeholder="Адрес"
            value={formData.address}
            onChange={handleChange}
          />
          {submitted && errors.address && <p>{errors.address}</p>}
    
          <button type="submit">Зарегистрироваться</button>
        </form>
      );
    }
    
    export default RegisterForm;