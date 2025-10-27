import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [currentGift, setCurrentGift] = useState(null);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
          }
        ];
      }
    });
  };

  const updateCartQuantity = (index, change) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      const item = { ...newCart[index] };
      item.quantity += change;

      if (item.quantity <= 0) {
        newCart.splice(index, 1);
      } else {
        newCart[index] = item;
      }

      return newCart;
    });
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cart,
    currentBooking,
    currentGift,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    setCurrentBooking,
    setCurrentGift
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};