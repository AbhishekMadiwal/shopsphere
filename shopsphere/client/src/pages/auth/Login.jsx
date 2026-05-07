import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Eye, EyeOff, Zap, User, ArrowRight } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    try {
      setLoading(true);
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else navigate(from);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@shopsphere.com', password: 'admin123' });
    else setForm({ email: 'rahul@test.com', password: 'test123' });
  };

  return (
    <div className="min-vh-100 d-flex">
      {/* Left - Brand Panel */}
      <div className="d-none d-lg-flex col-lg-5 position-relative"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #1a1a1a 100%)',
          alignItems: 'center', justifyContent: 'center', padding: '3rem',
        }}>
        <div className="position-absolute" style={{
          width: 300, height: 300, borderRadius: '50%', top: '10%', right: '-50px',
          background: 'radial-gradient(circle, rgba(200,169,126,0.06) 0%, transparent 70%)',
        }} />
        <div className="position-absolute" style={{
          width: 200, height: 200, borderRadius: '50%', bottom: '15%', left: '10%',
          background: 'radial-gradient(circle, rgba(200,169,126,0.04) 0%, transparent 70%)',
        }} />

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }} className="position-relative" style={{ maxWidth: 400 }}>
          <div className="d-flex align-items-center gap-2 mb-4">
            <ShoppingBag size={32} color="#C8A97E" />
            <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em' }}>
              Shop<span style={{ color: '#C8A97E' }}>Sphere</span>
            </span>
          </div>
          <h2 style={{ fontWeight: 900, fontSize: '2.5rem', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Welcome<br />back.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', lineHeight: 1.7 }}>
            Sign in to access your orders, wishlist, and exclusive member deals.
          </p>
          <div className="d-flex gap-4 mt-4">
            {[['50K+', 'Products'], ['4.8★', 'Rating'], ['2M+', 'Users']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#C8A97E' }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - Form Panel */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4"
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
            Sign In
          </h3>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Enter your credentials to continue
          </p>

          {/* Demo Buttons */}
          <div className="d-flex gap-2 mb-4">
            <button className="btn flex-fill d-flex align-items-center justify-content-center gap-1"
              onClick={() => fillDemo('admin')}
              style={{
                background: 'rgba(200,169,126,0.08)', border: '1.5px solid rgba(200,169,126,0.2)',
                borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', color: '#C8A97E', padding: '0.55rem',
              }}>
              <Zap size={14} /> Admin Demo
            </button>
            <button className="btn flex-fill d-flex align-items-center justify-content-center gap-1"
              onClick={() => fillDemo('customer')}
              style={{
                background: 'rgba(0,0,0,0.03)', border: '1.5px solid rgba(0,0,0,0.08)',
                borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', color: '#555', padding: '0.55rem',
              }}>
              <User size={14} /> Customer Demo
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Email Address</label>
              <input type="email" className="form-control form-control-lg" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange}
                required style={{ borderRadius: '12px' }} />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Password</label>
              <div className="position-relative">
                <input type={showPwd ? 'text' : 'password'} className="form-control form-control-lg" name="password"
                  placeholder="••••••••" value={form.password} onChange={handleChange}
                  required style={{ borderRadius: '12px', paddingRight: '3rem' }} />
                <button type="button" className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0"
                  onClick={() => setShowPwd(!showPwd)} style={{ background: 'none' }}>
                  {showPwd ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 700, padding: '0.9rem',
              }}>
              {loading ? <span className="spinner-border spinner-border-sm" /> : <ArrowRight size={18} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-4">
            <span style={{ color: '#999', fontSize: '0.85rem' }}>Don't have an account? </span>
            <Link to="/register" style={{ color: '#C8A97E', fontWeight: 700, fontSize: '0.85rem' }}>Create one</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
