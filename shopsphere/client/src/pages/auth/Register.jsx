import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    try {
      setLoading(true);
      const user = await register(form.name, form.email, form.password);
      toast.success(`Welcome to ShopSphere, ${user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const pwdStrength = form.password.length === 0 ? -1
    : form.password.length < 6 ? 0
    : form.password.length < 8 ? 1
    : /[a-zA-Z]/.test(form.password) && /[0-9]/.test(form.password) ? 2 : 1;

  const strengthConfig = [
    { label: 'Weak', color: '#FF3B30', width: '33%' },
    { label: 'Good', color: '#FF9500', width: '66%' },
    { label: 'Strong', color: '#34C759', width: '100%' },
  ];

  return (
    <div className="min-vh-100 d-flex">
      {/* Right Panel - Brand (mirrored from login) */}
      <div className="d-none d-lg-flex col-lg-5 position-relative order-lg-2"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #1a1a1a 100%)',
          alignItems: 'center', justifyContent: 'center', padding: '3rem',
        }}>
        <div className="position-absolute" style={{
          width: 300, height: 300, borderRadius: '50%', top: '10%', left: '-50px',
          background: 'radial-gradient(circle, rgba(200,169,126,0.06) 0%, transparent 70%)',
        }} />

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }} className="position-relative" style={{ maxWidth: 400 }}>
          <div className="d-flex align-items-center gap-2 mb-4">
            <ShoppingBag size={32} color="#C8A97E" />
            <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em' }}>
              Shop<span style={{ color: '#C8A97E' }}>Sphere</span>
            </span>
          </div>
          <h2 style={{ fontWeight: 900, fontSize: '2.5rem', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Start your<br />journey.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', lineHeight: 1.7 }}>
            Create your free account and discover millions of products with the best deals.
          </p>

          <div className="d-flex flex-column gap-3 mt-4">
            {['Free shipping on orders above ₹500', 'Easy 30-day returns policy', 'Exclusive member-only offers'].map((perk) => (
              <div key={perk} className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(200,169,126,0.15)' }}>
                  <Check size={14} color="#C8A97E" />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{perk}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Left Panel - Form */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4 order-lg-1"
        style={{ background: '#fff' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 420 }}>

          <div className="d-lg-none text-center mb-4">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <ShoppingBag size={28} color="#C8A97E" />
              <span style={{ fontWeight: 800, fontSize: '1.3rem' }}>
                Shop<span style={{ color: '#C8A97E' }}>Sphere</span>
              </span>
            </div>
          </div>

          <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            Create Account
          </h3>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Join ShopSphere — it's free forever
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Full Name</label>
              <input type="text" className="form-control form-control-lg" name="name"
                placeholder="John Doe" value={form.name} onChange={handleChange}
                required style={{ borderRadius: '12px' }} />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Email Address</label>
              <input type="email" className="form-control form-control-lg" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange}
                required style={{ borderRadius: '12px' }} />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Password</label>
              <div className="position-relative">
                <input type={showPwd ? 'text' : 'password'} className="form-control form-control-lg" name="password"
                  placeholder="Min. 6 characters" value={form.password} onChange={handleChange}
                  required style={{ borderRadius: '12px', paddingRight: '3rem' }} />
                <button type="button" className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0"
                  onClick={() => setShowPwd(!showPwd)} style={{ background: 'none' }}>
                  {showPwd ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
                </button>
              </div>
              {pwdStrength >= 0 && (
                <div className="mt-2">
                  <div style={{ height: 3, background: '#e0e0e0', borderRadius: 50 }}>
                    <div style={{
                      height: '100%', width: strengthConfig[pwdStrength].width,
                      background: strengthConfig[pwdStrength].color,
                      borderRadius: 50, transition: 'width 0.3s',
                    }} />
                  </div>
                  <small style={{ color: strengthConfig[pwdStrength].color, fontWeight: 600, fontSize: '0.7rem' }}>
                    {strengthConfig[pwdStrength].label}
                  </small>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Confirm Password</label>
              <input type="password" className="form-control form-control-lg" name="confirmPassword"
                placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange}
                required style={{ borderRadius: '12px' }} />
            </div>

            <button type="submit" className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 700, padding: '0.9rem',
              }}>
              {loading ? <span className="spinner-border spinner-border-sm" /> : <ArrowRight size={18} />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-4">
            <span style={{ color: '#999', fontSize: '0.85rem' }}>Already have an account? </span>
            <Link to="/login" style={{ color: '#C8A97E', fontWeight: 700, fontSize: '0.85rem' }}>Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
