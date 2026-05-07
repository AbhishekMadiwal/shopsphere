import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/CartItem';
import Loader from '../../components/Loader';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Tag } from 'lucide-react';

const Cart = () => {
  const { cart, cartLoading, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartLoading) return <Loader text="Loading your cart..." />;

  const items = cart?.items || [];
  const total = cart?.totalAmount || 0;
  const FREE_SHIPPING_THRESHOLD = 500;
  const shippingProgress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const freeShipping = total >= FREE_SHIPPING_THRESHOLD;

  const handleClearCart = async () => {
    if (!window.confirm('Remove all items from cart?')) return;
    try { await clearCart(); toast.success('Cart cleared'); }
    catch { toast.error('Failed to clear cart'); }
  };

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-5"
        >
          <div className="d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(200,169,126,0.08)' }}>
            <ShoppingBag size={42} color="#C8A97E" />
          </div>
          <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Your cart is empty</h3>
          <p style={{ color: '#999', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
            Looks like you haven't added anything to your cart yet. Start shopping to find amazing deals!
          </p>
          <Link to="/products" className="btn btn-lg d-inline-flex align-items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #C8A97E, #B8956A)', color: '#fff',
              border: 'none', borderRadius: '14px', fontWeight: 700, padding: '0.9rem 2rem',
            }}>
            Start Shopping <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <motion.h2
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '1.5rem' }}>
        Shopping Cart <span style={{ color: '#999', fontWeight: 500, fontSize: '1rem' }}>({items.length} items)</span>
      </motion.h2>

      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          <AnimatePresence>
            {items.map((item) => (
              <CartItem key={item.product?._id} item={item} />
            ))}
          </AnimatePresence>

          <div className="d-flex justify-content-between mt-3">
            <Link to="/products" className="btn d-flex align-items-center gap-1"
              style={{ border: '1.5px solid #e0e0e0', borderRadius: '10px', fontWeight: 600, fontSize: '0.8rem', color: '#555', padding: '0.5rem 1rem' }}>
              Continue Shopping
            </Link>
            <button className="btn d-flex align-items-center gap-1"
              onClick={handleClearCart}
              style={{ color: '#FF3B30', fontWeight: 600, fontSize: '0.8rem', border: 'none', background: 'none' }}>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: '80px' }}>
            <div className="card border-0 p-4"
              style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', background: '#fff' }}>
              <h5 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>Order Summary</h5>

              {/* Free Shipping Progress */}
              <div className="mb-4 p-3"
                style={{ background: freeShipping ? 'rgba(52,199,89,0.06)' : 'rgba(200,169,126,0.06)', borderRadius: '12px' }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Truck size={16} color={freeShipping ? '#34C759' : '#C8A97E'} />
                  <span style={{ fontWeight: 600, fontSize: '0.8rem', color: freeShipping ? '#34C759' : '#555' }}>
                    {freeShipping ? 'You have free shipping!' : `₹${(FREE_SHIPPING_THRESHOLD - total).toLocaleString('en-IN')} away from free shipping`}
                  </span>
                </div>
                <div className="progress" style={{ height: 4 }}>
                  <div className="progress-bar bg-warning" style={{ width: `${shippingProgress}%`, transition: 'width 0.5s' }} />
                </div>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: '#999', fontSize: '0.85rem' }}>Subtotal</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: '#999', fontSize: '0.85rem' }}>Shipping</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: freeShipping ? '#34C759' : '#555' }}>
                  {freeShipping ? 'FREE' : '₹49'}
                </span>
              </div>
              <hr style={{ borderColor: 'rgba(0,0,0,0.06)' }} />
              <div className="d-flex justify-content-between mb-4">
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#0a0a0a' }}>
                  ₹{(total + (freeShipping ? 0 : 49)).toLocaleString('en-IN')}
                </span>
              </div>

              <button className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => navigate('/checkout')}
                style={{
                  background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                  color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 700, padding: '0.9rem',
                }}>
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
                <ShieldCheck size={14} color="#34C759" />
                <small style={{ color: '#999', fontSize: '0.75rem' }}>Secure checkout • SSL Encrypted</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
