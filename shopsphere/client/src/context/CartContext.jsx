import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) { setCart({ items: [], totalAmount: 0 }); return; }
    try {
      setCartLoading(true);
      const { data } = await API.get('/cart');
      setCart(data.data);
    } catch { setCart({ items: [], totalAmount: 0 }); }
    finally { setCartLoading(false); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await API.post('/cart/add', { productId, quantity });
    setCart(data.data);
    return data;
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await API.put('/cart/update', { productId, quantity });
    setCart(data.data);
    return data;
  };

  const removeFromCart = async (productId) => {
    const { data } = await API.delete(`/cart/remove/${productId}`);
    setCart(data.data);
    return data;
  };

  const clearCart = async () => {
    const { data } = await API.delete('/cart/clear');
    setCart(data.data);
    return data;
  };

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartCount, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
