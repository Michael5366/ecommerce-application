import { useEffect } from 'react';

const MainPage = () => {
  const clientId = import.meta.env.VITE_CTP_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  console.log(clientId, clientSecret, projectKey);

  const authUrl = 'https://auth.europe-west1.gcp.commercetools.com/oauth/token';
  const apiUrl = `https://api.europe-west1.gcp.commercetools.com/${projectKey}/product-projections`;

  useEffect(() => {
    const fetchProducts = async () => {
      const authResponse = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        },
        body: 'grant_type=client_credentials',
      });

      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        console.error('Error auth:', authResponse.status, errorText);
        return;
      }

      const authData = await authResponse.json();
      console.log('authData:', authData);

      const accessToken = authData.access_token;
      console.log('accessToken: ', accessToken);

      const prodResponse = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const productsData = await prodResponse.json();
      console.log('Товары:', productsData);
    };
    fetchProducts();
  }, []);
  return <div>Main page</div>;
};
export default MainPage;
