import { FormData, FormErrors, Address, AddressErrors } from '../types/form';

export const validateRegistration = (formData: FormData, useSameAddress: boolean): FormErrors => {
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
