import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { AnimatePresence, motion } from 'framer-motion';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer Pages
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import OrderDetail from './pages/customer/OrderDetail';
import Profile from './pages/customer/Profile';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import AddEditProduct from './pages/admin/AddEditProduct';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

const PageWrapper = ({ children }) => (
  <motion.div {...pageTransition} className="page-transition">
    {children}
  </motion.div>
);

const AppLayout = ({ children, hideFooter = false }) => (
  <div className="d-flex flex-column min-vh-100">
    <Navbar />
    <main className="flex-grow-1">
      {children}
    </main>
    {!hideFooter && <Footer />}
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Routes — no navbar/footer */}
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

        {/* Customer Routes */}
        <Route path="/" element={<AppLayout><PageWrapper><Home /></PageWrapper></AppLayout>} />
        <Route path="/products" element={<AppLayout><PageWrapper><Products /></PageWrapper></AppLayout>} />
        <Route path="/products/:id" element={<AppLayout><PageWrapper><ProductDetail /></PageWrapper></AppLayout>} />
        <Route
          path="/cart"
          element={
            <AppLayout>
              <PageWrapper><ProtectedRoute><Cart /></ProtectedRoute></PageWrapper>
            </AppLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <AppLayout>
              <PageWrapper><ProtectedRoute><Checkout /></ProtectedRoute></PageWrapper>
            </AppLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <AppLayout>
              <PageWrapper><ProtectedRoute><Orders /></ProtectedRoute></PageWrapper>
            </AppLayout>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <AppLayout>
              <PageWrapper><ProtectedRoute><OrderDetail /></ProtectedRoute></PageWrapper>
            </AppLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AppLayout>
              <PageWrapper><ProtectedRoute><Profile /></ProtectedRoute></PageWrapper>
            </AppLayout>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AppLayout hideFooter>
              <PageWrapper><ProtectedRoute adminOnly><Dashboard /></ProtectedRoute></PageWrapper>
            </AppLayout>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AppLayout hideFooter>
              <PageWrapper><ProtectedRoute adminOnly><ManageProducts /></ProtectedRoute></PageWrapper>
            </AppLayout>
          }
        />
        <Route
          path="/admin/products/add"
          element={
            <AppLayout hideFooter>
              <PageWrapper><ProtectedRoute adminOnly><AddEditProduct /></ProtectedRoute></PageWrapper>
            </AppLayout>
          }
        />
        <Route
          path="/admin/products/edit/:id"
          element={
            <AppLayout hideFooter>
              <PageWrapper><ProtectedRoute adminOnly><AddEditProduct /></ProtectedRoute></PageWrapper>
            </AppLayout>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AppLayout hideFooter>
              <PageWrapper><ProtectedRoute adminOnly><ManageOrders /></ProtectedRoute></PageWrapper>
            </AppLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AppLayout hideFooter>
              <PageWrapper><ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute></PageWrapper>
            </AppLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <AnimatedRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
