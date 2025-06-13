import { CartResponse } from "../components/basket/BasketPageConstr";

export const getCartPrices = (cart: CartResponse) => {
  const originalTotalPrice = cart.totalPrice.centAmount / 100;
  
  const discountedAmount = cart.discountOnTotalPrice 
    ? cart.discountOnTotalPrice.discountedAmount.centAmount / 100
    : 0;
  
  const finalTotalPrice = originalTotalPrice - discountedAmount;
  
  return {
    originalTotalPrice,
    discountedAmount,
    finalTotalPrice,
    hasDiscount: !!cart.discountOnTotalPrice
  };
};