export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}
