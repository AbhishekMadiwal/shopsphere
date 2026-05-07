import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { ArrowLeft, MapPin, CreditCard, Check, XCircle } from 'lucide-react';

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Order not found');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(true);
      const { data } = await API.put(`/orders/${id}/cancel`);
      setOrder(data.data);
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loader text="Loading order details..." />;
  if (!order) return null;

  const currentStepIndex = order.orderStatus === 'Cancelled' ? -1 : STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="container py-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <button className="btn d-flex align-items-center gap-1 p-0 mb-2" onClick={() => navigate('/orders')}
              style={{ color: '#999', fontWeight: 600, fontSize: '0.8rem', border: 'none', background: 'none' }}>
              <ArrowLeft size={16} /> Back to Orders
            </button>
            <h2 style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.25rem' }}>Order Details</h2>
            <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: 0 }}>
              Order #{order.orderNumber} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="d-flex flex-column align-items-end gap-2">
            <OrderStatusBadge status={order.orderStatus} />
            {order.orderStatus === 'Pending' && (
              <button className="btn btn-sm d-flex align-items-center gap-1" onClick={handleCancel} disabled={cancelling}
                style={{ color: '#FF3B30', fontWeight: 600, fontSize: '0.8rem', border: '1.5px solid rgba(255,59,48,0.3)', borderRadius: '10px', background: 'transparent', padding: '0.4rem 1rem' }}>
                {cancelling ? <span className="spinner-border spinner-border-sm" /> : <XCircle size={14} />}
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      {order.orderStatus !== 'Cancelled' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card border-0 mb-4 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h6 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Order Progress</h6>
          <div className="d-flex align-items-center">
            {STATUS_STEPS.map((step, idx) => (
              <div key={step} className="d-flex align-items-center flex-grow-1">
                <div className="d-flex flex-column align-items-center">
                  <div className="d-flex align-items-center justify-content-center"
                    style={{
                      width: 42, height: 42, borderRadius: '50%',
                      background: idx <= currentStepIndex ? 'linear-gradient(135deg, #C8A97E, #B8956A)' : '#f0f0f0',
                      color: idx <= currentStepIndex ? '#fff' : '#bbb', fontWeight: 700, fontSize: '0.85rem',
                      boxShadow: idx === currentStepIndex ? '0 0 0 4px rgba(200,169,126,0.2)' : 'none',
                      transition: 'all 0.3s',
                    }}>
                    {idx < currentStepIndex ? <Check size={18} /> : idx + 1}
                  </div>
                  <span style={{
                    marginTop: '0.5rem', fontWeight: idx <= currentStepIndex ? 700 : 400,
                    color: idx <= currentStepIndex ? '#1a1a1a' : '#bbb', fontSize: '0.75rem',
                  }}>{step}</span>
                </div>
                {idx < STATUS_STEPS.length - 1 && (
                  <div style={{
                    height: 3, flexGrow: 1, margin: '0 0.5rem',
                    background: idx < currentStepIndex ? 'linear-gradient(90deg, #C8A97E, #B8956A)' : '#e0e0e0',
                    borderRadius: 2, marginBottom: 24, transition: 'all 0.3s',
                  }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {order.orderStatus === 'Cancelled' && (
        <div className="card border-0 mb-4 p-4 d-flex flex-row align-items-center gap-3"
          style={{ borderRadius: '16px', background: 'rgba(255,59,48,0.05)', border: '1px solid rgba(255,59,48,0.1)' }}>
          <XCircle size={24} color="#FF3B30" />
          <div>
            <strong style={{ color: '#FF3B30' }}>Order Cancelled</strong>
            <p style={{ color: '#999', fontSize: '0.8rem', marginBottom: 0 }}>This order has been cancelled.</p>
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Items */}
          <div className="card border-0 mb-4 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <h6 style={{ fontWeight: 800, marginBottom: '1rem' }}>Order Items ({order.items?.length})</h6>
            <div className="d-flex flex-column gap-2">
              {order.items?.map((item, idx) => (
                <div key={idx} className="d-flex align-items-center gap-3 py-2"
                  style={{ borderBottom: idx < order.items.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                  <img src={item.image || 'https://placehold.co/60x60?text=P'} alt={item.name}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '12px', background: '#f5f5f5' }}
                    onError={(e) => { e.target.src = 'https://placehold.co/60x60?text=P'; }} />
                  <div className="flex-grow-1">
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="card border-0 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <h6 style={{ fontWeight: 800, marginBottom: '1rem' }}>Status Timeline</h6>
            {[...order.statusHistory].reverse().map((hist, idx) => (
              <div key={idx} className="d-flex gap-3 mb-3">
                <div className="d-flex flex-column align-items-center">
                  <div className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: idx === 0 ? 'linear-gradient(135deg, #C8A97E, #B8956A)' : '#f0f0f0',
                      color: idx === 0 ? '#fff' : '#bbb', fontSize: '0.7rem',
                    }}>
                    {hist.status === 'Delivered' ? <Check size={14} /> : hist.status === 'Cancelled' ? <XCircle size={14} /> : '●'}
                  </div>
                  {idx < order.statusHistory.length - 1 && (
                    <div style={{ width: 2, flexGrow: 1, background: '#e0e0e0', minHeight: 20 }} />
                  )}
                </div>
                <div className="pb-2">
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{hist.status}</div>
                  {hist.note && <div style={{ fontSize: '0.75rem', color: '#999' }}>{hist.note}</div>}
                  <div style={{ fontSize: '0.7rem', color: '#bbb' }}>
                    {new Date(hist.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          {/* Address */}
          <div className="card border-0 mb-3 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <h6 className="d-flex align-items-center gap-2" style={{ fontWeight: 800, marginBottom: '0.75rem' }}>
              <MapPin size={16} color="#C8A97E" /> Shipping Address
            </h6>
            <address style={{ color: '#555', fontSize: '0.85rem', marginBottom: 0, lineHeight: 1.7 }}>
              <strong>{order.user?.name}</strong><br />
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
              {order.shippingAddress?.pincode}, {order.shippingAddress?.country}
            </address>
          </div>

          {/* Payment */}
          <div className="card border-0 mb-3 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <h6 className="d-flex align-items-center gap-2" style={{ fontWeight: 800, marginBottom: '0.75rem' }}>
              <CreditCard size={16} color="#C8A97E" /> Payment
            </h6>
            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: '#999', fontSize: '0.8rem' }}>Method</span>
              <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{order.paymentMethod}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span style={{ color: '#999', fontSize: '0.8rem' }}>Status</span>
              <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-success' : order.paymentStatus === 'Failed' ? 'bg-danger' : ''}`}
                style={order.paymentStatus !== 'Paid' && order.paymentStatus !== 'Failed' ? { background: 'rgba(255,149,0,0.12)', color: '#FF9500', fontWeight: 700 } : {}}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="card border-0 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <h6 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Price Details</h6>
            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: '#999', fontSize: '0.85rem' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: '#999', fontSize: '0.85rem' }}>Shipping</span>
              <span style={{ fontWeight: 600, color: order.shippingCharge === 0 ? '#34C759' : '#555' }}>
                {order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: '#999', fontSize: '0.85rem' }}>Discount</span>
                <span style={{ color: '#34C759', fontWeight: 600 }}>-₹{order.discount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <hr style={{ borderColor: 'rgba(0,0,0,0.06)' }} />
            <div className="d-flex justify-content-between">
              <span style={{ fontWeight: 800 }}>Total</span>
              <span style={{ fontWeight: 900, fontSize: '1.25rem' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
