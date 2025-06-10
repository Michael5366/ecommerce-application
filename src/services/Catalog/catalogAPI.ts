import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const PROJECT_KEY: string = import.meta.env.VITE_CTP_PROJECT_KEY;
const API_URL: string = import.meta.env.VITE_CTP_API_URL;
const AUTH_URL: string = import.meta.env.VITE_CTP_AUTH_URL;
const CLIENT_ID: string = import.meta.env.VITE_CTP_CLIENT_ID;
const CLIENT_SECRET: string = import.meta.env.VITE_CTP_CLIENT_SECRET;
const ANONYMOUS_ID: string | undefined = import.meta.env.VITE_CTP_ANONYMOUS_ID;

export const getAnonymousToken = async (): Promise<string> => {
  try {
    const authParams = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: `view_products:${PROJECT_KEY} view_categories:${PROJECT_KEY} manage_my_orders:${PROJECT_KEY}`,
    });

    const authHeader = ANONYMOUS_ID
      ? `Basic ${btoa(`${ANONYMOUS_ID}:${CLIENT_SECRET}`)}`
      : `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`;

    const response = await fetch(`${AUTH_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: authHeader,
      },
      body: authParams,
    });

    if (!response.ok) {
      throw new Error('Failed to get anonymous token');
    }

    return (await response.json()).access_token;
  } catch (error) {
    console.error('Error getting anonymous token:', error);
    throw new Error('Failed to authenticate anonymously');
  }
};

export const useApi = () => {
  const navigate = useNavigate();

  const makeApiRequest = useCallback(
    async <T>(
      endpoint: string,
      params: Record<string, string> = {},
      requireAuth: boolean = false
    ): Promise<T> => {
      try {
        const url = new URL(`${API_URL}/${PROJECT_KEY}/${endpoint}`);

        Object.entries(params).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, value);
        });

        if (!requireAuth) {
          try {
            const anonymousToken = await getAnonymousToken();
            const anonymousResponse = await fetch(url.toString(), {
              headers: {
                Authorization: `Bearer ${anonymousToken}`,
                'Content-Type': 'application/json',
              },
            });

            if (anonymousResponse.ok) {
              return anonymousResponse.json() as Promise<T>;
            }
          } catch {}
        }

        const storedToken = sessionStorage.getItem('auth_token');
        if (requireAuth && !storedToken) {
          navigate('/login');
          throw new Error('Authorization required');
        }

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${storedToken || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('ct_auth_flag');

          if (requireAuth) {
            navigate('/login');
            throw new Error('Session expired');
          }

          const anonymousToken = await getAnonymousToken();
          const retryResponse = await fetch(url.toString(), {
            headers: {
              Authorization: `Bearer ${anonymousToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!retryResponse.ok) {
            throw new Error('Failed to fetch data');
          }
          return retryResponse.json() as Promise<T>;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        return response.json() as Promise<T>;
      } catch (error) {
        console.error(`API Error in ${endpoint}:`, error);
        throw error;
      }
    },
    [navigate]
  );

  return { makeApiRequest };
};
