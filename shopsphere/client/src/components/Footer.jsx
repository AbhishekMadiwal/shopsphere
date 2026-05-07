import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="mt-auto" style={{ background: '#0a0a0a', color: '#fff' }}>
      {/* Newsletter Section */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container py-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="row align-items-center"
          >
            <div className="col-lg-6 mb-3 mb-lg-0">
              <h3 style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.75rem' }}>
                Stay in the loop
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                Get exclusive offers, new arrivals, and insider-only discounts.
              </p>
            </div>
            <div className="col-lg-6">
              <form onSubmit={handleSubscribe} className="d-flex gap-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    borderRadius: '50px',
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.9rem',
                  }}
                />
                <button
                  type="submit"
                  className="btn d-flex align-items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                    color: '#fff',
                    borderRadius: '50px',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    border: 'none',
                  }}
                >
                  {subscribed ? '✓ Subscribed!' : <>Subscribe <ArrowRight size={16} /></>}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Brand */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeInUp} className="col-lg-4"
          >
            <div className="d-flex align-items-center gap-2 mb-3">
              <ShoppingBag size={24} color="#C8A97E" />
              <span style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>
                Shop<span style={{ color: '#C8A97E' }}>Sphere</span>
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 320 }}>
              Your one-stop destination for electronics, fashion, home goods, and more.
              Shop with confidence and enjoy fast delivery across India.
            </p>
            <div className="d-flex gap-3 mt-3">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: 36, height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.8rem',
                    textTransform: 'capitalize',
                    transition: 'all 0.3s',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(200,169,126,0.15)';
                    e.currentTarget.style.color = '#C8A97E';
                    e.currentTarget.style.borderColor = 'rgba(200,169,126,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  {social[0].toUpperCase()}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.1, duration: 0.5 } } }}
            className="col-6 col-lg-2"
          >
            <h6 style={{ color: '#C8A97E', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Quick Links
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {[['/', 'Home'], ['/products', 'Products'], ['/cart', 'Cart'], ['/orders', 'My Orders']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#C8A97E'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.2, duration: 0.5 } } }}
            className="col-6 col-lg-2"
          >
            <h6 style={{ color: '#C8A97E', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Categories
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Beauty'].map((cat) => (
                <li key={cat}>
                  <Link to={`/products?search=${cat}`}
                    style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#C8A97E'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                  >{cat}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.3, duration: 0.5 } } }}
            className="col-lg-4"
          >
            <h6 style={{ color: '#C8A97E', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Why ShopSphere?
            </h6>
            <div className="d-flex flex-column gap-3">
              {[
                [Truck, 'Fast Delivery', '2-5 business days'],
                [ShieldCheck, 'Secure Payment', '100% safe & encrypted'],
                [RotateCcw, 'Easy Returns', '30-day return policy'],
                [MessageCircle, '24/7 Support', 'Always here to help'],
              ].map(([Icon, title, sub]) => (
                <div key={title} className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(200,169,126,0.1)' }}>
                    <Icon size={18} color="#C8A97E" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '2.5rem', paddingTop: '1.5rem' }}>
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <small style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                © {new Date().getFullYear()} ShopSphere. All rights reserved.
              </small>
            </div>
            <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
              <small style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                Built with precision using React + Node.js
              </small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
