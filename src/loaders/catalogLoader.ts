const fetchProductsData = async () => {
  const clientId = import.meta.env.VITE_CTP_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

  const authUrl = 'https://auth.europe-west1.gcp.commercetools.com/oauth/token';
  const apiUrl = `https://api.europe-west1.gcp.commercetools.com/${projectKey}/product-projections?limit=100`;

  try {
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      },
      body: 'grant_type=client_credentials',
    });

    if (!authResponse.ok) {
      throw new Response('Failed to fetch auth', { status: authResponse.status });
    }

    const authData = await authResponse.json();

    const accessToken = authData.access_token;

    const prodResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!prodResponse.ok) {
      throw new Response('Failed to fetch products', { status: prodResponse.status });
    }

    const products = await prodResponse.json();
    return products.results;
  } catch (error) {
    console.debug('Error fetching products:', error);
  }
};

export default fetchProductsData;
