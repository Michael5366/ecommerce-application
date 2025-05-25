import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const PROJECT_KEY: string = import.meta.env.VITE_CTP_PROJECT_KEY;
const API_URL: string = import.meta.env.VITE_CTP_API_URL;

export const useApi = () => {
  const navigate = useNavigate();

  const getAccessToken = useCallback(async (): Promise<string> => {
    const storedToken = sessionStorage.getItem('auth_token');
    const authFlag = sessionStorage.getItem('ct_auth_flag');

    if (storedToken && authFlag === 'true') {
      return storedToken;
    }

    throw new Error('Authorization required');
  }, []);

  const makeApiRequest = useCallback(
    async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
      try {
        const token = await getAccessToken();
        const url = new URL(`${API_URL}/${PROJECT_KEY}/${endpoint}`);

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            url.searchParams.append(key, String(value));
          }
        });

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('ct_auth_flag');
          navigate('/login');
          throw new Error('Session expired');
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `API Request Error: status ${response.status}`);
        }

        return response.json() as Promise<T>;
      } catch (err) {
        console.error('API Error:', err);
        throw err;
      }
    },
    [getAccessToken, navigate]
  );

  return { makeApiRequest, getAccessToken };
};
