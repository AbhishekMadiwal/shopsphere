import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, User, LogOut, LayoutDashboard, Package,
  ChevronDown, Menu, X, ShieldCheck, Users, ClipboardList
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setDropdownOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top"
      style={{
        background: scrolled
          ? 'rgba(10,10,10,0.95)'
          : 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: scrolled ? '0.5rem 0' : '0.75rem 0',
        zIndex: 1000,
      }}
    >
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
          style={{ textDecoration: 'none' }}
        >
          <ShoppingBag size={24} color="#C8A97E" strokeWidth={2.5} />
          <span style={{
            fontWeight: 800,
            fontSize: '1.3rem',
            letterSpacing: '-0.02em',
            color: '#fff',
          }}>
            Shop<span style={{ color: '#C8A97E' }}>Sphere</span>
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 p-1"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: '#fff' }}
        >
          {mobileOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
        </button>

        {/* Nav Content */}
        <div className={`collapse navbar-collapse ${mobileOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-4">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/products"
                onClick={closeMobile}
                style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '0.875rem' }}
              >
                All Products
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link
                  className="nav-link d-flex align-items-center gap-1"
                  to="/admin"
                  onClick={closeMobile}
                  style={{ color: '#C8A97E', fontWeight: 600, fontSize: '0.875rem' }}
                >
                  <ShieldCheck size={15} />
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {/* Cart */}
            {user && user.role !== 'admin' && (
              <li className="nav-item">
                <Link
                  className="nav-link position-relative d-flex align-items-center"
                  to="/cart"
                  onClick={closeMobile}
                  style={{ color: '#fff' }}
                >
                  <ShoppingBag size={20} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="position-absolute badge rounded-pill"
                        style={{
                          top: 0,
                          right: -6,
                          background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                          color: '#fff',
                          fontSize: '0.6rem',
                          padding: '0.25em 0.5em',
                          fontWeight: 700,
                        }}
                      >
                        {cartCount > 99 ? '99+' : cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            )}

            {/* Auth */}
            {user ? (
              <li className="nav-item position-relative">
                <button
                  className="btn d-flex align-items-center gap-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    background: 'rgba(200,169,126,0.12)',
                    border: '1px solid rgba(200,169,126,0.2)',
                    borderRadius: '50px',
                    padding: '0.35rem 0.85rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <span
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 26,
                      height: 26,
                      fontSize: '0.75rem',
                      background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                      color: '#fff',
                      fontWeight: 700,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="d-none d-lg-inline">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} style={{
                    transition: 'transform 0.2s',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ zIndex: 99 }}
                        onClick={() => setDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="position-absolute end-0 mt-2"
                        style={{
                          background: '#fff',
                          borderRadius: '14px',
                          boxShadow: '0 16px 48px rgba(0,0,0,0.16)',
                          minWidth: 220,
                          zIndex: 100,
                          overflow: 'hidden',
                          border: '1px solid rgba(0,0,0,0.06)',
                        }}
                      >
                        <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#999' }}>{user.email}</div>
                        </div>

                        {user.role !== 'admin' && (
                          <>
                            <Link className="d-flex align-items-center gap-2 px-3 py-2 text-dark" style={{ fontSize: '0.875rem', fontWeight: 500 }}
                              to="/orders" onClick={() => { setDropdownOpen(false); closeMobile(); }}>
                              <Package size={16} color="#777" /> My Orders
                            </Link>
                            <Link className="d-flex align-items-center gap-2 px-3 py-2 text-dark" style={{ fontSize: '0.875rem', fontWeight: 500 }}
                              to="/profile" onClick={() => { setDropdownOpen(false); closeMobile(); }}>
                              <User size={16} color="#777" /> Profile
                            </Link>
                          </>
                        )}

                        {user.role === 'admin' && (
                          <>
                            <Link className="d-flex align-items-center gap-2 px-3 py-2 text-dark" style={{ fontSize: '0.875rem', fontWeight: 500 }}
                              to="/admin" onClick={() => { setDropdownOpen(false); closeMobile(); }}>
                              <LayoutDashboard size={16} color="#777" /> Dashboard
                            </Link>
                            <Link className="d-flex align-items-center gap-2 px-3 py-2 text-dark" style={{ fontSize: '0.875rem', fontWeight: 500 }}
                              to="/admin/products" onClick={() => { setDropdownOpen(false); closeMobile(); }}>
                              <Package size={16} color="#777" /> Products
                            </Link>
                            <Link className="d-flex align-items-center gap-2 px-3 py-2 text-dark" style={{ fontSize: '0.875rem', fontWeight: 500 }}
                              to="/admin/orders" onClick={() => { setDropdownOpen(false); closeMobile(); }}>
                              <ClipboardList size={16} color="#777" /> Orders
                            </Link>
                            <Link className="d-flex align-items-center gap-2 px-3 py-2 text-dark" style={{ fontSize: '0.875rem', fontWeight: 500 }}
                              to="/admin/users" onClick={() => { setDropdownOpen(false); closeMobile(); }}>
                              <Users size={16} color="#777" /> Users
                            </Link>
                          </>
                        )}

                        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                          <button
                            className="d-flex align-items-center gap-2 px-3 py-2 w-100 border-0 bg-transparent text-danger"
                            style={{ fontSize: '0.875rem', fontWeight: 500 }}
                            onClick={handleLogout}
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="btn btn-sm"
                    to="/login"
                    onClick={closeMobile}
                    style={{
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50px',
                      padding: '0.4rem 1.2rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-sm"
                    to="/register"
                    onClick={closeMobile}
                    style={{
                      background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                      color: '#fff',
                      borderRadius: '50px',
                      padding: '0.4rem 1.2rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      border: 'none',
                    }}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
