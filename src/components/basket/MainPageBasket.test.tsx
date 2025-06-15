import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateCardEnter } from './MainPageBasket';
import { getAnonymousToken } from '../../services/auth-registration';
import { getOrUpdateCustomerCart } from '../../services/Basket/updateBasket';

// 🔧 Мокаем зависимости
vi.mock('../../services/auth-registration', () => ({
  getAnonymousToken: vi.fn(),
}));

vi.mock('../../services/Basket/updateBasket', () => ({
  getOrUpdateCustomerCart: vi.fn(),
}));

describe('CreateCardEnter', () => {
  beforeEach(() => {
    // очищаем моки перед каждым тестом
    vi.resetAllMocks();
    sessionStorage.clear();
  });

  it('renders promo block and calls async cart logic', async () => {
    // 🔧 подготавливаем моки
    (getAnonymousToken as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    (getOrUpdateCustomerCart as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'mockCartId',
      version: 1,
    });

    // без токена — вызовет getAnonymousToken
    render(<CreateCardEnter />);

    // 🔍 проверяем что текст отрендерился
    expect(screen.getByText('Promo-codes')).toBeInTheDocument();
    expect(screen.getByText('Scopes')).toBeInTheDocument();
    expect(screen.getByText('RS')).toBeInTheDocument();

    // ⏳ ждём выполнения useEffect
    await waitFor(() => {
      expect(getAnonymousToken).toHaveBeenCalledTimes(1);
      expect(getOrUpdateCustomerCart).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call getAnonymousToken if auth_token is present', async () => {
    sessionStorage.setItem('auth_token', 'test-token');
    (getOrUpdateCustomerCart as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'cart123',
      version: 1,
    });

    render(<CreateCardEnter />);

    await waitFor(() => {
      expect(getAnonymousToken).not.toHaveBeenCalled();
      expect(getOrUpdateCustomerCart).toHaveBeenCalled();
    });
  });
});
