import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useState } from 'react';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.info('Please login to add items to cart'); return; }
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const imageUrl = product.images?.[0] || `https://placehold.co/400x400?text=${encodeURIComponent(product.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="card h-100 product-card border-0 position-relative"
        style={{ borderRadius: '16px', overflow: 'hidden' }}
      >
        {/* Badges */}
        {discount > 0 && (
          <span className="position-absolute badge"
            style={{
              top: 12, left: 12, zIndex: 2,
              background: 'linear-gradient(135deg, #FF3B30, #FF6B6B)',
              color: '#fff', fontSize: '0.7rem', fontWeight: 700,
              padding: '0.3em 0.7em', borderRadius: '8px',
            }}>
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="position-absolute badge"
            style={{
              top: 12, right: 12, zIndex: 2,
              background: 'rgba(0,0,0,0.7)', color: '#fff',
              fontSize: '0.7rem', fontWeight: 600,
              padding: '0.3em 0.7em', borderRadius: '8px',
            }}>
            Sold Out
          </span>
        )}

        {/* Action Icons */}
        <div className="position-absolute d-flex flex-column gap-2"
          style={{ top: 12, right: 12, zIndex: 2, opacity: 0, transition: 'all 0.3s' }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        >
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); toast.info(wishlisted ? 'Removed from wishlist' : 'Added to wishlist'); }}
            className="btn p-0 d-flex align-items-center justify-content-center"
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Heart size={16} fill={wishlisted ? '#FF3B30' : 'none'} color={wishlisted ? '#FF3B30' : '#555'} />
          </button>
        </div>

        {/* Product Card Hover Overlay for icons */}
        <style>{`
          .product-card:hover [style*="opacity: 0"] { opacity: 1 !important; }
        `}</style>

        {/* Image */}
        <Link to={`/products/${product._id}`} style={{ overflow: 'hidden', display: 'block' }}>
          <div style={{ overflow: 'hidden', background: '#f5f5f5' }}>
            {!imageLoaded && (
              <div className="skeleton" style={{ height: 220, width: '100%' }} />
            )}
            <img
              src={imageUrl}
              className="card-img-top"
              alt={product.name}
              style={{
                height: 220, objectFit: 'cover',
                transition: 'transform 0.5s ease',
                display: imageLoaded ? 'block' : 'none',
              }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => { e.target.src = `https://placehold.co/400x400?text=Product`; setImageLoaded(true); }}
            />
          </div>
        </Link>

        {/* Content */}
        <div className="card-body d-flex flex-column p-3">
          {product.brand && (
            <p className="mb-1" style={{ fontSize: '0.7rem', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.brand}
            </p>
          )}

          <Link to={`/products/${product._id}`} className="text-decoration-none">
            <h6 className="fw-semibold mb-1" style={{
              fontSize: '0.9rem', color: '#1a1a1a', lineHeight: 1.3,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {product.name}
            </h6>
          </Link>

          <div className="mb-2">
            <StarRating rating={product.ratings?.average || 0} count={product.ratings?.count || 0} />
          </div>

          <div className="mt-auto">
            <div className="d-flex align-items-baseline gap-2 mb-2">
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0a0a0a' }}>
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {discount > 0 && (
                <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.8rem' }}>
                  ₹{product.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <button
              className="btn w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                background: product.stock === 0 ? '#e0e0e0' : '#0a0a0a',
                color: product.stock === 0 ? '#999' : '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.6rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                if (product.stock > 0) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #C8A97E, #B8956A)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(200,169,126,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (product.stock > 0) {
                  e.currentTarget.style.background = '#0a0a0a';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <ShoppingBag size={15} />
              {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
