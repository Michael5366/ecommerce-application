import { useState } from 'react';
import DuplicateEmailModal from './DuplicateEmailModal';
import { getAnonymousToken, signUpUser, getCustomerToken } from '../services/auth-registration';
import { SignUpPayload } from '../services/auth-registration';
import { FormErrors } from '../types/form';
import useRegistrationForm from '../hooks/useRegistrationForm';
import { registrationSchema } from '../utils/validateRegistration';
import { ZodError } from 'zod';
import AddressForm from './AddressForm';
import '../styles/cssRegistration.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/context.tsx';
import { useLocation } from 'react-router-dom';
import { Path } from '../types/paths.ts';
import { useEffect } from 'react';

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
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { token } = useAuth();
  const location = useLocation();
  const from = location.state?.from || Path.MAIN;

  useEffect(() => {
    if (token) {
      navigate(Path.MAIN, { replace: true });
    }
  }, [token, navigate]);

  const handleCloseModal = () => setShowDuplicateEmailModal(false);

  const handleLoginRedirect = () => {
    navigate(Path.LOGIN);
    // console.log('Redirecting to /login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      registrationSchema.parse({ ...formData, useSameAddress });

      setErrors({});

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
        } else if (formData.shippingAddress.defaultShippingAddress) {
          defaultShippingAddress = 0;
          defaultBillingAddress = undefined;
        } else if (formData.billingAddress.defaultBillingAddress) {
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
        dateOfBirth: formData.birthday,
        ...(defaultShippingAddress !== undefined ? { defaultShippingAddress } : {}),
        ...(defaultBillingAddress !== undefined ? { defaultBillingAddress } : {}),
      };

      // console.log('Registration data:', payload);
      // console.log('Sending payload:', {
      //   addresses: sanitizedAddresses,
      //   defaultShippingAddress,
      //   defaultBillingAddress,
      // });
      await signUpUser(anonToken, payload);

      const customerToken = await getCustomerToken(formData.email, formData.password);
      setToken(customerToken);
      navigate(from, { replace: true });
      // console.log('Successfully authenticated:', customerToken);
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
        // console.error('Registration error:', err);
      }
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      // const token = await getAnonymousToken();
      // console.log('Redirecting to main page', token);
      Toastify({
        text: 'Success! Anonymous login in progress',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        style: {
          background: '#42ff9e',
          color: '#fff',
        },
      }).showToast();
      {
        navigate(Path.MAIN);
      }
    } catch (error) {
      console.error('Anonymous login error:', error);
      Toastify({
        text: 'Anonymous login failed, please try again later',
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
        <h1>To Good Shop</h1>
        <h2>Sign Up</h2>
        <input
          name="username"
          placeholder="First Name"
          value={formData.username}
          onChange={handleChange}
        />
        {submitted && errors.username && <p className="errors">{errors.username}</p>}
        <input
          name="surname"
          placeholder="Last Name"
          value={formData.surname}
          onChange={handleChange}
        />
        {submitted && errors.surname && <p className="errors">{errors.surname}</p>}
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        {submitted && errors.email && <p className="errors">{errors.email}</p>}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {submitted && errors.password && <p className="errors">{errors.password}</p>}
        <input name="birthday" type="date" value={formData.birthday} onChange={handleChange} />
        {submitted && errors.birthday && <p className="errors">{errors.birthday}</p>}
        <div className="address-section">
          <AddressForm
            type="shippingAddress"
            title="Shipping Address"
            address={formData.shippingAddress}
            errors={errors.shippingAddress || {}}
            onChange={handleAddressChange}
          />
          <label>
            <input type="checkbox" checked={useSameAddress} onChange={handleCheckboxChange} />
            Use the same address for billing
          </label>
          <label>
            <input
              type="checkbox"
              checked={formData.shippingAddress.defaultShippingAddress}
              onChange={handleDefaultShippingChange}
            />
            Set as default shipping address
          </label>
        </div>
        <div className="address-section">
          <AddressForm
            type="billingAddress"
            title="Billing Address"
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
            Set as default billing address
          </label>
        </div>
        <div className="buttons-block">
          <button className="button-reg" type="submit">
            Register
          </button>
          <button className="button-reg" type="button" onClick={handleAnonymousLogin}>
            Continue as Guest
          </button>
          <button className="button-reg" type="button" onClick={handleLoginRedirect}>
            Already have an account?
          </button>
        </div>
      </form>
      {/*{console.log('showDuplicateEmailModal =', showDuplicateEmailModal)}*/}
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
