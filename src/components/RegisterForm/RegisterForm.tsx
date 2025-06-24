import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import DuplicateEmailModal from './DuplicateEmailModal.tsx';
import {
  getAnonymousToken,
  signUpUser,
  getCustomerToken,
} from '../../services/auth-registration.ts';
import { SignUpPayload } from '../../services/auth-registration.ts';
import { FormErrors } from '../../types/form.ts';
import useRegistrationForm from '../../hooks/useRegistrationForm.ts';
import { registrationSchema } from '../../utils/validateRegistration.ts';
import { ZodError } from 'zod';
import AddressForm from './AddressForm.tsx';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/context.tsx';
import { Path } from '../../types/paths.ts';

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
  const { setToken, token } = useAuth();
  const location = useLocation();
  const from = location.state?.from || Path.MAIN;

  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [token, navigate]);

  const handleCloseModal = () => setShowDuplicateEmailModal(false);

  const handleLoginRedirect = () => {
    navigate(Path.LOGIN);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        } else if (formData.billingAddress.defaultBillingAddress) {
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

      await signUpUser(anonToken, payload);

      const customerToken = await getCustomerToken(formData.email, formData.password);
      setToken(customerToken);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: FormErrors = {};

        err.errors.forEach(({ path, message }) => {
          if (path.length === 1) {
            const key = path[0] as keyof FormErrors;
            fieldErrors[key] = message;
          } else if (path.length > 1) {
            const field = path[0] as 'shippingAddress' | 'billingAddress';
            const subfield = path[1] as keyof typeof formData.shippingAddress;
            if (!fieldErrors[field]) fieldErrors[field] = {};
            fieldErrors[field][subfield] = message;
          }
        });

        setErrors(fieldErrors);
      } else if (err instanceof Error && err.message === 'DuplicateEmail') {
        setShowDuplicateEmailModal(true);
      }
    }
  };

  const handleAnonymousLogin = async () => {
    try {
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
      navigate(Path.MAIN);
    } catch (error) {
      console.debug('Anonymous login error:', error);
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

  const buttonStyle = {
    backgroundColor: '#4D2A80',
    color: '#fff',
    mt: 1,
    transition: '0.3s',
    '&:hover': {
      backgroundColor: '#6B3FB0',
    },
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4, backgroundColor: '#fff' }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom>
            To Good Shop
          </Typography>
          <Typography variant="h5" gutterBottom>
            Sign Up
          </Typography>

          <TextField
            label="First Name"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!(submitted && errors.username)}
            helperText={submitted && errors.username}
          />

          <TextField
            label="Last Name"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!(submitted && errors.surname)}
            helperText={submitted && errors.surname}
          />

          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!(submitted && errors.email)}
            helperText={submitted && errors.email}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!(submitted && errors.password)}
            helperText={submitted && errors.password}
          />

          <TextField
            label="Birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!(submitted && errors.birthday)}
            helperText={submitted && errors.birthday}
          />

          <Box mt={2}>
            <AddressForm
              type="shippingAddress"
              title="Shipping Address"
              address={formData.shippingAddress}
              errors={errors.shippingAddress || {}}
              onChange={handleAddressChange}
            />

            <FormControlLabel
              control={<Checkbox checked={useSameAddress} onChange={handleCheckboxChange} />}
              label="Use the same address for billing"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.shippingAddress.defaultShippingAddress}
                  onChange={handleDefaultShippingChange}
                />
              }
              label="Set as default shipping address"
            />
          </Box>

          {!useSameAddress && (
            <Box mt={2}>
              <AddressForm
                type="billingAddress"
                title="Billing Address"
                address={formData.billingAddress}
                errors={errors.billingAddress || {}}
                onChange={handleAddressChange}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.billingAddress.defaultBillingAddress}
                    onChange={handleDefaultBillingChange}
                  />
                }
                label="Set as default billing address"
              />
            </Box>
          )}

          <Stack direction="column" spacing={2} mt={3}>
            <Button type="submit" sx={buttonStyle}>
              Register
            </Button>
            <Button onClick={handleAnonymousLogin} sx={buttonStyle}>
              Continue as Guest
            </Button>
            <Button onClick={handleLoginRedirect} sx={buttonStyle}>
              Already have an account?
            </Button>
          </Stack>
        </form>
      </Paper>

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
