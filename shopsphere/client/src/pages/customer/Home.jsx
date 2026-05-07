import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import Loader, { SkeletonCard } from '../../components/Loader';
import SearchBar from '../../components/SearchBar';
import {
  Truck, ShieldCheck, RotateCcw, Headphones, ArrowRight,
  Sparkles, TrendingUp, Zap, Star, Quote
} from 'lucide-react';

const CATEGORY_ICONS = {
  Electronics: '💻', Fashion: '👗', 'Home & Kitchen': '🏠',
  Books: '📚', Sports: '⚽', Beauty: '💄',
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          API.get('/products?limit=8&sort=popular'),
          API.get('/categories'),
        ]);
        setFeaturedProducts(productsRes.data.data.products);
        setCategories(categoriesRes.data.data);
      } catch {
        toast.error('Failed to load homepage data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* ═══ CINEMATIC HERO ═══════════════════════════════════ */}
      <section
        className="position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #141414 40%, #1a1a1a 100%)',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Decorative Elements */}
        <div className="position-absolute" style={{
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,126,0.06) 0%, transparent 70%)',
          top: -150, right: -100,
        }} />
        <div className="position-absolute" style={{
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,126,0.04) 0%, transparent 70%)',
          bottom: -80, left: '20%',
        }} />
        <div className="position-absolute" style={{
          width: 1, height: '100%', top: 0, left: '50%',
          background: 'linear-gradient(180deg, transparent, rgba(200,169,126,0.06), transparent)',
        }} />

        <div className="container position-relative py-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                <motion.div variants={fadeInUp} custom={0}>
                  <span className="d-inline-flex align-items-center gap-2 mb-3"
                    style={{
                      background: 'rgba(200,169,126,0.1)',
                      border: '1px solid rgba(200,169,126,0.2)',
                      borderRadius: '50px',
                      padding: '0.4rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#C8A97E',
                    }}>
                    <Sparkles size={14} /> Limited Time Offers
                  </span>
                </motion.div>

                <motion.h1 variants={fadeInUp} custom={1}
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    color: '#fff',
                    marginBottom: '1.25rem',
                  }}>
                  Shop Smarter,<br />
                  <span style={{ color: '#C8A97E' }}>Live Better.</span>
                </motion.h1>

                <motion.p variants={fadeInUp} custom={2}
                  style={{
                    fontSize: '1.05rem',
                    color: 'rgba(255,255,255,0.45)',
                    maxWidth: 520,
                    lineHeight: 1.7,
                    marginBottom: '2rem',
                  }}>
                  Discover millions of products across Electronics, Fashion, Home & more.
                  Get the best deals with fast delivery across India.
                </motion.p>

                <motion.div variants={fadeInUp} custom={3} className="mb-4" style={{ maxWidth: 480 }}>
                  <SearchBar placeholder="Search for products, brands and more..." variant="hero" />
                </motion.div>

                <motion.div variants={fadeInUp} custom={4} className="d-flex flex-wrap gap-3 mb-4">
                  <Link to="/products" className="btn btn-lg d-flex align-items-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                      color: '#fff', border: 'none', borderRadius: '14px',
                      padding: '0.9rem 2rem', fontWeight: 700, fontSize: '0.95rem',
                    }}>
                    Shop Now <ArrowRight size={18} />
                  </Link>
                  <Link to="/products?sort=popular" className="btn btn-lg d-flex align-items-center gap-2"
                    style={{
                      background: 'transparent',
                      color: '#fff',
                      border: '1.5px solid rgba(255,255,255,0.15)',
                      borderRadius: '14px',
                      padding: '0.9rem 2rem',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    }}>
                    <TrendingUp size={18} /> Top Deals
                  </Link>
                </motion.div>

                <motion.div variants={fadeInUp} custom={5} className="d-flex flex-wrap gap-5 mt-2">
                  {[['50K+', 'Products'], ['2M+', 'Customers'], ['4.8', 'Rating']].map(([val, label]) => (
                    <div key={label}>
                      <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#C8A97E', lineHeight: 1.2 }}>
                        {label === 'Rating' ? <span className="d-flex align-items-center gap-1">{val} <Star size={16} fill="#C8A97E" color="#C8A97E" /></span> : val}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', fontWeight: 500 }}>{label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Hero Visual */}
            <div className="col-lg-5 text-center d-none d-lg-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div style={{
                  width: 320, height: 320, margin: '0 auto',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(200,169,126,0.08) 0%, transparent 70%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      fontSize: '8rem',
                      filter: 'drop-shadow(0 20px 40px rgba(200,169,126,0.2))',
                    }}
                  >
                    🛍️
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ════════════════════════════════════════ */}
      <section style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="container py-4">
          <div className="row g-3 text-center">
            {[
              [Truck, 'Free Delivery', 'On orders above ₹500'],
              [ShieldCheck, 'Secure Payment', '100% safe checkout'],
              [RotateCcw, 'Easy Returns', '30-day return policy'],
              [Headphones, '24/7 Support', 'Always here for you'],
            ].map(([Icon, title, sub]) => (
              <div key={title} className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
                  <div className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 42, height: 42, borderRadius: '12px',
                      background: 'rgba(200,169,126,0.08)',
                    }}>
                    <Icon size={20} color="#C8A97E" />
                  </div>
                  <div className="text-start">
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1a1a1a' }}>{title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#999' }}>{sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-5">
        {/* ═══ CATEGORIES ═════════════════════════════════════ */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
          variants={stagger} className="mb-5"
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <motion.div variants={fadeInUp}>
              <h2 style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.75rem' }}>Shop by Category</h2>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Find exactly what you're looking for</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link to="/products" className="btn d-flex align-items-center gap-1"
                style={{
                  border: '1.5px solid #e0e0e0', borderRadius: '50px',
                  padding: '0.5rem 1.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#555',
                }}>
                View All <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          <div className="row g-3">
            {categories.map((cat, i) => (
              <motion.div key={cat._id} className="col-6 col-md-4 col-lg-2" variants={fadeInUp} custom={i}>
                <Link to={`/products?category=${cat._id}`} className="text-decoration-none">
                  <div className="card border-0 text-center p-3 h-100 hover-lift"
                    style={{
                      borderRadius: '16px',
                      border: '1px solid rgba(0,0,0,0.04)',
                      background: '#fff',
                      cursor: 'pointer',
                    }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                      {CATEGORY_ICONS[cat.name] || '📦'}
                    </div>
                    <h6 style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1a1a1a', marginBottom: 0 }}>{cat.name}</h6>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ FEATURED PRODUCTS ══════════════════════════════ */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
          variants={stagger} className="mb-5"
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <motion.div variants={fadeInUp}>
              <h2 className="d-flex align-items-center gap-2" style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.75rem' }}>
                <Zap size={24} color="#C8A97E" fill="#C8A97E" /> Featured Products
              </h2>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Best sellers this week</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link to="/products" className="btn d-flex align-items-center gap-1"
                style={{
                  border: '1.5px solid #e0e0e0', borderRadius: '50px',
                  padding: '0.5rem 1.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#555',
                }}>
                View All <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div className="row g-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3"><SkeletonCard /></div>
              ))}
            </div>
          ) : (
            <div className="row g-4">
              {featuredProducts.map((p, i) => (
                <div key={p._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ═══ PROMO BANNERS ══════════════════════════════════ */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
          variants={stagger} className="row g-4 mb-5"
        >
          <motion.div className="col-md-6" variants={fadeInUp}>
            <div className="p-4 d-flex align-items-center gap-3 text-white h-100 hover-lift"
              style={{
                background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
                borderRadius: '20px',
                border: '1px solid rgba(200,169,126,0.15)',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/products?category=electronics')}>
              <div style={{ fontSize: '3.5rem' }}>💻</div>
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: '0.25rem', fontSize: '1.25rem' }}>Electronics Sale</h4>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem', fontSize: '0.85rem' }}>Up to 40% off on top brands</p>
                <span className="d-inline-flex align-items-center gap-1"
                  style={{ color: '#C8A97E', fontWeight: 700, fontSize: '0.85rem' }}>
                  Shop Now <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </motion.div>
          <motion.div className="col-md-6" variants={fadeInUp}>
            <div className="p-4 d-flex align-items-center gap-3 text-white h-100 hover-lift"
              style={{
                background: 'linear-gradient(135deg, #2a1a1a, #1a1a2a)',
                borderRadius: '20px',
                border: '1px solid rgba(200,169,126,0.15)',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/products?category=fashion')}>
              <div style={{ fontSize: '3.5rem' }}>👗</div>
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: '0.25rem', fontSize: '1.25rem' }}>Fashion Week</h4>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem', fontSize: '0.85rem' }}>Latest trends, best prices</p>
                <span className="d-inline-flex align-items-center gap-1"
                  style={{ color: '#C8A97E', fontWeight: 700, fontSize: '0.85rem' }}>
                  Shop Now <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ═══ TESTIMONIALS ═══════════════════════════════════ */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
          variants={stagger} className="mb-5"
        >
          <motion.div variants={fadeInUp} className="text-center mb-4">
            <h2 style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.75rem' }}>What Our Customers Say</h2>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>Trusted by millions of shoppers</p>
          </motion.div>
          <div className="row g-4">
            {[
              { name: 'Priya Sharma', text: 'Amazing quality and super fast delivery. ShopSphere is my go-to for everything!', rating: 5 },
              { name: 'Rahul Verma', text: 'The best deals I\'ve found online. Customer service is exceptional too.', rating: 5 },
              { name: 'Ananya Patel', text: 'Love the variety and the easy return policy. Highly recommend!', rating: 4 },
            ].map((review, i) => (
              <motion.div key={i} className="col-md-4" variants={fadeInUp} custom={i}>
                <div className="card border-0 p-4 h-100"
                  style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', background: '#fff' }}>
                  <Quote size={24} color="#C8A97E" style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                  <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7, flex: 1 }}>{review.text}</p>
                  <div className="d-flex align-items-center gap-3 mt-3">
                    <div className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: 40, height: 40, fontWeight: 700, fontSize: '0.9rem',
                        background: 'linear-gradient(135deg, #C8A97E, #B8956A)', color: '#fff',
                      }}>
                      {review.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{review.name}</div>
                      <div className="d-flex gap-0">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={12} fill={j < review.rating ? '#C8A97E' : 'none'} color={j < review.rating ? '#C8A97E' : '#ddd'} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ WHY SHOPSPHERE ═════════════════════════════════ */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
          className="p-5 text-white mb-2"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
            borderRadius: '24px',
            border: '1px solid rgba(200,169,126,0.1)',
          }}
        >
          <motion.h2 variants={fadeInUp} className="text-center mb-4"
            style={{ fontWeight: 800, fontSize: '1.75rem' }}>
            Why Choose <span style={{ color: '#C8A97E' }}>ShopSphere</span>?
          </motion.h2>
          <div className="row g-4">
            {[
              [Truck, 'Lightning Fast Delivery', 'Get your orders in 2-5 business days with our express shipping partners across India.'],
              [ShieldCheck, 'Secure & Safe Payments', '256-bit SSL encrypted checkout. Your financial data is completely protected.'],
              [RotateCcw, 'Hassle-Free Returns', 'Not satisfied? Return within 30 days, no questions asked. Full refund guaranteed.'],
              [Star, 'Genuine Products Only', 'Every product is verified for authenticity. Shop with 100% confidence.'],
            ].map(([Icon, title, desc], i) => (
              <motion.div key={title} className="col-md-6 col-lg-3" variants={fadeInUp} custom={i}>
                <div className="text-center">
                  <div className="d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: 52, height: 52, borderRadius: '14px',
                      background: 'rgba(200,169,126,0.1)',
                    }}>
                    <Icon size={24} color="#C8A97E" />
                  </div>
                  <h5 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h5>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
