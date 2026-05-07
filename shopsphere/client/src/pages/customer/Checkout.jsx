import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { MapPin, CreditCard, ShoppingBag, Lock, Truck, ArrowRight, Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Address', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: ShoppingBag },
];

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: user?.address?.country || 'India',
  });

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + (i.price || i.product?.price || 0) * i.quantity, 0);
  const shippingCharge = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shippingCharge;

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.pincode || !address.country) {
      toast.error('Please fill in complete shipping address'); setStep(1); return;
    }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    try {
      setLoading(true);
      const { data } = await API.post('/orders', { shippingAddress: address, paymentMethod });
      await fetchCart();
      toast.success(`Order placed! Order #${data.data.orderNumber}`);
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(200,169,126,0.08)' }}>
            <ShoppingBag size={36} color="#C8A97E" />
          </div>
          <h3 style={{ fontWeight: 800 }}>Your cart is empty</h3>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Add items to your cart before checking out.</p>
          <button className="btn"
            onClick={() => navigate('/products')}
            style={{ background: 'linear-gradient(135deg, #C8A97E, #B8956A)', color: '#fff', borderRadius: '12px', fontWeight: 700, border: 'none', padding: '0.75rem 2rem' }}>
            Shop Now
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '1.5rem' }}>
        Checkout
      </motion.h2>

      {/* Step Indicator */}
      <div className="d-flex align-items-center justify-content-center gap-0 mb-5">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step >= s.id;
          const isComplete = step > s.id;
          return (
            <div key={s.id} className="d-flex align-items-center">
              <div className="d-flex flex-column align-items-center" style={{ cursor: isComplete ? 'pointer' : 'default' }}
                onClick={() => isComplete && setStep(s.id)}>
                <div className="d-flex align-items-center justify-content-center"
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: isActive ? 'linear-gradient(135deg, #C8A97E, #B8956A)' : '#f0f0f0',
                    color: isActive ? '#fff' : '#999',
                    transition: 'all 0.3s',
                  }}>
                  {isComplete ? <Check size={20} /> : <Icon size={20} />}
                </div>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, marginTop: '0.35rem',
                  color: isActive ? '#C8A97E' : '#999',
                }}>{s.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div style={{
                  width: 60, height: 2, margin: '0 0.5rem',
                  background: step > s.id ? '#C8A97E' : '#e0e0e0',
                  marginBottom: '1.25rem',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-7">
            {/* Step 1: Address */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="card border-0 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <h5 className="d-flex align-items-center gap-2 mb-4" style={{ fontWeight: 800 }}>
                    <MapPin size={20} color="#C8A97E" /> Shipping Address
                  </h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Street Address *</label>
                      <input type="text" className="form-control" name="street" placeholder="House no., Street, Area"
                        value={address.street} onChange={handleChange} required style={{ borderRadius: '12px' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>City *</label>
                      <input type="text" className="form-control" name="city" placeholder="City"
                        value={address.city} onChange={handleChange} required style={{ borderRadius: '12px' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>State *</label>
                      <input type="text" className="form-control" name="state" placeholder="State"
                        value={address.state} onChange={handleChange} required style={{ borderRadius: '12px' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Pincode *</label>
                      <input type="text" className="form-control" name="pincode" placeholder="560001"
                        value={address.pincode} onChange={handleChange} required maxLength={6} style={{ borderRadius: '12px' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Country *</label>
                      <input type="text" className="form-control" name="country"
                        value={address.country} onChange={handleChange} required style={{ borderRadius: '12px' }} />
                    </div>
                  </div>
                  <button type="button" className="btn w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => {
                      if (!address.street || !address.city || !address.state || !address.pincode) {
                        toast.error('Please fill all address fields'); return;
                      }
                      setStep(2);
                    }}
                    style={{ background: '#0a0a0a', color: '#fff', borderRadius: '14px', fontWeight: 700, padding: '0.85rem', border: 'none' }}>
                    Continue to Payment <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="card border-0 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <h5 className="d-flex align-items-center gap-2 mb-4" style={{ fontWeight: 800 }}>
                    <CreditCard size={20} color="#C8A97E" /> Payment Method
                  </h5>
                  <div className="d-flex flex-column gap-3">
                    {[
                      { val: 'COD', title: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: '💵' },
                      { val: 'Online', title: 'Online Payment', sub: 'Coming Soon — UPI, Cards, NetBanking', icon: '💳', disabled: true },
                    ].map((pm) => (
                      <label key={pm.val}
                        className="d-flex align-items-center gap-3 p-3"
                        style={{
                          cursor: pm.disabled ? 'not-allowed' : 'pointer',
                          borderRadius: '14px',
                          border: paymentMethod === pm.val
                            ? '2px solid #C8A97E'
                            : '2px solid rgba(0,0,0,0.06)',
                          background: paymentMethod === pm.val ? 'rgba(200,169,126,0.04)' : '#fff',
                          opacity: pm.disabled ? 0.5 : 1,
                          transition: 'all 0.2s',
                        }}>
                        <input type="radio" name="payment" value={pm.val}
                          checked={paymentMethod === pm.val}
                          onChange={() => !pm.disabled && setPaymentMethod(pm.val)}
                          className="form-check-input" disabled={pm.disabled} />
                        <span style={{ fontSize: '2rem' }}>{pm.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{pm.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#999' }}>{pm.sub}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button type="button" className="btn w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setStep(3)}
                    style={{ background: '#0a0a0a', color: '#fff', borderRadius: '14px', fontWeight: 700, padding: '0.85rem', border: 'none' }}>
                    Review Order <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="card border-0 p-4 mb-3" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="d-flex align-items-center gap-2 mb-0" style={{ fontWeight: 800 }}>
                      <MapPin size={16} color="#C8A97E" /> Deliver to
                    </h6>
                    <button type="button" className="btn btn-sm" onClick={() => setStep(1)}
                      style={{ color: '#C8A97E', fontWeight: 600, fontSize: '0.75rem', border: 'none', background: 'none' }}>Edit</button>
                  </div>
                  <p style={{ color: '#555', fontSize: '0.85rem', marginBottom: 0 }}>
                    {address.street}, {address.city}, {address.state} — {address.pincode}, {address.country}
                  </p>
                </div>
                <div className="card border-0 p-4 mb-3" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="d-flex align-items-center gap-2 mb-0" style={{ fontWeight: 800 }}>
                      <CreditCard size={16} color="#C8A97E" /> Payment
                    </h6>
                    <button type="button" className="btn btn-sm" onClick={() => setStep(2)}
                      style={{ color: '#C8A97E', fontWeight: 600, fontSize: '0.75rem', border: 'none', background: 'none' }}>Edit</button>
                  </div>
                  <p style={{ color: '#555', fontSize: '0.85rem', marginBottom: 0 }}>{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </div>
                <div className="card border-0 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <h6 className="d-flex align-items-center gap-2 mb-3" style={{ fontWeight: 800 }}>
                    <ShoppingBag size={16} color="#C8A97E" /> Items ({items.length})
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {items.map((item) => (
                      <div key={item.product?._id} className="d-flex align-items-center gap-3 py-2"
                        style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <img src={item.product?.images?.[0] || `https://placehold.co/50x50?text=P`}
                          alt={item.product?.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '10px' }}
                          onError={(e) => { e.target.src = 'https://placehold.co/50x50?text=P'; }} />
                        <div className="flex-grow-1">
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.product?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#999' }}>Qty: {item.quantity}</div>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                          ₹{((item.price || item.product?.price) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-5">
            <div className="card border-0 sticky-top p-4" style={{ top: '80px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h5 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: '#999', fontSize: '0.85rem' }}>Subtotal ({items.length} items)</span>
                <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: '#999', fontSize: '0.85rem' }}>Shipping</span>
                <span style={{ fontWeight: 600, color: shippingCharge === 0 ? '#34C759' : '#555' }}>
                  {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                </span>
              </div>
              <hr style={{ borderColor: 'rgba(0,0,0,0.06)' }} />
              <div className="d-flex justify-content-between mb-4">
                <span style={{ fontWeight: 800 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: '1.25rem' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
              {step === 3 && (
                <button type="submit" className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading || paymentMethod === 'Online'}
                  style={{
                    background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                    color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 700, padding: '0.9rem',
                  }}>
                  {loading ? <><span className="spinner-border spinner-border-sm" /> Placing Order...</> : <>
                    <Lock size={16} /> Place Order — ₹{total.toLocaleString('en-IN')}
                  </>}
                </button>
              )}
              {paymentMethod === 'Online' && step === 3 && (
                <p className="text-center mt-2" style={{ color: '#999', fontSize: '0.75rem' }}>
                  Online payment coming soon. Please use COD.
                </p>
              )}
              <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
                <Lock size={13} color="#34C759" />
                <small style={{ color: '#999', fontSize: '0.75rem' }}>Secure checkout • SSL Encrypted</small>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
