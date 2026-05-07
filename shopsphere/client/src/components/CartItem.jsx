import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const product = item.product;
  const imageUrl = product?.images?.[0] || `https://placehold.co/100x100?text=Product`;

  const handleQtyChange = async (newQty) => {
    if (newQty < 1) return;
    try {
      setUpdating(true);
      await updateQuantity(product._id, newQty);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await removeFromCart(product._id);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
      setRemoving(false);
    }
  };

  return (
    <AnimatePresence>
      {!removing && (
        <motion.div
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-3"
        >
          <div className="card border-0"
            style={{
              borderRadius: '14px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div className="card-body p-3">
              <div className="row align-items-center g-3">
                {/* Image */}
                <div className="col-3 col-md-2">
                  <Link to={`/products/${product?._id}`}>
                    <img
                      src={imageUrl}
                      alt={product?.name}
                      className="img-fluid"
                      style={{
                        height: 80, width: 80, objectFit: 'cover',
                        borderRadius: '12px', background: '#f5f5f5',
                      }}
                      onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Product'; }}
                    />
                  </Link>
                </div>

                {/* Info */}
                <div className="col-9 col-md-4">
                  <Link to={`/products/${product?._id}`} className="text-decoration-none">
                    <h6 className="mb-1" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a' }}>
                      {product?.name}
                    </h6>
                  </Link>
                  {product?.brand && (
                    <small style={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {product.brand}
                    </small>
                  )}
                  {product?.stock < 5 && product?.stock > 0 && (
                    <div><small style={{ color: '#FF9500', fontWeight: 600, fontSize: '0.75rem' }}>Only {product.stock} left!</small></div>
                  )}
                </div>

                {/* Quantity */}
                <div className="col-6 col-md-3">
                  <div className="d-flex align-items-center gap-0"
                    style={{
                      border: '1.5px solid #e0e0e0',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      width: 'fit-content',
                    }}
                  >
                    <button
                      className="btn border-0 p-0 d-flex align-items-center justify-content-center"
                      style={{ width: 34, height: 34, background: '#f7f7f7' }}
                      onClick={() => handleQtyChange(item.quantity - 1)}
                      disabled={updating || item.quantity <= 1}
                    >
                      <Minus size={14} color="#555" />
                    </button>
                    <motion.span
                      key={item.quantity}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="px-3"
                      style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: 36, textAlign: 'center' }}
                    >
                      {item.quantity}
                    </motion.span>
                    <button
                      className="btn border-0 p-0 d-flex align-items-center justify-content-center"
                      style={{ width: 34, height: 34, background: '#f7f7f7' }}
                      onClick={() => handleQtyChange(item.quantity + 1)}
                      disabled={updating || item.quantity >= (product?.stock || 99)}
                    >
                      <Plus size={14} color="#555" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="col-4 col-md-2 text-end text-md-center">
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0a0a0a' }}>
                    ₹{((item.price || product?.price) * item.quantity).toLocaleString('en-IN')}
                  </span>
                  <div><small style={{ color: '#999', fontSize: '0.7rem' }}>
                    ₹{(item.price || product?.price)?.toLocaleString('en-IN')} each
                  </small></div>
                </div>

                {/* Remove */}
                <div className="col-2 col-md-1 text-end">
                  <button
                    className="btn p-0 border-0 d-flex align-items-center justify-content-center"
                    onClick={handleRemove}
                    title="Remove item"
                    style={{
                      width: 32, height: 32, borderRadius: '8px',
                      background: 'rgba(255,59,48,0.08)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,59,48,0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,59,48,0.08)'; }}
                  >
                    <Trash2 size={15} color="#FF3B30" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartItem;
