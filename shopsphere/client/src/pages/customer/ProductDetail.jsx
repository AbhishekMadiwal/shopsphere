import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import Loader from '../../components/Loader';
import { ShoppingBag, Zap, Minus, Plus, Truck, RotateCcw, ShieldCheck, ChevronRight, Home } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [cartLoading, setCartLoading] = useState(false);
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.data);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.info('Please login to add items to cart'); navigate('/login'); return; }
    try {
      setCartLoading(true);
      await addToCart(product._id, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) { toast.info('Please login to continue'); navigate('/login'); return; }
    try {
      setCartLoading(true);
      await addToCart(product._id, quantity);
      navigate('/checkout');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setCartLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to write a review'); return; }
    if (review.rating === 0) { toast.error('Please select a rating'); return; }
    try {
      setReviewLoading(true);
      const { data } = await API.post(`/products/${id}/review`, review);
      setProduct(data.data);
      setReview({ rating: 0, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loader text="Loading product..." />;
  if (!product) return null;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const images = product.images?.length > 0
    ? product.images
    : [`https://placehold.co/600x600?text=${encodeURIComponent(product.name)}`];

  return (
    <div className="container py-4 py-md-5">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="breadcrumb d-flex align-items-center gap-1 mb-0">
          <li className="breadcrumb-item"><Link to="/" className="d-flex align-items-center"><Home size={14} /></Link></li>
          <li><ChevronRight size={12} color="#ccc" /></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li><ChevronRight size={12} color="#ccc" /></li>
          <li className="breadcrumb-item active text-truncate" style={{ maxWidth: 200, fontSize: '0.85rem' }}>{product.name}</li>
        </ol>
      </nav>

      <div className="row g-4 g-lg-5">
        {/* ─── IMAGE GALLERY ──────────────────────────────── */}
        <div className="col-lg-5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="card border-0 overflow-hidden mb-3"
              style={{ borderRadius: '20px', background: '#f7f7f7', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ overflow: 'hidden', cursor: 'zoom-in' }}
                onMouseMove={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  img.style.transformOrigin = `${x}% ${y}%`;
                  img.style.transform = 'scale(1.8)';
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  img.style.transform = 'scale(1)';
                }}>
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="img-fluid w-100"
                  style={{ height: 420, objectFit: 'contain', padding: '1.5rem', transition: 'transform 0.3s ease' }}
                  onError={(e) => { e.target.src = `https://placehold.co/600x600?text=${encodeURIComponent(product.name)}`; }}
                />
              </div>
            </div>
            {images.length > 1 && (
              <div className="d-flex gap-2 flex-wrap">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden"
                    style={{
                      width: 72, height: 72, cursor: 'pointer',
                      borderRadius: '12px',
                      border: selectedImage === idx ? '2px solid #C8A97E' : '2px solid #eee',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt="" className="img-fluid" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = `https://placehold.co/100x100?text=img`; }} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ─── PRODUCT INFO ────────────────────────────────── */}
        <div className="col-lg-7">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            {product.brand && (
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                {product.brand}
              </p>
            )}
            <h1 style={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>{product.name}</h1>

            <div className="d-flex align-items-center gap-3 mb-3">
              <StarRating rating={product.ratings?.average} count={product.ratings?.count} size="md" />
              <span style={{ color: '#999', fontSize: '0.8rem' }}>({product.reviews?.length || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="d-flex align-items-center gap-3 mb-2 flex-wrap">
              <span style={{ fontWeight: 900, fontSize: '2rem', color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {discount > 0 && (
                <>
                  <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '1.1rem' }}>
                    ₹{product.originalPrice?.toLocaleString('en-IN')}
                  </span>
                  <span style={{
                    background: 'rgba(52,199,89,0.1)', color: '#34C759',
                    fontWeight: 700, fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '50px',
                  }}>
                    -{discount}% OFF
                  </span>
                </>
              )}
            </div>
            {discount > 0 && (
              <p style={{ color: '#34C759', fontWeight: 600, fontSize: '0.8rem', marginBottom: '1rem' }}>
                You save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
              </p>
            )}

            {/* Stock */}
            <div className="mb-3">
              {product.stock > 0 ? (
                <span style={{
                  background: product.stock < 10 ? 'rgba(255,149,0,0.1)' : 'rgba(52,199,89,0.1)',
                  color: product.stock < 10 ? '#FF9500' : '#34C759',
                  fontWeight: 700, fontSize: '0.8rem', padding: '0.35rem 0.85rem', borderRadius: '50px',
                }}>
                  {product.stock < 10 ? `Only ${product.stock} left — Hurry!` : `In Stock (${product.stock} units)`}
                </span>
              ) : (
                <span style={{
                  background: 'rgba(255,59,48,0.1)', color: '#FF3B30',
                  fontWeight: 700, fontSize: '0.8rem', padding: '0.35rem 0.85rem', borderRadius: '50px',
                }}>Out of Stock</span>
              )}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="mb-3 d-flex flex-wrap gap-1">
                {product.tags.map((tag) => (
                  <span key={tag} style={{
                    background: '#f5f5f5', color: '#555', fontSize: '0.7rem',
                    fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '6px',
                  }}>{tag}</span>
                ))}
              </div>
            )}

            <hr style={{ borderColor: 'rgba(0,0,0,0.06)' }} />

            {/* Quantity + Buttons */}
            {product.stock > 0 && (
              <>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Quantity:</label>
                  <div className="d-flex align-items-center"
                    style={{ border: '1.5px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>
                    <button className="btn border-0 p-0 d-flex align-items-center justify-content-center"
                      style={{ width: 40, height: 40, background: '#f7f7f7' }}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                      <Minus size={16} />
                    </button>
                    <motion.span key={quantity} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                      className="px-4" style={{ fontWeight: 800, fontSize: '1rem' }}>
                      {quantity}
                    </motion.span>
                    <button className="btn border-0 p-0 d-flex align-items-center justify-content-center"
                      style={{ width: 40, height: 40, background: '#f7f7f7' }}
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <span style={{ color: '#999', fontSize: '0.8rem' }}>Max: {product.stock}</span>
                </div>

                <div className="d-flex gap-3 flex-wrap mb-4">
                  <button className="btn btn-lg flex-fill d-flex align-items-center justify-content-center gap-2"
                    onClick={handleAddToCart} disabled={cartLoading}
                    style={{
                      background: '#0a0a0a', color: '#fff', border: 'none',
                      borderRadius: '14px', fontWeight: 700, fontSize: '0.95rem', padding: '0.9rem 2rem',
                    }}>
                    {cartLoading ? <span className="spinner-border spinner-border-sm" /> : <ShoppingBag size={18} />}
                    Add to Cart
                  </button>
                  <button className="btn btn-lg flex-fill d-flex align-items-center justify-content-center gap-2"
                    onClick={handleBuyNow} disabled={cartLoading}
                    style={{
                      background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                      color: '#fff', border: 'none',
                      borderRadius: '14px', fontWeight: 700, fontSize: '0.95rem', padding: '0.9rem 2rem',
                    }}>
                    <Zap size={18} /> Buy Now
                  </button>
                </div>
              </>
            )}

            {/* Trust Badges */}
            <div className="row g-2 mb-3">
              {[[Truck, 'Free Delivery', 'On orders above ₹500'], [RotateCcw, '30-Day Returns', 'Hassle-free return'], [ShieldCheck, 'Secure Payment', 'Encrypted checkout']].map(([Icon, title, sub]) => (
                <div key={title} className="col-4">
                  <div className="text-center p-2"
                    style={{ background: '#f7f7f7', borderRadius: '12px' }}>
                    <Icon size={18} color="#C8A97E" className="mb-1" />
                    <div style={{ fontWeight: 700, fontSize: '0.7rem' }}>{title}</div>
                    <div style={{ fontSize: '0.6rem', color: '#999' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── TABS ──────────────────────────────────────────── */}
      <div className="mt-5">
        <ul className="nav nav-tabs mb-4">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <li key={tab} className="nav-item">
              <button
                className={`nav-link text-capitalize ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'reviews' ? `Reviews (${product.reviews?.length || 0})` : tab}
              </button>
            </li>
          ))}
        </ul>

        {activeTab === 'description' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="card border-0 p-4" style={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.9rem' }}>{product.description}</p>
          </motion.div>
        )}

        {activeTab === 'specifications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="card border-0 p-4" style={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <table className="table mb-0">
              <tbody>
                <tr><th style={{ width: '30%' }}>Brand</th><td>{product.brand || 'N/A'}</td></tr>
                <tr><th>Category</th><td>{product.category?.name || 'N/A'}</td></tr>
                <tr><th>Stock</th><td>{product.stock} units</td></tr>
                <tr><th>Total Sold</th><td>{product.sold || 0} units</td></tr>
                <tr><th>Rating</th><td>{product.ratings?.average}/5 ({product.ratings?.count} ratings)</td></tr>
                {product.tags?.length > 0 && <tr><th>Tags</th><td>{product.tags.join(', ')}</td></tr>}
              </tbody>
            </table>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="row g-4">
            <div className="col-lg-4">
              <div className="card border-0 p-4 text-center" style={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#C8A97E', lineHeight: 1 }}>
                  {product.ratings?.average?.toFixed(1) || '0.0'}
                </div>
                <StarRating rating={product.ratings?.average} size="lg" />
                <p style={{ color: '#999', marginTop: '0.5rem', fontSize: '0.85rem' }}>{product.ratings?.count || 0} ratings</p>
                <hr />
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = product.reviews?.filter((r) => Math.round(r.rating) === star).length || 0;
                  const pct = product.reviews?.length ? Math.round((count / product.reviews.length) * 100) : 0;
                  return (
                    <div key={star} className="d-flex align-items-center gap-2 mb-1">
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, minWidth: 20 }}>{star}★</span>
                      <div className="progress flex-grow-1" style={{ height: 6 }}>
                        <div className="progress-bar bg-warning" style={{ width: `${pct}%` }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#999', minWidth: 20 }}>{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Add review form */}
              {user && user.role !== 'admin' && (
                <div className="card border-0 p-4 mt-3" style={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <h6 style={{ fontWeight: 800, marginBottom: '1rem' }}>Write a Review</h6>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Your Rating</label>
                      <div><StarRating rating={review.rating} size="lg" interactive onRate={(r) => setReview((prev) => ({ ...prev, rating: r }))} /></div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Your Comment</label>
                      <textarea className="form-control" rows={3} placeholder="Share your experience..."
                        value={review.comment} style={{ borderRadius: '12px' }}
                        onChange={(e) => setReview((prev) => ({ ...prev, comment: e.target.value }))} />
                    </div>
                    <button type="submit" className="btn w-100" disabled={reviewLoading}
                      style={{
                        background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                        color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, padding: '0.7rem',
                      }}>
                      {reviewLoading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                      Submit Review
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="col-lg-8">
              {product.reviews?.length === 0 ? (
                <div className="text-center py-5">
                  <div className="d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(200,169,126,0.1)' }}>
                    <span style={{ fontSize: '1.5rem' }}>⭐</span>
                  </div>
                  <h5 style={{ fontWeight: 800 }}>No reviews yet</h5>
                  <p style={{ color: '#999', fontSize: '0.85rem' }}>Be the first to review this product!</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {[...product.reviews].reverse().map((rev, idx) => (
                    <div key={idx} className="card border-0 p-3" style={{ borderRadius: '14px', border: '1px solid rgba(0,0,0,0.04)' }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: 36, height: 36, fontWeight: 700, fontSize: '0.85rem',
                              background: 'linear-gradient(135deg, #C8A97E, #B8956A)', color: '#fff',
                            }}>
                            {(rev.user?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{rev.user?.name || 'Anonymous'}</div>
                            <StarRating rating={rev.rating} size="sm" />
                          </div>
                        </div>
                        <small style={{ color: '#999', fontSize: '0.75rem' }}>
                          {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </small>
                      </div>
                      {rev.comment && <p style={{ color: '#555', fontSize: '0.85rem', marginBottom: 0, lineHeight: 1.6 }}>{rev.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* ─── MOBILE STICKY ADD TO CART ─────────────────────── */}
      {product.stock > 0 && (
        <div className="d-lg-none position-fixed bottom-0 start-0 end-0 p-3"
          style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,0,0,0.06)', zIndex: 100 }}>
          <div className="d-flex gap-2">
            <button className="btn flex-fill d-flex align-items-center justify-content-center gap-2"
              onClick={handleAddToCart} disabled={cartLoading}
              style={{ background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, padding: '0.75rem' }}>
              <ShoppingBag size={16} /> Add to Cart
            </button>
            <button className="btn flex-fill d-flex align-items-center justify-content-center gap-2"
              onClick={handleBuyNow} disabled={cartLoading}
              style={{ background: 'linear-gradient(135deg, #C8A97E, #B8956A)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, padding: '0.75rem' }}>
              <Zap size={16} /> Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
