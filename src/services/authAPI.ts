const PROJECT_KEY = import.meta.env.VITE_APP_CTP_PROJECT_KEY;

export const loginUser = async (email: string, password: string) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', email.trim());
  params.append('password', password);
  params.append('scope', `manage_customers:${PROJECT_KEY} manage_my_profile:${PROJECT_KEY}`);
};
